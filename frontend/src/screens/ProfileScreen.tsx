import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../theme";

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <Pressable onPress={onToggle} style={[styles.toggleTrack, { backgroundColor: on ? colors.gold : colors.surface2, borderColor: on ? colors.gold : colors.border }]}>
      <View style={[styles.toggleThumb, { left: on ? 22 : 2, backgroundColor: on ? colors.onGold : colors.muted }]} />
    </Pressable>
  );
}

function SettingRow({
  icon,
  label,
  sub,
  value,
  onToggle,
  type = "toggle",
  accent,
}: {
  icon: string;
  label: string;
  sub?: string;
  value?: boolean | string;
  onToggle?: () => void;
  type?: "toggle" | "link" | "text";
  accent?: boolean;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={[styles.settingIcon, { backgroundColor: accent ? "#c8a96e22" : colors.surface2, borderColor: accent ? colors.goldMuted : colors.border }]}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingLabel}>{label}</Text>
        {sub && <Text style={styles.settingSub}>{sub}</Text>}
      </View>
      {type === "toggle" && typeof value === "boolean" && onToggle && <Toggle on={value} onToggle={onToggle} />}
      {type === "link" && <Text style={styles.settingChevron}>›</Text>}
      {type === "text" && typeof value === "string" && <Text style={styles.settingValue}>{value}</Text>}
    </View>
  );
}

const whatsappSetupRows = [
  { label: "Send time", value: "7:00 AM" },
  { label: "Message language", value: "English" },
  { label: "Include emoji", value: "Yes" },
  { label: "Include store link", value: "No" },
];

const profileStats = [
  { value: "9", label: "Items" },
  { value: "47", label: "Looks" },
  { value: "4.2★", label: "Avg Score" },
  { value: "82d", label: "Streak" },
];

