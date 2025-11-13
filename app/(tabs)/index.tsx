// app/(tabs)/whoop.tsx
import { WHOOP_API, authorizeWhoop, loadTokens, whoopFetch } from "@/components/Whoop";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";

import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// ---------- helpers ----------
const ms = (n?: number) => (typeof n === "number" ? n : 0);
const toKcal = (kilojoules?: number) =>
  typeof kilojoules === "number" ? Math.round(kilojoules / 4.184) : undefined;

function fmtMsToHrsMin(totalMs?: number) {
  const m = Math.round(ms(totalMs) / 60000);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h}h ${mm}m`;
}

function formatDate(dateString?: string) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-AU", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}


const pct = (n?: number) => (n == null ? "—" : `${Math.round(n)}%`);

function stagePercents(sleep: any) {
  const s = sleep?.score?.stage_summary;
  if (!s) return null;
  const total = Math.max(1, ms(s.total_in_bed_time_milli));
  return {
    awake: Math.round((ms(s.total_awake_time_milli) / total) * 100),
    light: Math.round((ms(s.total_light_sleep_time_milli) / total) * 100),
    rem: Math.round((ms(s.total_rem_sleep_time_milli) / total) * 100),
    sws: Math.round((ms(s.total_slow_wave_sleep_time_milli) / total) * 100),
  };
}
function qualityColor(perf?: number) {
  if (perf == null) return "#9ca3af";
  if (perf >= 90) return "#22c55e";
  if (perf >= 75) return "#eab308";
  return "#ef4444";
}
function strainColor(s?: number) {
  if (s == null) return "#9ca3af";
  if (s >= 14) return "#ef4444";
  if (s >= 7) return "#eab308";
  return "#22c55e";
}
const pickNumber = (obj: any, keys: string[]): number | undefined => {
  for (const k of keys) {
    const v = obj?.[k];
    if (typeof v === "number" && !Number.isNaN(v)) return v;
  }
  return undefined;
};

// ---------- screen ----------
export default function WhoopScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [recovery, setRecovery] = useState<any>(null);
  const [sleeps, setSleeps] = useState<any[]>([]);
  const [cycle, setCycle] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);

  // tabs / pager
  const [activeTab, setActiveTab] = useState<"Daily Summary" | "Workouts">("Daily Summary");
  const pagerRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const BOTTOM_CLEAR = insets.bottom + 100;

  const signIn = async () => {
    setErr(null);
    setLoading(true);
    try {
      await authorizeWhoop();
      await loadData();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    setErr(null);
    setLoading(true);
    try {
      const p = await whoopFetch(WHOOP_API.endpoints.profile);
      setProfile(p);

      const rec = await whoopFetch(`${WHOOP_API.endpoints.recoveries}?limit=1`);
      setRecovery(rec.records?.[0] ?? null);

      const sl = await whoopFetch(`${WHOOP_API.endpoints.sleeps}?limit=10`);
      setSleeps(sl.records ?? []);

      const cy = await whoopFetch(`${WHOOP_API.endpoints.cycles}?limit=1`);
      setCycle(cy.records?.[0] ?? null);

      const wk = await whoopFetch(`${WHOOP_API.endpoints.workouts}?limit=5`);
      setWorkouts(wk.records ?? []);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTokens()
      .then((t) => {
        if (t) loadData();
      })
      .catch(() => {});
  }, []);

  // derived (sleep/strain)
  const latestSleep = sleeps?.[0];
  const perf = latestSleep?.score?.sleep_performance_percentage as number | undefined;
  const eff = latestSleep?.score?.sleep_efficiency_percentage as number | undefined;
  const duration = latestSleep
    ? fmtMsToHrsMin(
        latestSleep.end && latestSleep.start
          ? new Date(latestSleep.end).getTime() - new Date(latestSleep.start).getTime()
          : latestSleep.score?.stage_summary?.total_in_bed_time_milli
      )
    : "—";

  // calories (from cycle, fallback to workouts)

  const cycleKJ =
    pickNumber(cycle?.score, ["kilojoule", "kilojoules", "total_kilojoule"]) ??
    pickNumber(cycle, ["kilojoule", "kilojoules"]);
  const cycleKcal =
    toKcal(cycleKJ) ??
    pickNumber(cycle?.score, ["kcal", "calories", "calories_kcal"]) ??
    pickNumber(cycle, ["kcal", "calories", "calories_kcal"]);

  const workoutsKJSum = (workouts || []).reduce((acc: number, w: any) => {
    const k = pickNumber(w?.score, ["kilojoule", "kilojoules"]);
    return acc + (k || 0);
  }, 0);
  const calories = (cycleKcal ?? (workoutsKJSum ? Math.round(workoutsKJSum / 4.184) : 0)) as number;

  // recovery metrics to replace steps & hydration cards
  const hrvMs =
    typeof recovery?.score?.hrv_rmssd_milli === "number"
      ? Math.round(recovery.score.hrv_rmssd_milli)
      : undefined;
  const rhrBpm =
    typeof recovery?.score?.resting_heart_rate === "number"
      ? Math.round(recovery.score.resting_heart_rate)
      : undefined;

  const healthScore = recovery?.score?.recovery_score ?? 80;
  const healthTrend = "+12%";
  const isHealthy = healthScore >= 67;

  // pager handlers
  const goToTab = (tab: "Daily Summary" | "Workouts") => {
    setActiveTab(tab);
    const page = tab === "Daily Summary" ? 0 : 1;
    pagerRef.current?.scrollTo({ x: page * width, y: 0, animated: true });
  };
  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveTab(page === 0 ? "Daily Summary" : "Workouts");
  };

  const { userprofile } = useAuth();

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#ffffff", position:'relative'}}>
      {/* {loading && (
        <ActivityIndicator style={{ position: "absolute", top: 50, left: "50%", zIndex: 1 }} />
      )} */}
      {err && <Text style={{ color: "red", textAlign: "center", padding: 10 }}>{err}</Text>}

      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#000" }}>
              Hello, {userprofile?.firstName}!
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }} />
        </View>

        {/* Top Tabs */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          {(["Daily Summary", "Workouts"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => goToTab(tab)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: activeTab === tab ? "#000" : "transparent",
              }}
            >
              <Text
                style={{
                  color: activeTab === tab ? "#fff" : "#6b7280",
                  fontWeight: activeTab === tab ? "600" : "400",
                  fontSize: 14,
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* PAGER */}
      <ScrollView
        ref={pagerRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        contentOffset={{ x: activeTab === "Daily Summary" ? 0 : width, y: 0 }}
        style={{ flex: 1 }}
      >
        {/* ===== Page 1: Daily Summary ===== */}
        <ScrollView
          style={{ width }}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
          }
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: BOTTOM_CLEAR }}
        >
          {/* Date Label */}
          <View style={{ marginBottom: 10, marginLeft: 10 }}>
            <Text style={{ fontSize: 14, color: "#6b7280" }}>
              {formatDate(
                cycle?.start ||
                latestSleep?.start ||
                recovery?.created_at
              )}
            </Text>
          </View>

          {/* Sign in button */}
          {!profile && (
            <View style={{ marginBottom: 20 }}>
              <TouchableOpacity
                onPress={signIn}
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
          )}

          {/* Health Summary */}
          {recovery && (
            <View
              style={{
                backgroundColor: "#3b82f6",
                borderRadius: 16,
                padding: 20,
                marginBottom: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                <Ionicons name="heart" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                  {isHealthy ? "You are healthy!" : "Focus on recovery"}
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <Text style={{ color: "#fff", fontSize: 48, fontWeight: "bold", marginRight: 12 }}>
                  {healthScore}%
                </Text>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor: "#22c55e",
                        borderRadius: 4,
                        marginRight: 6,
                      }}
                    />
                    <Text style={{ color: "#fff", fontSize: 14, fontWeight: "500" }}>
                      Increased {healthTrend}
                    </Text>
                  </View>
                  <Text style={{ color: "#fff", fontSize: 14, opacity: 0.9 }}>
                    {isHealthy ? "Keep it up! Healthy lifestyle on track" : "Focus on rest and recovery"}
                  </Text>
                </View>
              </View>

              {/* progress */}
              <View style={{ marginTop: 16 }}>
                <View
                  style={{
                    height: 8,
                    backgroundColor: "rgba(255,255,255,0.3)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <View style={{ width: `${healthScore}%`, height: "100%", backgroundColor: "#fff", borderRadius: 4 }} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                  <Text style={{ color: "#fff", fontSize: 12, opacity: 0.8 }}>Unhealthy</Text>
                  <Text style={{ color: "#fff", fontSize: 12, opacity: 0.8 }}>Very Healthy</Text>
                </View>
              </View>
            </View>
          )}

          {/* Activity Summary — WHOOP values */}
          <View style={{ marginBottom: 20 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#000" }}>Activity Summary</Text>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              {/* HRV (RMSSD) */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#ede9fe",
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name="pulse" size={20} color="#7c3aed" />
                </View>
                <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>HRV</Text>
                <Text style={{ fontSize: 24, fontWeight: "bold", color: "#000", marginBottom: 2 }}>
                  {hrvMs ?? "—"}
                </Text>
                <Text style={{ fontSize: 12, color: "#6b7280" }}>ms</Text>
              </View>

              {/* Calories (kcal) */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#fef3c7",
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name="flame" size={20} color="#f59e0b" />
                </View>
                <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>Calories</Text>
                <Text style={{ fontSize: 24, fontWeight: "bold", color: "#000", marginBottom: 2 }}>
                  {calories}
                </Text>
                <Text style={{ fontSize: 12, color: "#6b7280" }}>KCal</Text>
              </View>

              {/* Resting HR */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#fee2e2",
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name="heart" size={20} color="#ef4444" />
                </View>
                <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>Resting HR</Text>
                <Text style={{ fontSize: 24, fontWeight: "bold", color: "#000", marginBottom: 2 }}>
                  {rhrBpm ?? "—"}
                </Text>
                <Text style={{ fontSize: 12, color: "#6b7280" }}>bpm</Text>
              </View>
            </View>
          </View>

          {/* Today's Strain */}
          {cycle && (
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                shadowColor: "#000",
                // shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000", marginBottom: 12 }}>
                Today&apos;s Strain
              </Text>
              <View style={{ height: 8, backgroundColor: "#e5e7eb", borderRadius: 4, marginBottom: 8 }}>
                <View
                  style={{
                    width: `${Math.round(((cycle.score?.strain ?? 0) / 21) * 100)}%`,
                    height: 8,
                    backgroundColor: strainColor(cycle.score?.strain),
                    borderRadius: 4,
                  }}
                />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: strainColor(cycle.score?.strain),
                  marginBottom: 8,
                }}
              >
                {cycle.score?.strain?.toFixed?.(2) ?? "—"} / 21
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, color: "#6b7280" }}>
                  Avg HR: {cycle.score?.average_heart_rate ?? "—"} bpm
                </Text>
                <Text style={{ fontSize: 14, color: "#6b7280" }}>
                  Max HR: {cycle.score?.max_heart_rate ?? "—"} bpm
                </Text>
              </View>
            </View>
          )}

          {/* Last Sleep */}
          {latestSleep && (
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000", marginBottom: 12 }}>
                Last Sleep
              </Text>
              <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>
                Duration: {fmtMsToHrsMin(
                  latestSleep.end && latestSleep.start
                    ? new Date(latestSleep.end).getTime() - new Date(latestSleep.start).getTime()
                    : latestSleep.score?.stage_summary?.total_in_bed_time_milli
                )}
              </Text>
              <View style={{ height: 8, backgroundColor: "#e5e7eb", borderRadius: 4, marginBottom: 8 }}>
                <View
                  style={{
                    width: `${latestSleep?.score?.sleep_performance_percentage ?? 0}%`,
                    height: 8,
                    backgroundColor: qualityColor(latestSleep?.score?.sleep_performance_percentage),
                    borderRadius: 4,
                  }}
                />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: qualityColor(latestSleep?.score?.sleep_performance_percentage),
                  marginBottom: 8,
                }}
              >
                Sleep Performance: {pct(latestSleep?.score?.sleep_performance_percentage)}
              </Text>
              <Text style={{ fontSize: 14, color: "#6b7280" }}>
                Sleep Efficiency: {pct(latestSleep?.score?.sleep_efficiency_percentage)}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* ===== Page 2: Workouts ===== */}
        <ScrollView
          style={{ width }}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
          }
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: BOTTOM_CLEAR }}
        >
          <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 16 }}>Workouts</Text>

          {workouts?.length ? (
            workouts.slice(0, 5).map((w, i) => {
              const wKJ =
                pickNumber(w?.score, ["kilojoule", "kilojoules"]) ??
                pickNumber(w, ["kilojoule", "kilojoules"]);
              const wKcal =
                toKcal(wKJ) ??
                pickNumber(w?.score, ["kcal", "calories", "calories_kcal"]);
              return (
                <View
                  key={`${w.id ?? i}`}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
                    {w.sport_name ?? "Workout"}
                  </Text>
                  <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 6 }}>
                    Start: {w.start ? new Date(w.start).toLocaleString() : "—"}
                  </Text>
                  <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 6 }}>
                    Duration: {fmtMsToHrsMin(w?.score?.duration)}
                  </Text>
                  <Text style={{ fontSize: 14, color: "#6b7280" }}>
                    {wKcal != null
                      ? `Energy: ${wKcal} kcal`
                      : `Avg HR: ${w?.score?.average_heart_rate ?? "—"} bpm`}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={{ color: "#6b7280" }}>
              No workouts found. Start a session and check back.
            </Text>
          )}
        </ScrollView>
      </ScrollView>
{/* Floating Round Button (Bottom Right) */}
<TouchableOpacity
  onPress={() => router.push('/message')}
  style={{
    position: "absolute",
    right: 20,
    bottom: 100,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  }}
>
  <Ionicons name="pencil" size={30} color="#fff" />
  {/* <Icons.NotePencilIcon size={verticalScale(10)} color={colors.white} weight='bold'/> */}
  
</TouchableOpacity>

    </SafeAreaView>
  );
}