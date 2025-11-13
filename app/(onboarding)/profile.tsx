import Input from "@/components/Input";
import { authorizeWhoop } from "@/components/Whoop";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";


import React, { useRef, useState } from "react";
import {
  Alert,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";

const TOTAL_PAGES = 4;

export default function ProfileOnboarding() {
  const { user, refreshUserProfile } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const firstNameInputRef = useRef<TextInput>(null);
  const lastNameInputRef = useRef<TextInput>(null);
  const ageInputRef = useRef<TextInput>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Map goal IDs to goal names
  const goalNames: { [key: number]: string } = {
    1: "Mental wellbeing",
    2: "Productivity",
    3: "Physical Health",
    4: "Yap to a friend"
  };
  
  const toggleGoal = (goalId: number) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        // Remove if already selected
        return prev.filter(id => id !== goalId);
      } else {
        // Add if not selected
        return [...prev, goalId];
      }
    });
  };
  const saveUserData = async () => {
    if (!user) {
      Alert.alert("Error", "You must be signed in to save your profile.");
      return;
    }

    setIsSaving(true);
    try {
      // Map selected goal IDs to goal names
      const goals = selectedGoals.map(id => goalNames[id]).filter(Boolean);
      
      const userData = {
        uid: user.uid,
        firstName: firstName.trim(),
        email: user.email,
        lastName: lastName.trim(),
        age: age.trim() ? parseInt(age.trim()) : null,
        goals: goals,
        profileComplete: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, userData, { merge: true });
      await refreshUserProfile();
      router.push("/(tabs)");
    } catch (error: any) {
      console.error("Error saving user data:", error);
      Alert.alert("Error", error?.message || "Failed to save your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    if (currentPage < TOTAL_PAGES - 1) {
      const nextPage = currentPage + 1;
      scrollViewRef.current?.scrollTo({
        x: nextPage * width,
        animated: true,
      });
      // State will be updated by handleScroll when animation completes
    } else {
      // On the last page, save data to Firebase
      saveUserData();
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / width);
    setCurrentPage(page);
  };

  const handleWhoopConnect = async () => {
    try {
      await authorizeWhoop();   // user logs in once
      // await clearErrors();

      if (!user?.uid) {
        throw new Error("User ID is missing.");
      }

      // save in Firestore that WHOOP is connected

      await setDoc(
        doc(db, "users", user.uid),
        { whoopConnected: true },
        { merge: true }
      );


      // nextOnboardingStep();
    } catch (err) {
      console.log(err);
      let message = "Failed to connect WHOOP. Please try again.";
      if (err instanceof Error) {
        message = err.message;
      }
      Alert.alert("WHOOP Error", message);
    }
  };

  const renderPage = (pageIndex: number) => {

    const titles = [
      { medium: "What is your", large: "Name", medium2: "" },
      { medium: "What is your", large: "Age", medium2: "" },
      { medium: "What is your", large: "Goal", medium2: "for using the app" },
      { medium: "Connect your", large: "WHOOP", medium2: "" },
    ];

    const subtitles = [
      "In order to know your needs, so we have 3 questions.",
      "This is the first question of the onboarding process.",
      "This is the second question of the onboarding process.",
    ];

    const title = titles[pageIndex] || titles[0];
    const subtitle = subtitles[pageIndex] || subtitles[0];

    return (
      <View key={pageIndex} style={[styles.page, { width }]}>
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleContainer}>
            <Text style={styles.titleMedium}>{title.medium}</Text>
            <Text style={styles.titleLarge}>{title.large}</Text>
            {title.medium2 ? (
              <Text style={styles.titleMedium}>{title.medium2}</Text>
            ) : null}
          </View>

          {/* Subtitle */}
          {/* <Text style={styles.subtitle}>{subtitle}</Text> */}
            {pageIndex==0 ? (<View style={{gap:10}}>
              <Input placeholder='First Name' color={colors.black} onChangeText={(value: string) => setFirstName(value)} icon={<Ionicons name="person" size={24} color="black" />} inputRef={firstNameInputRef}/>
              <Input placeholder='Last Name' color={colors.black} onChangeText={(value: string) => setLastName(value)} icon={<Ionicons name="person" size={24} color="black" />} inputRef={lastNameInputRef}/>
            </View>): null}
            {pageIndex==1 ? (<View>
              <Input placeholder='Age' color={colors.black} onChangeText={(value: string) => setAge(value)} keyboardType="number-pad" icon={<Ionicons name="calendar" size={24} color="black" />} inputRef={ageInputRef}/>
            </View>): null}
            {pageIndex==2 ? (<View>
              <View style={styles.gridContainer}>
                {/* Top Row */}
                <View style={styles.row}>
                  <TouchableOpacity 
                    style={[
                      styles.section,
                      selectedGoals.includes(1) && styles.sectionSelected
                    ]}
                    onPress={() => toggleGoal(1)}
                  >
                    <Text style={[
                      styles.sectionText,
                      selectedGoals.includes(1) && styles.sectionTextSelected
                    ]}>Mental wellbeing</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.section,
                      selectedGoals.includes(2) && styles.sectionSelected
                    ]}
                    onPress={() => toggleGoal(2)}
                  >
                    <Text style={[
                      styles.sectionText,
                      selectedGoals.includes(2) && styles.sectionTextSelected
                    ]}>Productivity</Text>
                  </TouchableOpacity>
                </View>

                {/* Bottom Row */}
                <View style={styles.row}>
                  <TouchableOpacity 
                    style={[
                      styles.section,
                      selectedGoals.includes(3) && styles.sectionSelected
                    ]}
                    onPress={() => toggleGoal(3)}
                  >
                    <Text style={[
                      styles.sectionText,
                      selectedGoals.includes(3) && styles.sectionTextSelected
                    ]}>Physical Health</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.section,
                      selectedGoals.includes(4) && styles.sectionSelected
                    ]}
                    onPress={() => toggleGoal(4)}
                  >
                    <Text style={[
                      styles.sectionText,
                      selectedGoals.includes(4) && styles.sectionTextSelected
                    ]}>Yap to a friend</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>): null}
            {pageIndex==3 ? (
              <View>
                {/* <Text>
                  Whoop Whoop
                </Text> */}
                <View style={{ marginBottom: 20 }}>
                <TouchableOpacity
                  onPress={handleWhoopConnect}
                  style={{
                    backgroundColor: "#3b82f6",
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                    Sign in to WHOOP
                  </Text>
                </TouchableOpacity>
              </View>
              </View>
            ):null}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Horizontal ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        scrollEnabled={false}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {Array.from({ length: TOTAL_PAGES }).map((_, index) => renderPage(index))}
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Pagination Dots - Bottom Left */}
        <View style={styles.paginationContainer}>
          {Array.from({ length: TOTAL_PAGES }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentPage === index && styles.paginationDotActive,
              ]}
            >
            
            </View>
          ))}
        </View>

        {/* Decorative Pattern - Bottom Left (next to pagination) */}

        {/* Next Button - Bottom Right */}
        <TouchableOpacity 
          style={[styles.nextButton, isSaving && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={isSaving}
        >
          {isSaving ? (
            <Text style={{ color: colors.white, fontSize: 16 }}>Saving...</Text>
          ) : (
            <Ionicons name="chevron-forward" size={24} color={colors.white} />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const reddishBrown = "#000";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA", // Light off-white background
  },
  scrollView: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 24,
    justifyContent: "flex-start",
  },
  titleContainer: {
    marginBottom: 24,
  },
  titleMedium: {
    fontSize: 24,
    fontWeight: "700",
    color: reddishBrown,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  titleLarge: {
    fontSize: 72,
    fontWeight: "700",
    color: reddishBrown,
    textTransform: "uppercase",
    letterSpacing: 1,
    lineHeight: 80,
  },
  subtitle: {
    fontSize: 16,
    color: colors.black,
    lineHeight: 24,
    marginTop: 8,
  },
  gridContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  row: {
    flexDirection: 'row', // Arranges sections horizontally within a row
    gap: 10,
    minHeight: 150,
  },
  section: {
    flex: 1, // Each section takes up half the horizontal space within its row
    height: 150,
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
    backgroundColor:'rgba(0,0,0,0.2)',
    borderRadius:10
  },
  sectionSelected: {
    backgroundColor: 'rgba(0,0,0,1)', // Darker brown when selected
    borderWidth: 2,
    borderColor: '#000',
  },
  sectionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTextSelected: {
    fontSize: 18,
    color:'#fff',
    fontWeight: 'bold',
  },
  bottomSection: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    height: 200,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  paginationContainer: {
    position: "absolute",
    bottom: 8,
    left: 24,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    zIndex: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neutral300,
  },
  paginationDotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: reddishBrown,
  },
  patternContainer: {
    position: "absolute",
    bottom: 0,
    left: 100,
    width: 120,
    height: 120,
  },
  pattern: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  square: {
    position: "absolute",
    borderWidth: 2,
    borderColor: reddishBrown,
    backgroundColor: "transparent",
  },
  square1: {
    width: 100,
    height: 100,
    top: 10,
    left: 10,
    transform: [{ rotate: "0deg" }],
  },
  square2: {
    width: 70,
    height: 70,
    top: 25,
    left: 25,
    transform: [{ rotate: "45deg" }],
  },
  square3: {
    width: 40,
    height: 40,
    top: 40,
    left: 40,
    transform: [{ rotate: "0deg" }],
  },
  diamond: {
    position: "absolute",
    borderWidth: 2,
    borderColor: reddishBrown,
    backgroundColor: "transparent",
  },
  diamond1: {
    width: 50,
    height: 50,
    top: 35,
    left: 35,
    transform: [{ rotate: "45deg" }],
  },
  nextButton: {
    position: "absolute",
    bottom: 0,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: reddishBrown,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
});