export default function ProfileScreen() {
  const [dailyReminder, setDailyReminder] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [newArrivals, setNewArrivals] = useState(false);
  const [aiLearning, setAiLearning] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [shareData, setShareData] = useState(false);
  const [showWhatsAppSetup, setShowWhatsAppSetup] = useState(false);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <LinearGradient colors={["#c8a96e", "#7a5530"]} style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>Alex Hassan</Text>
            <Text style={styles.profileEmail}>alex@example.com</Text>
            <View style={styles.profileBadgeRow}>
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>Premium</Text>
              </View>
              <View style={styles.locationBadge}>
                <Text style={styles.locationBadgeText}>Dubai, UAE</Text>
              </View>
            </View>
          </View>
          <Text style={styles.chevronLarge}>›</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {profileStats.map((s) => (
            <View key={s.label} style={styles.statBox}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* WhatsApp section */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionEyebrow}>WHATSAPP NOTIFICATIONS</Text>
          <View style={styles.card}>
            <View style={styles.whatsappStatusRow}>
              <View style={styles.whatsappIcon}>
                <Text style={{ fontSize: 18 }}>💬</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.whatsappTitle}>WhatsApp Connected</Text>
                <Text style={styles.whatsappSub}>+971 50 xxx xxxx</Text>
              </View>
              <View style={styles.onlineDot} />
            </View>

            <View style={styles.previewBlock}>
              <Text style={styles.previewLabel}>Daily message preview:</Text>
              <View style={styles.previewBubble}>
                <Text style={styles.previewText}>
                  👗 <Text style={{ fontFamily: fonts.bodyBold }}>Good morning, Alex!</Text>
                  {"\n"}Today in Dubai: ☀️ 31°C, Sunny.{"\n"}
                  Your outfit for today:{"\n"}✦ Linen Blazer + White Tee{"\n"}✦ Slim Chinos + Canvas Sneakers
                  {"\n\n"}Stay cool & look sharp! 🌟
                </Text>
                <Text style={styles.previewTime}>Sent at 7:00 AM</Text>
              </View>
              <Pressable onPress={() => setShowWhatsAppSetup(true)} style={styles.linkButton}>
                <Text style={styles.linkButtonText}>⚙ Customize message & schedule</Text>
              </Pressable>
            </View>

            <SettingRow icon="📅" label="Daily Outfit Message" sub="Every morning at 7:00 AM" value={dailyReminder} onToggle={() => setDailyReminder(!dailyReminder)} />
            <SettingRow icon="🌩️" label="Weather Change Alerts" sub="When forecast shifts significantly" value={weatherAlerts} onToggle={() => setWeatherAlerts(!weatherAlerts)} />
            <SettingRow icon="🛍️" label="New Store Arrivals" sub="Matching your style & weather" value={newArrivals} onToggle={() => setNewArrivals(!newArrivals)} />
          </View>
        </View>

        {/* AI Preferences */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionEyebrow}>AI PREFERENCES</Text>
          <View style={styles.card}>
            <SettingRow icon="🧠" label="AI Style Learning" sub="Improve picks from your ratings" value={aiLearning} onToggle={() => setAiLearning(!aiLearning)} />
            <SettingRow icon="📍" label="Location" sub="Dubai, UAE" type="link" />
            <SettingRow icon="🌡️" label="Temperature Unit" value="°C" type="text" />
            <SettingRow icon="💼" label="Lifestyle Mode" value="Business Casual" type="text" />
            <SettingRow icon="🎨" label="Style Preferences" type="link" sub="Colors, silhouettes, brands" />
          </View>
        </View>

        {/* App settings */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionEyebrow}>APP SETTINGS</Text>
          <View style={styles.card}>
            <SettingRow icon="🌙" label="Dark Mode" value={darkMode} onToggle={() => setDarkMode(!darkMode)} />
            <SettingRow icon="🔒" label="Share Usage Data" sub="Helps improve AI recommendations" value={shareData} onToggle={() => setShareData(!shareData)} />
            <SettingRow icon="📤" label="Export My Data" type="link" />
            <SettingRow icon="💎" label="Upgrade to Premium" type="link" accent />
          </View>
        </View>

        {/* Sign out */}
        <View style={styles.signOutWrap}>
          <Pressable style={styles.signOutButton}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* WhatsApp Setup Sheet */}
      <Modal visible={showWhatsAppSetup} transparent animationType="slide" onRequestClose={() => setShowWhatsAppSetup(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowWhatsAppSetup(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>WhatsApp Setup</Text>
            {whatsappSetupRows.map((s) => (
              <View key={s.label} style={styles.setupRow}>
                <Text style={styles.setupRowLabel}>{s.label}</Text>
                <Text style={styles.setupRowValue}>{s.value}</Text>
              </View>
            ))}
            <Pressable onPress={() => setShowWhatsAppSetup(false)} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Settings</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 24 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  title: { fontFamily: fonts.displaySemiBold, color: colors.text, fontSize: 22 },

  profileCard: { marginHorizontal: 16, marginBottom: 16, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 26, fontFamily: fonts.displayBold, color: colors.onGold },
  profileName: { fontFamily: fonts.displaySemiBold, fontSize: 18, color: colors.text },
  profileEmail: { fontSize: 12, color: colors.muted, fontFamily: fonts.bodyRegular },
  profileBadgeRow: { flexDirection: "row", gap: 8, marginTop: 4 },
  premiumBadge: { backgroundColor: "#5db87a22", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  premiumBadgeText: { color: "#5db87a", fontSize: 10, fontFamily: fonts.bodyBold },
  locationBadge: { backgroundColor: "#c8a96e22", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  locationBadgeText: { color: colors.gold, fontSize: 10, fontFamily: fonts.bodySemiBold },
  chevronLarge: { fontSize: 18, color: colors.muted },

  statsRow: { flexDirection: "row", gap: 12, paddingHorizontal: 16, marginBottom: 16 },
  statBox: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center", gap: 2, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  statValue: { fontSize: 15, fontFamily: fonts.bodyExtraBold, color: colors.text },
  statLabel: { fontSize: 10, color: colors.muted, fontFamily: fonts.bodyRegular },

  sectionBlock: { marginHorizontal: 16, marginBottom: 16 },
  sectionEyebrow: { fontSize: 10, color: colors.gold, fontFamily: fonts.bodyBold, letterSpacing: 1.2, marginBottom: 8, paddingLeft: 4 },
  card: { borderRadius: 16, overflow: "hidden", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },

  whatsappStatusRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  whatsappIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#25D36622", borderWidth: 1, borderColor: "#25D36644", alignItems: "center", justifyContent: "center" },
  whatsappTitle: { fontSize: 13, color: colors.text, fontFamily: fonts.bodySemiBold },
  whatsappSub: { fontSize: 11, color: colors.muted, fontFamily: fonts.bodyRegular },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#25D366" },

  previewBlock: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  previewLabel: { fontSize: 11, color: colors.muted, marginBottom: 8, fontFamily: fonts.bodyRegular },
  previewBubble: { borderRadius: 12, padding: 12, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
  previewText: { fontSize: 13, color: colors.text, lineHeight: 21, fontFamily: fonts.bodyRegular },
  previewTime: { fontSize: 10, color: colors.muted, textAlign: "right", marginTop: 4, fontFamily: fonts.bodyRegular },
  linkButton: { marginTop: 10, width: "100%", backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingVertical: 10, alignItems: "center" },
  linkButtonText: { color: colors.gold, fontSize: 12, fontFamily: fonts.bodySemiBold },

  settingRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  settingLabel: { fontSize: 13, color: colors.text, fontFamily: fonts.bodyMedium },
  settingSub: { fontSize: 11, color: colors.muted, fontFamily: fonts.bodyRegular },
  settingChevron: { fontSize: 14, color: colors.muted },
  settingValue: { fontSize: 12, color: colors.gold, fontFamily: fonts.bodyMedium },

  toggleTrack: { width: 44, height: 24, borderRadius: 12, borderWidth: 1.5, justifyContent: "center" },
  toggleThumb: { position: "absolute", width: 16, height: 16, borderRadius: 8 },

  signOutWrap: { paddingHorizontal: 16 },
  signOutButton: { width: "100%", borderRadius: 16, paddingVertical: 12, alignItems: "center", borderWidth: 1.5, borderColor: colors.border },
  signOutText: { color: colors.muted, fontSize: 14, fontFamily: fonts.bodySemiBold },

  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: "center", marginBottom: 20 },
  sheetTitle: { fontFamily: fonts.displaySemiBold, color: colors.text, fontSize: 20, marginBottom: 16 },
  setupRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  setupRowLabel: { fontSize: 14, color: colors.text, fontFamily: fonts.bodyRegular },
  setupRowValue: { fontSize: 14, color: colors.gold, fontFamily: fonts.bodySemiBold },
  saveButton: { width: "100%", borderRadius: 16, paddingVertical: 12, marginTop: 16, alignItems: "center", backgroundColor: colors.gold },
  saveButtonText: { color: colors.onGold, fontSize: 14, fontFamily: fonts.bodySemiBold },
});
