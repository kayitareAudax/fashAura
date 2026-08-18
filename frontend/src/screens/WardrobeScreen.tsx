import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../theme";

const categories = ["All", "Tops", "Bottoms", "Shoes", "Outerwear", "Accessories"];

const clothes = [
  { id: 1, name: "Linen Blazer", cat: "Outerwear", weather: "hot", img: "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=200&h=260&fit=crop&auto=format", uses: 12 },
  { id: 2, name: "White Oxford", cat: "Tops", weather: "mild", img: "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=200&h=260&fit=crop&auto=format", uses: 24 },
  { id: 3, name: "Slim Chinos", cat: "Bottoms", weather: "mild", img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=260&fit=crop&auto=format", uses: 18 },
  { id: 4, name: "Canvas Sneakers", cat: "Shoes", weather: "hot", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=260&fit=crop&auto=format", uses: 30 },
  { id: 5, name: "Navy Wool Coat", cat: "Outerwear", weather: "cold", img: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200&h=260&fit=crop&auto=format", uses: 5 },
  { id: 6, name: "Black Turtleneck", cat: "Tops", weather: "cold", img: "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=200&h=260&fit=crop&auto=format", uses: 9 },
  { id: 7, name: "Denim Jeans", cat: "Bottoms", weather: "mild", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=260&fit=crop&auto=format", uses: 22 },
  { id: 8, name: "Leather Loafers", cat: "Shoes", weather: "mild", img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=200&h=260&fit=crop&auto=format", uses: 15 },
  { id: 9, name: "Silk Scarf", cat: "Accessories", weather: "any", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=260&fit=crop&auto=format", uses: 7 },
];

const weatherColors: Record<string, { bg: string; text: string; label: string }> = {
  hot: { bg: "#e0704433", text: "#e07070", label: "Hot" },
  mild: { bg: "#5b9cf633", text: "#5b9cf6", label: "Mild" },
  cold: { bg: "#6b8cf233", text: "#8ba4f8", label: "Cold" },
  any: { bg: "#c8a96e33", text: "#c8a96e", label: "Any" },
};

const uploadOptions = [
  { icon: "📷", label: "Take a Photo", sub: "Use camera to capture" },
  { icon: "🖼️", label: "Upload from Gallery", sub: "Pick from your photos" },
  { icon: "🔗", label: "Paste Product URL", sub: "From any online store" },
];

const stats = [
  { label: "Total Items", value: "9", icon: "👔" },
  { label: "Hot Weather", value: "3", icon: "☀️" },
  { label: "Cold Weather", value: "2", icon: "🧥" },
];

export default function WardrobeScreen() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showUpload, setShowUpload] = useState(false);

  const filtered = activeCategory === "All" ? clothes : clothes.filter((c) => c.cat === activeCategory);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Wardrobe</Text>
          <Text style={styles.subtitle}>{clothes.length} items · AI-analyzed</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statBox}>
              <Text style={{ fontSize: 18 }}>{s.icon}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Category pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
          {categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <Pressable key={cat} onPress={() => setActiveCategory(cat)} style={[styles.pill, { backgroundColor: active ? colors.gold : colors.surface, borderColor: active ? colors.gold : colors.border }]}>
                <Text style={[styles.pillText, { color: active ? colors.onGold : colors.muted }]}>{cat}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Clothes grid */}
        <View style={styles.grid}>
          <Pressable onPress={() => setShowUpload(true)} style={styles.uploadTile}>
            <View style={styles.uploadIconCircle}>
              <Text style={{ fontSize: 18 }}>+</Text>
            </View>
            <Text style={styles.uploadLabel}>Add item</Text>
          </Pressable>

          {filtered.map((item) => {
            const wc = weatherColors[item.weather];
            return (
              <View key={item.id} style={styles.itemTile}>
                <Image source={{ uri: item.img }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                <LinearGradient
                  colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.15)", "transparent"]}
                  locations={[0, 0.5, 1]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
                <View style={[styles.weatherTag, { backgroundColor: wc.bg }]}>
                  <Text style={[styles.weatherTagText, { color: wc.text }]}>{wc.label}</Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemUses}>{item.uses}× worn</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Upload modal */}
      <Modal visible={showUpload} transparent animationType="slide" onRequestClose={() => setShowUpload(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowUpload(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Add Clothing Item</Text>
            <Text style={styles.sheetSubtitle}>Our AI will analyze the item and classify it for weather appropriateness.</Text>
            <View style={{ gap: 12 }}>
              {uploadOptions.map((opt) => (
                <Pressable key={opt.label} style={styles.sheetOption} onPress={() => setShowUpload(false)}>
                  <Text style={{ fontSize: 24 }}>{opt.icon}</Text>
                  <View>
                    <Text style={styles.sheetOptionLabel}>{opt.label}</Text>
                    <Text style={styles.sheetOptionSub}>{opt.sub}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
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
  statValue: { fontSize: 16, fontFamily: fonts.bodyBold, color: colors.text },
  statLabel: { fontSize: 10, color: colors.muted, textAlign: "center", fontFamily: fonts.bodyRegular },

  pillRow: { marginBottom: 16 },
  pill: { borderRadius: 999, paddingHorizontal: 16, paddingVertical: 6, borderWidth: 1.5 },
  pillText: { fontSize: 12, fontFamily: fonts.bodySemiBold, letterSpacing: 0.4 },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingHorizontal: 16 },
  uploadTile: { width: "31%", aspectRatio: 3 / 4, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 2, borderStyle: "dashed", borderColor: colors.border, alignItems: "center", justifyContent: "center", gap: 8 },
  uploadIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface2, alignItems: "center", justifyContent: "center" },
  uploadLabel: { fontSize: 11, color: colors.muted, fontFamily: fonts.bodyMedium },

  itemTile: { width: "31%", aspectRatio: 3 / 4, borderRadius: 16, overflow: "hidden", backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
  weatherTag: { position: "absolute", top: 8, right: 8, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  weatherTagText: { fontSize: 9, fontFamily: fonts.bodyBold, letterSpacing: 0.4 },
  itemInfo: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 8 },
  itemName: { fontSize: 11, color: "#fff", fontFamily: fonts.bodySemiBold, lineHeight: 14 },
  itemUses: { fontSize: 10, color: colors.goldLight, fontFamily: fonts.bodyRegular },

  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: "center", marginBottom: 20 },
  sheetTitle: { fontFamily: fonts.displaySemiBold, color: colors.text, fontSize: 20, marginBottom: 6 },
  sheetSubtitle: { fontSize: 13, color: colors.muted, marginBottom: 20, fontFamily: fonts.bodyRegular },
  sheetOption: { flexDirection: "row", alignItems: "center", gap: 16, borderRadius: 16, padding: 16, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border },
  sheetOptionLabel: { color: colors.text, fontSize: 14, fontFamily: fonts.bodySemiBold },
  sheetOptionSub: { color: colors.muted, fontSize: 12, fontFamily: fonts.bodyRegular },
});
