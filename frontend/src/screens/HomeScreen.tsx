import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../theme";

const outfitItems = [
  {
    id: 1,
    label: "Linen Blazer",
    tag: "Light layer",
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=120&h=160&fit=crop&auto=format",
  },
  {
    id: 2,
    label: "White Tee",
    tag: "Breathable",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120&h=160&fit=crop&auto=format",
  },
  {
    id: 3,
    label: "Slim Chinos",
    tag: "Versatile",
    img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=120&h=160&fit=crop&auto=format",
  },
  {
    id: 4,
    label: "Canvas Sneakers",
    tag: "Casual",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&h=160&fit=crop&auto=format",
  },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const temps = [24, 22, 28, 31, 26, 23, 21];
const icons = ["☁️", "🌤️", "☀️", "☀️", "⛅", "🌧️", "🌦️"];

export default function HomeScreen() {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const todayIdx = 3;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>MONDAY, AUG 18</Text>
          <Text style={styles.greeting}>Good morning, Alex</Text>
        </View>
        <Pressable style={styles.bellButton}>
          <Text style={{ fontSize: 18 }}>🔔</Text>
        </Pressable>
      </View>

      {/* Weather + Location Card */}
      <View style={styles.weatherCard}>
        <LinearGradient
          colors={["#b8892a26", "transparent", "#2e6fd41c"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.weatherInner}>
          <View style={styles.weatherTop}>
            <View>
              <View style={styles.locationRow}>
                <Text style={{ fontSize: 12 }}>📍</Text>
                <Text style={styles.locationText}>Dubai, UAE</Text>
              </View>
              <View style={styles.tempRow}>
                <Text style={styles.tempText}>31°</Text>
                <View style={styles.feelsCol}>
                  <Text style={styles.feelsText}>Feels 34°</Text>
                  <Text style={styles.conditionText}>Sunny & Hazy</Text>
                </View>
              </View>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontSize: 48 }}>☀️</Text>
              <View style={styles.uvBadge}>
                <Text style={styles.uvBadgeText}>UV Index 9 · High</Text>
              </View>
            </View>
          </View>

          {/* 7-day strip */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekStrip} contentContainerStyle={{ gap: 8 }}>
            {weekDays.map((d, i) => {
              const active = i === todayIdx;
              return (
                <View key={d} style={[styles.dayPill, active && styles.dayPillActive]}>
                  <Text style={[styles.dayLabel, { color: active ? colors.onGold : colors.muted }]}>{d}</Text>
                  <Text style={{ fontSize: 14 }}>{icons[i]}</Text>
                  <Text style={[styles.dayTemp, { color: active ? colors.onGold : colors.text }]}>{temps[i]}°</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* AI Recommendation */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Today's Outfit</Text>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>✦ AI Pick · 94% Match</Text>
          </View>
        </View>

        {/* Outfit reasoning */}
        <View style={styles.reasoningCard}>
          <LinearGradient colors={[colors.gold, "#8a6030"]} style={styles.reasoningIcon}>
            <Text style={{ fontSize: 16 }}>✦</Text>
          </LinearGradient>
          <Text style={styles.reasoningText}>
            It's hot and humid today. I've picked breathable, light-colored pieces from your wardrobe to keep you
            cool while looking sharp.
          </Text>
        </View>

        {/* Outfit items grid */}
        <View style={styles.outfitGrid}>
          {outfitItems.map((item) => (
            <View key={item.id} style={styles.outfitItem}>
              <View style={styles.outfitImageBox}>
                <Image source={{ uri: item.img }} style={styles.outfitImage} resizeMode="cover" />
              </View>
              <Text style={styles.outfitLabel}>{item.label}</Text>
              <Text style={styles.outfitTag}>{item.tag}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => setLiked(!liked)}
            style={[styles.actionButton, { backgroundColor: liked ? "#c8a96e22" : colors.surface, borderColor: liked ? colors.gold : colors.border }]}
          >
            <Text style={[styles.actionButtonText, { color: liked ? colors.gold : colors.muted }]}>
              {liked ? "♥" : "♡"} {liked ? "Loved" : "Love it"}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSaved(!saved)}
            style={[styles.actionButton, { backgroundColor: saved ? colors.gold : colors.surface, borderColor: saved ? colors.gold : colors.border }]}
          >
            <Text style={[styles.actionButtonText, { color: saved ? colors.onGold : colors.muted }]}>
              {saved ? "✓" : "+"} {saved ? "Saved" : "Save look"}
            </Text>
          </Pressable>
          <Pressable style={styles.shuffleButton}>
            <Text style={{ fontSize: 18 }}>🔄</Text>
          </Pressable>
        </View>
      </View>

      {/* Style Tip */}
      <View style={styles.tipCard}>
        <Text style={styles.tipEyebrow}>✦ STYLE TIP</Text>
        <Text style={styles.tipText}>
          Roll your linen blazer sleeves for a relaxed, elevated look — perfect for outdoor settings in the heat.
        </Text>
      </View>

      {/* Try-On Teaser */}
      <View style={styles.tryOnCard}>
        <View style={styles.tryOnIconBox}>
          <Text style={{ fontSize: 22 }}>🪞</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.tryOnTitle}>Virtual Try-On</Text>
          <Text style={styles.tryOnSub}>Take a selfie to wear this outfit on you</Text>
        </View>
        <View style={styles.soonBadge}>
          <Text style={styles.soonBadgeText}>SOON</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 24 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  eyebrow: { color: colors.muted, fontSize: 12, letterSpacing: 1, fontFamily: fonts.bodyMedium },
  greeting: { fontFamily: fonts.displaySemiBold, color: colors.text, fontSize: 22, marginTop: 2, lineHeight: 27 },
  bellButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface2, borderWidth: 1.5, borderColor: colors.border, alignItems: "center", justifyContent: "center" },

  weatherCard: { marginHorizontal: 16, marginBottom: 16, borderRadius: 16, overflow: "hidden", backgroundColor: colors.surface },
  weatherInner: { padding: 16 },
  weatherTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  locationText: { fontSize: 12, color: colors.gold, letterSpacing: 0.6, fontFamily: fonts.bodyMedium },
  tempRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  tempText: { fontFamily: fonts.displayRegular, fontSize: 52, color: colors.text, lineHeight: 56 },
  feelsCol: { paddingBottom: 8 },
  feelsText: { color: colors.muted, fontSize: 13, fontFamily: fonts.bodyRegular },
  conditionText: { color: colors.text, fontSize: 13, fontFamily: fonts.bodyMedium },
  uvBadge: { backgroundColor: "#e0704444", borderWidth: 1, borderColor: "#e0704488", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginTop: 4 },
  uvBadgeText: { fontSize: 11, color: "#e07070", fontFamily: fonts.bodySemiBold },

  weekStrip: { marginTop: 16 },
  dayPill: { alignItems: "center", gap: 4, backgroundColor: colors.surface2, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6, minWidth: 44 },
  dayPillActive: { backgroundColor: colors.gold },
  dayLabel: { fontSize: 10, fontFamily: fonts.bodySemiBold, letterSpacing: 0.4 },
  dayTemp: { fontSize: 12, fontFamily: fonts.bodyBold },

  section: { paddingHorizontal: 16, marginBottom: 8 },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  sectionTitle: { fontFamily: fonts.displaySemiBold, color: colors.text, fontSize: 18 },
  aiBadge: { backgroundColor: "#5db87a22", borderWidth: 1, borderColor: "#5db87a55", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  aiBadgeText: { fontSize: 11, color: colors.green, fontFamily: fonts.bodySemiBold },

  reasoningCard: { borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  reasoningIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  reasoningText: { flex: 1, fontSize: 13, color: colors.muted, lineHeight: 21, fontFamily: fonts.bodyRegular },

  outfitGrid: { flexDirection: "row", gap: 8, marginBottom: 12 },
  outfitItem: { flex: 1, gap: 4 },
  outfitImageBox: { borderRadius: 12, overflow: "hidden", aspectRatio: 3 / 4, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
  outfitImage: { width: "100%", height: "100%" },
  outfitLabel: { fontSize: 10, color: colors.text, fontFamily: fonts.bodyMedium, textAlign: "center" },
  outfitTag: { fontSize: 9, color: colors.gold, textAlign: "center", fontFamily: fonts.bodyRegular },

  actionsRow: { flexDirection: "row", gap: 8 },
  actionButton: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center", justifyContent: "center", borderWidth: 1.5 },
  actionButtonText: { fontSize: 13, fontFamily: fonts.bodySemiBold },
  shuffleButton: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border },

  tipCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 16, padding: 16, backgroundColor: "#f2ecf9", borderWidth: 1, borderColor: "#d8cef0" },
  tipEyebrow: { fontSize: 10, color: colors.gold, letterSpacing: 1.2, marginBottom: 6, fontFamily: fonts.bodySemiBold },
  tipText: { fontSize: 13, color: colors.text, lineHeight: 21, fontFamily: fonts.bodyRegular },

  tryOnCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.surface, borderWidth: 1, borderStyle: "dashed", borderColor: colors.border },
  tryOnIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.surface2, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  tryOnTitle: { fontSize: 13, color: colors.text, fontFamily: fonts.bodySemiBold },
  tryOnSub: { fontSize: 11, color: colors.muted, fontFamily: fonts.bodyRegular },
  soonBadge: { backgroundColor: "#c8a96e22", borderRadius: 10, borderWidth: 1, borderColor: colors.goldMuted, paddingHorizontal: 8, paddingVertical: 3 },
  soonBadgeText: { fontSize: 10, color: colors.gold, fontFamily: fonts.bodyBold },
});
