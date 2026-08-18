import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../theme";

const filters = ["Day", "Week", "Month", "All"];

const historyData = [
  {
    id: 1,
    date: "Today",
    items: ["Linen Blazer", "White Tee", "Chinos", "Sneakers"],
    weather: "☀️ 31°C · Sunny",
    rating: 5,
    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=80&h=100&fit=crop&auto=format",
    note: "Perfect for outdoor lunch",
    occasion: "Casual",
  },
  {
    id: 2,
    date: "Yesterday",
    items: ["Black Turtleneck", "Denim Jeans", "Leather Loafers"],
    weather: "⛅ 24°C · Cloudy",
    rating: 4,
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=80&h=100&fit=crop&auto=format",
    note: "Work meeting look",
    occasion: "Smart Casual",
  },
  {
    id: 3,
    date: "Aug 16",
    items: ["White Oxford", "Slim Chinos", "Leather Loafers", "Silk Scarf"],
    weather: "🌤️ 27°C · Partly cloudy",
    rating: 3,
    img: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=80&h=100&fit=crop&auto=format",
    note: "A bit warm for oxford",
    occasion: "Smart",
  },
  {
    id: 4,
    date: "Aug 15",
    items: ["Navy Wool Coat", "Black Turtleneck", "Denim Jeans"],
    weather: "🌧️ 19°C · Rainy",
    rating: 5,
    img: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=80&h=100&fit=crop&auto=format",
    note: "Cozy and stylish",
    occasion: "Casual",
  },
  {
    id: 5,
    date: "Aug 14",
    items: ["Linen Blazer", "White Oxford", "Chinos"],
    weather: "☀️ 33°C · Hot",
    rating: 2,
    img: "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=80&h=100&fit=crop&auto=format",
    note: "Too warm for oxford shirt",
    occasion: "Business",
  },
  {
    id: 6,
    date: "Aug 10",
    items: ["Canvas Sneakers", "Denim Jeans", "White Tee"],
    weather: "⛅ 25°C · Mild",
    rating: 4,
    img: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=80&h=100&fit=crop&auto=format",
    note: "Weekend vibes",
    occasion: "Casual",
  },
];

const occasionColors: Record<string, string> = {
  Casual: "#5db87a",
  "Smart Casual": "#5b9cf6",
  Smart: "#c8a96e",
  Business: "#9b7ff5",
};

