import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type NavHeaderProps = {
  title: string;
  style?: StyleProp<ViewStyle>;
  showBackButton?: boolean;
  onBackPress?: () => void;
  mode?: "light" | "dark";
  rightIcon?: React.ReactNode; // <- Custom icon on right side
};

export default function NavHeader({
  title,
  showBackButton = true,
  onBackPress,
  style,
  mode = "light",
  rightIcon,
}: NavHeaderProps) {
  const router = useRouter();

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.container}>
        {/* Left section with back button and title */}
        <View style={styles.leftGroup}>
          {showBackButton && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBackPress || (() => router.back())}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={mode === "light" ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          )}
          <Text
            style={[
              styles.title,
              { color: mode === "light" ? "#fff" : "#000" },
            ]}
          >
            {title}
          </Text>
        </View>

        {/* Right section with optional custom icon */}
        <View style={styles.rightIcon}>
          {rightIcon || <View style={{ width: 24 }} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: Platform.OS === "android" ? 25 : 40,
    width: "100%",
  },
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderBottomColor: "#eee",
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  backButton: {
    marginRight: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: "InterMedium",
    flexShrink: 1,
  },
  rightIcon: {
    width: 32,
    alignItems: "flex-end",
  },
});
