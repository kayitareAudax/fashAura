import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HistoryIcon, HomeIcon, ProfileIcon, StoreIcon, WardrobeIcon } from "../components/TabIcons";
import { colors, fonts } from "../theme";
import type { TabId } from "./types";

const tabs: { id: TabId; label: string; Icon: typeof HomeIcon }[] = [
  { id: "home", label: "Today", Icon: HomeIcon },
  { id: "wardrobe", label: "Wardrobe", Icon: WardrobeIcon },
  { id: "history", label: "History", Icon: HistoryIcon },
  { id: "store", label: "Shop", Icon: StoreIcon },
  { id: "profile", label: "Profile", Icon: ProfileIcon },
];

export default function TabBar({ activeTab, onChange }: { activeTab: TabId; onChange: (tab: TabId) => void }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={styles.row}>
        {tabs.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          const color = active ? colors.gold : colors.muted2;
          return (
            <Pressable key={id} onPress={() => onChange(id)} style={styles.tab} hitSlop={8}>
              {active && <View style={styles.dot} />}
              <Icon color={color} active={active} />
              <Text style={[styles.label, { color, fontFamily: active ? fonts.bodyBold : fonts.bodyMedium }]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(245,241,235,0.95)",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tab: {
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  dot: {
    position: "absolute",
    top: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gold,
    alignSelf: "center",
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
});
