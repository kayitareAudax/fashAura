import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../theme";

const storeTabs = ["Trending", "For You", "Saved", "New In"];

const trendingItems = [
  { id: 1, brand: "Zara", name: "Oversized Linen Shirt", price: "AED 189", originalPrice: "AED 249", tag: "Hot weather ✓", tagColor: "#e07070", img: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=200&h=260&fit=crop&auto=format", match: 96 },
  { id: 2, brand: "& Other Stories", name: "Relaxed Linen Trousers", price: "AED 295", tag: "Breathable", tagColor: "#5db87a", img: "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=200&h=260&fit=crop&auto=format", match: 91 },
  { id: 3, brand: "COS", name: "Structured Blazer", price: "AED 520", tag: "Office-ready", tagColor: "#5b9cf6", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=260&fit=crop&auto=format", match: 88 },
  { id: 4, brand: "Massimo Dutti", name: "Desert Sand Chinos", price: "AED 340", tag: "Mild/Hot ✓", tagColor: "#c8a96e", img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=260&fit=crop&auto=format", match: 85 },
];

const forYouItems = [
  { id: 5, brand: "H&M", name: "Premium Cotton Polo", price: "AED 110", tag: "Based on history", tagColor: "#9b7ff5", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=260&fit=crop&auto=format", match: 93 },
  { id: 6, brand: "Arket", name: "Canvas Espadrilles", price: "AED 220", tag: "Completes your look", tagColor: "#5db87a", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=260&fit=crop&auto=format", match: 89 },
];

const featuredBrands = [
  { name: "Zara", emoji: "🛍️" },
  { name: "COS", emoji: "◻️" },
  { name: "H&M", emoji: "🧵" },
  { name: "ASOS", emoji: "📦" },
  { name: "Arket", emoji: "🌿" },
  { name: "M. Dutti", emoji: "👔" },
];

type StoreItem = (typeof trendingItems)[number];

function ItemCard({ item, saved, onToggleSave }: { item: StoreItem; saved: boolean; onToggleSave: () => void }) {
  return (
    <View style={styles.itemCard}>
      <View style={styles.itemImageBox}>
        <Image source={{ uri: item.img }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <View style={[StyleSheet.absoluteFill, styles.itemImageShade]} />
        <View style={styles.matchBadge}>
          <Text style={styles.matchBadgeText}>✦ {item.match}% match</Text>
        </View>
        <Pressable onPress={onToggleSave} style={styles.saveButton} hitSlop={4}>
          <Text style={{ fontSize: 14, color: "#fff" }}>{saved ? "♥" : "♡"}</Text>
        </Pressable>
        <View style={[styles.itemTag, { backgroundColor: item.tagColor + "33" }]}>
          <Text style={[styles.itemTagText, { color: item.tagColor }]}>{item.tag}</Text>
        </View>
      </View>
      <View style={styles.itemBody}>
        <Text style={styles.itemBrand}>{item.brand}</Text>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.itemFooterRow}>
          <View style={{ flexDirection: "row", alignItems: "baseline", flexShrink: 1 }}>
            <Text style={styles.itemPrice}>{item.price}</Text>
            {"originalPrice" in item && item.originalPrice && (
              <Text style={styles.itemOriginalPrice}>{item.originalPrice}</Text>
            )}
          </View>
          <Pressable style={styles.shopButton}>
            <Text style={styles.shopButtonText}>Shop</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function StoreScreen() {
  const [activeTab, setActiveTab] = useState("Trending");
  const [savedItems, setSavedItems] = useState<Set<number>>(new Set([2, 6]));

  const toggleSave = (id: number) => {
    setSavedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const displayItems =
    activeTab === "Trending" ? trendingItems :
    activeTab === "For You" ? forYouItems :
    activeTab === "Saved" ? [...trendingItems, ...forYouItems].filter((i) => savedItems.has(i.id)) :
    trendingItems;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Style Shop</Text>
        <Text style={styles.subtitle}>AI-curated for today's weather</Text>
      </View>

      {/* Weather context banner */}
      <View style={styles.weatherBanner}>
        <Text style={{ fontSize: 24 }}>☀️</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.weatherBannerTitle}>Picks for 31°C · Dubai today</Text>
          <Text style={styles.weatherBannerSub}>Showing breathable, light-weight options</Text>
        </View>
        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>Live</Text>
        </View>
      </View>

      {/* Brand logos */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.brandRow} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
        {featuredBrands.map((b) => (
          <Pressable key={b.name} style={styles.brandChip}>
            <Text style={{ fontSize: 20 }}>{b.emoji}</Text>
            <Text style={styles.brandChipText}>{b.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabRow} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
        {storeTabs.map((tab) => {
          const active = activeTab === tab;
          return (
            <Pressable key={tab} onPress={() => setActiveTab(tab)} style={[styles.tabPill, { backgroundColor: active ? colors.gold : colors.surface, borderColor: active ? colors.gold : colors.border }]}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={[styles.tabPillText, { color: active ? colors.onGold : colors.muted }]}>{tab}</Text>
                {tab === "Saved" && savedItems.size > 0 && (
                  <View style={styles.tabCountBadge}>
                    <Text style={styles.tabCountBadgeText}>{savedItems.size}</Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Grid */}
      {displayItems.length > 0 ? (
        <View style={styles.grid}>
          {displayItems.map((item) => (
            <View key={item.id} style={styles.gridItem}>
              <ItemCard item={item} saved={savedItems.has(item.id)} onToggleSave={() => toggleSave(item.id)} />
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 40 }}>🛍️</Text>
          <Text style={styles.emptyStateText}>No saved items yet. Heart items to save them here.</Text>
        </View>
      )}

      {/* Virtual try-on promo */}
      <View style={styles.promoCard}>
        <View style={styles.promoRow}>
          <Text style={{ fontSize: 32 }}>🪞</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.promoTitle}>Virtual Try-On — Coming Soon</Text>
            <Text style={styles.promoSub}>Take a selfie and see how any item looks on you before buying.</Text>
          </View>
        </View>
        <Pressable style={styles.promoButton}>
          <Text style={styles.promoButtonText}>Notify me when it's ready →</Text>
        </Pressable>
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

  weatherBanner: { marginHorizontal: 16, marginBottom: 16, borderRadius: 12, padding: 12, flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  weatherBannerTitle: { fontSize: 12, color: colors.text, fontFamily: fonts.bodySemiBold },
  weatherBannerSub: { fontSize: 11, color: colors.muted, fontFamily: fonts.bodyRegular },
  liveBadge: { backgroundColor: colors.gold, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  liveBadgeText: { fontSize: 10, color: colors.onGold, fontFamily: fonts.bodyBold },

  brandRow: { marginBottom: 16 },
  brandChip: { alignItems: "center", gap: 4, borderRadius: 12, padding: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, minWidth: 56 },
  brandChipText: { fontSize: 9, color: colors.muted, fontFamily: fonts.bodySemiBold },

  tabRow: { marginBottom: 16 },
  tabPill: { borderRadius: 999, paddingHorizontal: 16, paddingVertical: 6, borderWidth: 1.5 },
  tabPillText: { fontSize: 12, fontFamily: fonts.bodySemiBold },
  tabCountBadge: { backgroundColor: "#c8a96e", borderRadius: 8, width: 16, height: 16, alignItems: "center", justifyContent: "center", marginLeft: 5 },
  tabCountBadgeText: { fontSize: 9, color: colors.onGold, fontFamily: fonts.bodyExtraBold },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingHorizontal: 16 },
  gridItem: { width: "48%" },
  itemCard: { borderRadius: 16, overflow: "hidden", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  itemImageBox: { aspectRatio: 3 / 4, backgroundColor: colors.surface2 },
  itemImageShade: { backgroundColor: "rgba(0,0,0,0.28)" },
  matchBadge: { position: "absolute", top: 8, left: 8, backgroundColor: "rgba(0,0,0,0.55)", borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2, borderWidth: 1, borderColor: colors.border },
  matchBadgeText: { fontSize: 9, color: colors.gold, fontFamily: fonts.bodyBold },
  saveButton: { position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(0,0,0,0.55)", borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  itemTag: { position: "absolute", bottom: 8, left: 8, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
  itemTagText: { fontSize: 9, fontFamily: fonts.bodyBold, letterSpacing: 0.4 },
  itemBody: { padding: 10 },
  itemBrand: { fontSize: 10, color: colors.gold, fontFamily: fonts.bodySemiBold, marginBottom: 1 },
  itemName: { fontSize: 12, color: colors.text, fontFamily: fonts.bodyMedium, lineHeight: 16, marginBottom: 4 },
  itemFooterRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  itemPrice: { fontSize: 13, color: colors.text, fontFamily: fonts.bodyBold },
  itemOriginalPrice: { fontSize: 11, color: colors.muted, textDecorationLine: "line-through", marginLeft: 4, fontFamily: fonts.bodyRegular },
  shopButton: { backgroundColor: colors.gold, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  shopButtonText: { fontSize: 10, color: colors.onGold, fontFamily: fonts.bodyBold },

  emptyState: { alignItems: "center", justifyContent: "center", paddingHorizontal: 16, paddingVertical: 64, gap: 12 },
  emptyStateText: { color: colors.muted, fontSize: 14, textAlign: "center", fontFamily: fonts.bodyRegular },

  promoCard: { marginHorizontal: 16, marginTop: 16, borderRadius: 16, padding: 16, backgroundColor: "#f2ecf9", borderWidth: 1, borderColor: "#d8cef0" },
  promoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  promoTitle: { fontSize: 13, fontFamily: fonts.bodyBold, color: colors.text, marginBottom: 2 },
  promoSub: { fontSize: 11, color: colors.muted, lineHeight: 16, fontFamily: fonts.bodyRegular },
  promoButton: { marginTop: 12, width: "100%", backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingVertical: 10, alignItems: "center" },
  promoButtonText: { color: colors.gold, fontSize: 12, fontFamily: fonts.bodySemiBold },
});
