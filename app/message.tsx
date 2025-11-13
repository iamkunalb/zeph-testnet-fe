import BackButton from '@/components/BackButton';
import { colors } from '@/constants/theme';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit-ethers-react-native';
import { ethers } from 'ethers';
import { router, useNavigation } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import AIAgentAbi from '../ChatBot.json';

const RPC_URL = 'https://testnet.sapphire.oasis.io';
const CONTRACT_ADDRESS = '0x99Cc0E7335A2DBbF3B79eAa62FC49f9aA707E873';


// ---------- TYPES ----------
type Message = { id: string; sender: 'user' | 'ai'; text: string };
const AVATAR = require('@/assets/images/batman.jpg');
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

// ---------- COMPONENT ----------
export default function MessageScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider();

  const publicProvider = useMemo(() => new ethers.JsonRpcProvider(RPC_URL), []);
  const readContract = useMemo(
    () => new ethers.Contract(CONTRACT_ADDRESS, (AIAgentAbi as any).abi, publicProvider),
    [publicProvider]
  );

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [userMessages, setUserMsg] = useState<string[]>([]);
  const [aiMessages, setAiMessages] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const typingAnim1 = useRef(new Animated.Value(0)).current;
  const typingAnim2 = useRef(new Animated.Value(0)).current;
  const typingAnim3 = useRef(new Animated.Value(0)).current;

  // ---------- startSession (1 tx) ----------
  const startSession = useCallback(async () => {
    if (!walletProvider) {
      Alert.alert('Connect Wallet', 'Please connect your wallet first.');
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, (AIAgentAbi as any).abi, signer);
      const id = Math.floor(Date.now() / 1000);
      console.log('startSession1');
      const tx = await contract.startSession(id);
      console.log('startSession2');
      await tx.wait();
      console.log('startSession3');
      setSessionId(id);
      Alert.alert('Chat started', `Session ID: ${id}`);
    } catch (err) {
      console.error('startSession failed:', err);
      Alert.alert('Error', 'Failed to start session.');
    }
    
  }, [walletProvider]);

  // ---------- sendMessage (off-chain via TEE RPC) ----------
  // ---------- sendMessage (ROFL TEE call) ----------
