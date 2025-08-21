import BackButton from '@/components/BackButton';
import { colors } from '@/constants/theme';
import * as Icons from 'phosphor-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Keyboard,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useAppKitAccount,
  useAppKitProvider,
} from '@reown/appkit-ethers-react-native';
import { ethers } from 'ethers';

import ChatBotAbi from '../ChatBot.json';

// ====== CHAIN / CONTRACT CONFIG ======
const RPC_URL = 'https://testnet.sapphire.oasis.io';
const CONTRACT_ADDRESS = '0x2a9d8d1F878c5C245278Eb2C7131183510457867';

// ====== TYPES ======
type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
};

const AVATAR = require('@/assets/images/batman.jpg');
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

// ====== HELPERS ======
function cleanAIMessages(aiMessages: readonly [bigint, string][]) {
  return aiMessages.map(([index, text]) => {
    const cleanedText = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    return [Number(index), cleanedText] as const;
  });
}

function buildChatHistory(
  userMessages: readonly string[],
  aiMessages: readonly [bigint, string][]
): Message[] {
  const result: Message[] = [];
  const aiClean = cleanAIMessages(aiMessages);

  const aiMap = new Map<number, string[]>();
  for (const [i, t] of aiClean) {
    if (!aiMap.has(i)) aiMap.set(i, []);
    aiMap.get(i)!.push(t);
  }

  for (let i = 0; i < userMessages.length; i++) {
    result.push({ id: `user-${i}`, sender: 'user', text: userMessages[i] });
    const replies = aiMap.get(i) || [];
    replies.forEach((r, j) => {
      result.push({ id: `ai-${i}-${j}`, sender: 'ai', text: r });
    });
  }
  return result;
}