function StarRating({ rating, onRate }: { rating: number; onRate: (n: number) => void }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} onPress={() => onRate(n)} hitSlop={4}>
          <Text style={{ fontSize: 14, color: n <= rating ? colors.gold : colors.muted2 }}>★</Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function HistoryScreen() {
  const [activeFilter, setActiveFilter] = useState("Week");
  const [ratings, setRatings] = useState<Record<number, number>>(
    Object.fromEntries(historyData.map((h) => [h.id, h.rating]))
  );
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const ratingValues = Object.values(ratings);
  const avgRating = (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(1);

  const stats = [
    { label: "Avg Rating", value: avgRating, icon: "⭐" },
    { label: "Total Looks", value: historyData.length.toString(), icon: "👗" },
    { label: "Top Piece", value: "Linen Blazer", icon: "🏆", small: true },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Style History</Text>
        <Text style={styles.subtitle}>Your past outfits & ratings</Text>
      </View>

      {/* Summary stats */}
      <View style={styles.statsRow}>
        {stats.map((s) => (
          <View key={s.label} style={styles.statBox}>
            <Text style={{ fontSize: 16 }}>{s.icon}</Text>
            <Text style={[styles.statValue, { fontSize: s.small ? 10 : 16 }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {filters.map((f) => {
          const active = activeFilter === f;
          return (
            <Pressable key={f} onPress={() => setActiveFilter(f)} style={[styles.filterPill, { backgroundColor: active ? colors.gold : colors.surface, borderColor: active ? colors.gold : colors.border }]}>
              <Text style={[styles.filterText, { color: active ? colors.onGold : colors.muted }]}>{f}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* History list */}
      <View style={styles.list}>
        {historyData.map((entry) => {
          const isExpanded = expandedId === entry.id;
          const occasionColor = occasionColors[entry.occasion] || colors.gold;
          return (
            <View key={entry.id} style={styles.card}>
              <Pressable style={styles.cardMain} onPress={() => setExpandedId(isExpanded ? null : entry.id)}>
                <View style={styles.thumb}>
                  <Image source={{ uri: entry.img }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.cardTopRow}>
                    <Text style={styles.dateText}>{entry.date}</Text>
                    <View style={[styles.occasionBadge, { backgroundColor: occasionColor + "22" }]}>
                      <Text style={[styles.occasionText, { color: occasionColor }]}>{entry.occasion}</Text>
                    </View>
                  </View>
                  <Text style={styles.weatherText}>{entry.weather}</Text>
                  <Text style={styles.itemsText} numberOfLines={1}>
                    {entry.items.join(" · ")}
                  </Text>
                  <View style={styles.cardBottomRow}>
                    <StarRating rating={ratings[entry.id]} onRate={(n) => setRatings((prev) => ({ ...prev, [entry.id]: n }))} />
                    <Text style={styles.chevron}>{isExpanded ? "▲" : "▼"}</Text>
                  </View>
                </View>
              </Pressable>

              {isExpanded && (
                <View style={styles.expanded}>
                  <View style={styles.noteBox}>
                    <Text style={styles.noteLabel}>Your note</Text>
                    <Text style={styles.noteText}>"{entry.note}"</Text>
                  </View>
                  <View style={styles.expandedActions}>
                    <Pressable style={styles.expandedButton}>
                      <Text style={styles.expandedButtonText}>🔁 Wear again</Text>
                    </Pressable>
                    <Pressable style={styles.expandedButton}>
                      <Text style={styles.expandedButtonText}>📝 Edit note</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 24 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  title: { fontFamily: fonts.displaySemiBold, color: colors.text, fontSize: 22 },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 2, fontFamily: fonts.bodyRegular },

  statsRow: { flexDirection: "row", gap: 12, paddingHorizontal: 16, marginBottom: 16 },
  statBox: { flex: 1, borderRadius: 12, padding: 12, alignItems: "center", gap: 4, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  statValue: { fontFamily: fonts.bodyBold, color: colors.text, textAlign: "center" },
  statLabel: { fontSize: 9, color: colors.muted, textAlign: "center", fontFamily: fonts.bodyRegular },

  filterRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16, marginBottom: 16 },
  filterPill: { flex: 1, borderRadius: 999, paddingVertical: 8, alignItems: "center", borderWidth: 1.5 },
  filterText: { fontSize: 12, fontFamily: fonts.bodySemiBold },

  list: { paddingHorizontal: 16, gap: 12 },
  card: { borderRadius: 16, overflow: "hidden", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  cardMain: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 12 },
  thumb: { width: 60, height: 76, borderRadius: 12, overflow: "hidden", backgroundColor: colors.surface2 },
  cardTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 2 },
  dateText: { fontSize: 13, fontFamily: fonts.bodyBold, color: colors.text },
  occasionBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  occasionText: { fontSize: 9, fontFamily: fonts.bodyBold, letterSpacing: 0.4 },
  weatherText: { fontSize: 11, color: colors.muted, marginBottom: 4, fontFamily: fonts.bodyRegular },
  itemsText: { fontSize: 11, color: colors.muted, fontFamily: fonts.bodyRegular },
  cardBottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  chevron: { fontSize: 10, color: colors.muted2 },

  expanded: { paddingHorizontal: 12, paddingBottom: 12, borderTopWidth: 1, borderTopColor: colors.border },
  noteBox: { borderRadius: 12, padding: 12, marginTop: 12, backgroundColor: colors.surface2 },
  noteLabel: { fontSize: 11, color: colors.gold, marginBottom: 4, fontFamily: fonts.bodySemiBold },
  noteText: { fontSize: 13, color: colors.text, fontStyle: "italic", fontFamily: fonts.bodyRegular },
  expandedActions: { flexDirection: "row", gap: 8, marginTop: 12 },
  expandedButton: { flex: 1, borderRadius: 12, paddingVertical: 10, alignItems: "center", backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
  expandedButtonText: { fontSize: 12, fontFamily: fonts.bodySemiBold, color: colors.text },
});