const sendMessage = useCallback(async () => {
  if (!message.trim() || !walletProvider || !sessionId) {
    Alert.alert('Error', 'Message empty or session not started.');
    return;
  }

  const nav = useNavigation();

  useLayoutEffect(() => {
    nav.setOptions({
      tabBarStyle: { display: "none" },
    });
  }, [nav]);

  const text = message.trim();
  setUserMsg((prev) => [...prev, text]);
  setMessage('');
  setIsTyping(true);

  try {
    const provider = new ethers.BrowserProvider(walletProvider);

    // Call your TEE LLM directly via Sapphire's RPC extension
    const reply: string = await provider.send('rofl_call', {
      method: 'handle_client_message',
      params: [sessionId, text],
    });

    // Display the LLM’s real response
    setAiMessages((prev) => [...prev, reply]);
  } catch (err) {
    console.error('TEE message error:', err);
    setAiMessages((prev) => [...prev, '⚠️ Failed to reach TEE']);
  } finally {
    setIsTyping(false);
  }
}, [message, walletProvider, sessionId]);

  

  // ---------- finalizeSession (1 tx) ----------
  const finalizeSession = useCallback(async () => {
    if (!walletProvider || !sessionId) return;
    try {
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, (AIAgentAbi as any).abi, signer);
      const tx = await contract.storeConversation(sessionId, [], []); // Oracle fills from enclave memory
      await tx.wait();
      Alert.alert('✅ Session finalized', 'Chat saved on-chain.');
      setSessionId(null);
      setUserMsg([]);
      setAiMessages([]);
    } catch (err) {
      console.error('Finalize failed:', err);
      Alert.alert('Error', 'Failed to finalize session.');
    }
  }, [walletProvider, sessionId]);

  // ---------- typing animation ----------
  useEffect(() => {
    if (isTyping) {
      const loop = () => {
        Animated.sequence([
          Animated.parallel([
            Animated.timing(typingAnim1, { toValue: 1, duration: 400, useNativeDriver: false }),
            Animated.timing(typingAnim2, { toValue: 1, duration: 400, delay: 200, useNativeDriver: false }),
            Animated.timing(typingAnim3, { toValue: 1, duration: 400, delay: 400, useNativeDriver: false }),
          ]),
          Animated.parallel([
            Animated.timing(typingAnim1, { toValue: 0, duration: 400, useNativeDriver: false }),
            Animated.timing(typingAnim2, { toValue: 0, duration: 400, delay: 200, useNativeDriver: false }),
            Animated.timing(typingAnim3, { toValue: 0, duration: 400, delay: 400, useNativeDriver: false }),
          ]),
        ]).start(() => {
          if (isTyping) loop();
        });
      };
      loop();
    } else {
      typingAnim1.setValue(0);
      typingAnim2.setValue(0);
      typingAnim3.setValue(0);
    }
  }, [isTyping]);


  // ---------- keyboard animation ----------
  useEffect(() => {
    let showSub: any, hideSub: any;
    if (Platform.OS === 'ios') {
      showSub = Keyboard.addListener('keyboardWillShow', (e: any) => {
        Animated.timing(keyboardOffset, { toValue: e.endCoordinates.height, duration: e.duration, useNativeDriver: false }).start();
      });
      hideSub = Keyboard.addListener('keyboardWillHide', (e: any) => {
        Animated.timing(keyboardOffset, { toValue: 0, duration: e.duration, useNativeDriver: false }).start();
      });
    } else {
      showSub = Keyboard.addListener('keyboardDidShow', (e: any) => {
        Animated.timing(keyboardOffset, { toValue: e.endCoordinates.height, duration: 250, useNativeDriver: false }).start();
      });
      hideSub = Keyboard.addListener('keyboardDidHide', () => {
        Animated.timing(keyboardOffset, { toValue: 0, duration: 250, useNativeDriver: false }).start();
      });
    }
    return () => {
      showSub?.remove();
      hideSub?.remove();
    };
  }, [keyboardOffset]);

  // ---------- render ----------
  const chatHistory: Message[] = [];
  userMessages.forEach((u, i) => {
    chatHistory.push({ id: `u-${i}`, sender: 'user', text: u });
    if (aiMessages[i]) chatHistory.push({ id: `a-${i}`, sender: 'ai', text: aiMessages[i] });
  });

  return (
    <>
      <Modal visible={isLoading} animationType="fade" transparent>
        <View style={styles.loadingModalOverlay}>
          <View style={styles.loadingModal}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading chat...</Text>
          </View>
        </View>
      </Modal>

      <Animated.View style={{ flex: 1, paddingBottom: keyboardOffset, backgroundColor: colors.white }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <BackButton iconSize={12} onPress={() => router.back()} />
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.headerName}>{sessionId ? `Session ${sessionId}` : 'New Chat'}</Text>
            </View>
            {!sessionId ? (
              <TouchableOpacity onPress={startSession}>
                <Icons.Play size={28} color={colors.primary} weight="bold" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={finalizeSession}>
                <Icons.CheckCircle size={28} color={colors.primary} weight="bold" />
              </TouchableOpacity>
            )}
          </View>

          {/* Chat area */}
          <View style={styles.chatArea}>
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.scrollViewStyle}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              <Text style={styles.dayLabel}>Today</Text>
              {chatHistory.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <View key={msg.id} style={[styles.bubbleRow, isUser ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
                    <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleOther]}>
                      <Text style={styles.bubbleText}>{msg.text}</Text>
                    </View>
                  </View>
                );
              })}
              {isTyping && (
                <View style={[styles.bubbleRow, { justifyContent: 'flex-start', marginTop: 8 }]}>
                  <View style={[styles.bubble, styles.bubbleOther, styles.typingBubble]}>
                    <View style={styles.typingIndicator}>
                      {[typingAnim1, typingAnim2, typingAnim3].map((anim, i) => (
                        <Animated.View
                          key={i}
                          style={[
                            styles.typingDot,
                            {
                              opacity: anim,
                              transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
                            },
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>

          {/* Input bar */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Message..."
              placeholderTextColor="#888"
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
              <Icons.PaperPlaneTilt size={24} color={colors.primary} weight="fill" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  loadingModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  loadingModal: { backgroundColor: colors.white, borderRadius: 16, padding: 32, alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, fontWeight: '500', color: colors.neutral900 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  headerName: { fontWeight: 'bold', fontSize: 18 },
  chatArea: { flex: 1, paddingHorizontal: 8 },
  scrollViewStyle: { paddingBottom: 20 },
  dayLabel: { alignSelf: 'center', fontWeight: '600', marginVertical: 12, fontSize: 16, opacity: 0.7 },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 2 },
  bubble: { maxWidth: '75%', borderRadius: 16, padding: 12, marginHorizontal: 8 },
  bubbleUser: { backgroundColor: colors.primary },
  bubbleOther: { backgroundColor: colors.neutral800 },
  bubbleText: { fontSize: 16, color: colors.neutral200 },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 10, margin: 10, borderWidth: 2, borderColor: colors.neutral300, borderRadius: 20 },
  input: { flex: 1, color: colors.neutral900, fontSize: 16, marginHorizontal: 10 },
  sendBtn: { borderRadius: 20, padding: 10, marginLeft: 6 },
  typingBubble: { minWidth: 60 },
  typingIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  typingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.neutral400, marginHorizontal: 2 },
});