export default function MessageScreen() {
  // Wallet state from AppKit
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider();

  // Public provider for reads (no signer, no PK needed)
  const publicProvider = useMemo(
    () => new ethers.JsonRpcProvider(RPC_URL),
    []
  );

  // Read-only contract instance
  const readContract = useMemo(
    () => new ethers.Contract(CONTRACT_ADDRESS, (ChatBotAbi as any).abi, publicProvider),
    [publicProvider]
  );

  // On-demand signer + write-capable contract
  const getWriteContract = useCallback(async () => {
    if (!walletProvider) throw new Error('Wallet not connected');
    const browserProvider = new ethers.BrowserProvider(walletProvider);
    const signer = await browserProvider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, (ChatBotAbi as any).abi, signer);
  }, [walletProvider]);

  // UI state
  const [message, setMessage] = useState('');
  const [txHash, setTxHash] = useState('');
  const [userMessages, setUserMsg] = useState<string[]>([]);
  const [aiMessages, setAiMessages] = useState<[bigint, string][]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [pendingMessageIndex, setPendingMessageIndex] = useState<number | null>(null);

  const chatHistory = useMemo(
    () => buildChatHistory(userMessages, aiMessages),
    [userMessages, aiMessages]
  );

  const scrollViewRef = useRef<ScrollView>(null);
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const typingAnim1 = useRef(new Animated.Value(0)).current;
  const typingAnim2 = useRef(new Animated.Value(0)).current;
  const typingAnim3 = useRef(new Animated.Value(0)).current;

  // ====== READ FUNCTIONS (by address param) ======
  const fetchAnswers = useCallback(async (target?: string) => {
    try {
      const who = target ?? address;
      if (!who) return;
      const resp: [bigint, string][] = await readContract.getAnswers(who);
      setAiMessages(resp);
    } catch (err) {
      console.error('getAnswers error:', err);
    }
  }, [address, readContract]);

  const fetchPrompts = useCallback(async (target?: string) => {
    try {
      const who = target ?? address;
      if (!who) return;
      const prompts: string[] = await readContract.getPrompts(who);
      setUserMsg(prompts);
    } catch (err) {
      console.error('getPrompts error:', err);
    }
  }, [address, readContract]);

  // Initial + reactive loads
  useEffect(() => {
    fetchAnswers();
    fetchPrompts();
  }, [fetchAnswers, fetchPrompts]);

  // ====== WRITE: appendPrompt (uses signer from wallet) ======
  const sendMessage = useCallback(async () => {
    if (!message.trim()) return;
    try {
      if (!isConnected || !walletProvider) {
        Alert.alert('Connect Wallet', 'Please connect your wallet to send.');
        return;
      }
      const writeContract = await getWriteContract();

      // optimistic UI
      const currentMessageIndex = userMessages.length;
      setUserMsg(prev => [...prev, message]);
      setMessage('');
      setIsTyping(true);
      setPendingMessageIndex(currentMessageIndex);

      const tx = await writeContract.appendPrompt(message);
      setTxHash(tx.hash);
      await tx.wait();

      // Start polling for the response
      pollForResponse(currentMessageIndex);
    } catch (err: any) {
      console.error('appendPrompt failed:', err);
      Alert.alert('Error', String(err?.message ?? 'Transaction failed'));
      setIsTyping(false);
      setPendingMessageIndex(null);
    }
  }, [message, isConnected, walletProvider, getWriteContract, userMessages.length]);

  // ====== POLLING FOR AI RESPONSE ======
  const pollForResponse = useCallback(async (messageIndex: number) => {
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds max
    const pollInterval = 1000; // 1 second

    const poll = async () => {
      try {
        const who = address;
        if (!who) return;

        const [prompts, answers] = await Promise.all([
          readContract.getPrompts(who),
          readContract.getAnswers(who)
        ]);

        console.log(`Polling attempt ${attempts + 1}:`, {
          messageIndex,
          promptsLength: prompts.length,
          answersLength: answers.length,
          currentUserMessagesLength: userMessages.length
        });

        // Check if we have more answers than before
        if (answers.length > aiMessages.length) {
          console.log('New answers detected!', {
            oldLength: aiMessages.length,
            newLength: answers.length
          });
          
          // We got a response!
          setUserMsg(prompts);
          setAiMessages(answers);
          setIsTyping(false);
          setPendingMessageIndex(null);
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, pollInterval);
        } else {
          // Timeout - stop polling
          setIsTyping(false);
          setPendingMessageIndex(null);
          console.log('Polling timeout - no response received');
        }
      } catch (err) {
        console.error('Polling error:', err);
        setIsTyping(false);
        setPendingMessageIndex(null);
      }
    };

    poll();
  }, [address, readContract, aiMessages.length, userMessages.length]);

  // ====== Keyboard animation ======
  useEffect(() => {
    let showSub: any; let hideSub: any;
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
    return () => { showSub?.remove(); hideSub?.remove(); };
  }, [keyboardOffset]);

  // ====== Typing animation ======
  useEffect(() => {
    if (isTyping) {
      const startTypingAnimation = () => {
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
          if (isTyping) {
            startTypingAnimation();
          }
        });
      };
      startTypingAnimation();
    } else {
      typingAnim1.setValue(0);
      typingAnim2.setValue(0);
      typingAnim3.setValue(0);
    }
  }, [isTyping, typingAnim1, typingAnim2, typingAnim3]);

  // ====== Call modal (unchanged visuals, trimmed) ======
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [callModalExpanded, setCallModalExpanded] = useState(false);
  const callModalAnim = useRef(new Animated.Value(0)).current;

  const openCallModal = () => {
    setCallModalVisible(true);
    setCallModalExpanded(false);
    callModalAnim.setValue(0);
    setTimeout(() => {
      setCallModalExpanded(true);
      Animated.timing(callModalAnim, { toValue: 1, duration: 400, useNativeDriver: false }).start();
    }, 3000);
  };
  const closeCallModal = () => { setCallModalVisible(false); setCallModalExpanded(false); callModalAnim.setValue(0); };

  const modalStyle = {
    width: callModalAnim.interpolate({ inputRange: [0, 1], outputRange: [300, windowWidth] }),
    height: callModalAnim.interpolate({ inputRange: [0, 1], outputRange: [300, windowHeight] }),
    borderRadius: callModalAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }),
    padding: callModalAnim.interpolate({ inputRange: [0, 1], outputRange: [32, 0] }),
    backgroundColor: colors.neutral900,
  } as const;

  return (
    <Animated.View style={{ flex: 1, paddingBottom: keyboardOffset }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral900 }}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <BackButton iconSize={12} />
          <View style={{ flex: 1, marginLeft: 10, alignItems: 'center' }}>
            <Text style={styles.headerName}>New Chat</Text>
          </View>
          <TouchableOpacity style={styles.headerIcon} onPress={openCallModal}>
            <Icons.Phone size={22} color={colors.primary} weight="bold" />
          </TouchableOpacity>
        </View>

        {/* Chat area */}
        <View style={styles.chatArea}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollViewStyle}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            <Text style={styles.dayLabel}>Today</Text>
            {chatHistory.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.bubbleRow,
                    isUser ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' },
                    { marginTop: 8 },
                  ]}
                >
                  <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleOther]}>
                    <Text style={styles.bubbleText}>{msg.text}</Text>
                  </View>
                </View>
              );
            })}
            
            {/* Typing indicator */}
            {isTyping && (
              <View style={[styles.bubbleRow, { justifyContent: 'flex-start', marginTop: 8 }]}>
                <View style={[styles.bubble, styles.bubbleOther, styles.typingBubble]}>
                  <View style={styles.typingIndicator}>
                    <Animated.View 
                      style={[
                        styles.typingDot, 
                        { 
                          opacity: typingAnim1,
                          transform: [{ scale: typingAnim1.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.5, 1]
                          })}]
                        }
                      ]} 
                    />
                    <Animated.View 
                      style={[
                        styles.typingDot, 
                        { 
                          opacity: typingAnim2,
                          transform: [{ scale: typingAnim2.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.5, 1]
                          })}]
                        }
                      ]} 
                    />
                    <Animated.View 
                      style={[
                        styles.typingDot, 
                        { 
                          opacity: typingAnim3,
                          transform: [{ scale: typingAnim3.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.5, 1]
                          })}]
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity>
            <Icons.Paperclip size={24} color="#888" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Message"
            placeholderTextColor="#888"
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Icons.Microphone size={24} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Phone Call Modal */}
        <Modal visible={callModalVisible} animationType="fade" transparent onRequestClose={closeCallModal}>
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.callModal, modalStyle]}>
              <Image source={AVATAR} style={styles.callAvatar} />
              <Text style={styles.callName}>{callModalExpanded ? 'Talking to' : 'Calling...'}</Text>
              <Text style={styles.callNumber}>Alexa John</Text>
              <TouchableOpacity
                style={[styles.endCallBtn, callModalExpanded && styles.endCallBtnExpanded]}
                onPress={closeCallModal}
              >
                <Icons.PhoneSlash size={32} color="#fff" weight="fill" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>

        {/* Optional: show last tx hash */}
        {!!txHash && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
            <Text style={{ color: colors.neutral500, fontSize: 12 }}>Last tx: {txHash}</Text>
          </View>
        )}
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral900,
    padding: 16,
    elevation: 2,
  },
  headerName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.neutral200,
  },
  headerIcon: { marginLeft: 16, padding: 8, borderRadius: 12 },
  chatArea: { flex: 1, backgroundColor: colors.neutral900, paddingHorizontal: 8 },
  scrollViewStyle: { paddingBottom: 20 },
  dayLabel: {
    alignSelf: 'center',
    color: colors.neutral200,
    fontWeight: '600',
    marginVertical: 12,
    fontSize: 16,
    opacity: 0.7,
  },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end' },
  bubble: { maxWidth: '75%', borderRadius: 16, padding: 12, marginHorizontal: 8, marginBottom: 2 },
  bubbleUser: { backgroundColor: colors.primary, alignSelf: 'flex-end' },
  bubbleOther: { backgroundColor: colors.neutral800, alignSelf: 'flex-start' },
  bubbleText: { fontSize: 16, color: colors.neutral200 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral900,
    padding: 10,
    borderRadius: 20,
    margin: 10,
    elevation: 2,
    borderWidth: 2,
    borderColor: colors.neutral800,
  },
  input: { flex: 1, color: colors.neutral200, fontSize: 16, marginHorizontal: 10, paddingVertical: 6 },
  sendBtn: { borderRadius: 20, padding: 10, marginLeft: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  callModal: { backgroundColor: colors.neutral900, borderRadius: 24, alignItems: 'center', justifyContent: 'center', padding: 32, width: 300 },
  callAvatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 16 },
  callName: { color: colors.neutral200, fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  callNumber: { color: colors.neutral400, fontSize: 16, marginBottom: 32 },
  endCallBtn: { backgroundColor: '#E53935', borderRadius: 32, padding: 16, marginTop: 8 },
  endCallBtnExpanded: { position: 'absolute', bottom: 48, alignSelf: 'center' },
  typingBubble: { minWidth: 60 },
  typingIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  typingDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: colors.neutral400, 
    marginHorizontal: 2 
  },
});
