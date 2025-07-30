import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import { Ionicons, Feather, SimpleLineIcons } from "@expo/vector-icons";

interface User {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: any;
  status: "BLOCKED" | "CLOSE_CONNECTION" | "CONNECTED";
  isBlocked?: boolean;
  backgroundColor: string | null;
}

interface CardProps extends User {
  onChatPress: () => void;
  onSharePress: () => void;
  onBlockPress: () => void; // Updated prop name for clarity
  onBagPress: () => void;
  onProfilePress: () => void;
  handlePress: () => void;
}

const cardColors = ["#FDF0A6", "#FBC8C9", "#C9FBC8", "#F6F6F6", "#E0EAF3"];
const iconColorMap: Record<string, string> = {
  "#FDF0A6": "#FFE36A",
  "#FBC8C9": "#F89CA1",
  "#C9FBC8": "#99E199",
  "#F6F6F6": "#DDDDDD",
  "#E0EAF3": "#ADC7E3",
};

const getTextColor = (hex: string): string => {
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155 ? "#000" : "#fff";
};

const CustomCard = memo(
  ({
    name,
    role,
    location,
    avatar,
    isBlocked = false,
    backgroundColor,
    status,
    onChatPress,
    onSharePress,
    onBlockPress,
    onBagPress,
    onProfilePress,
    handlePress,
  }: CardProps) => {
    const bgColor = cardColors[Math.floor(Math.random() * cardColors.length)];
    const iconBgColor = iconColorMap[backgroundColor || bgColor];
    const textColor = getTextColor(backgroundColor || bgColor);
    const iconColor = getTextColor(backgroundColor || iconBgColor);

    return (
      <Pressable style={styles.card} onPress={onProfilePress}>
        <ImageBackground
          source={avatar}
          style={styles.imageSection}
          imageStyle={styles.image}
        >
          <View style={styles.topIcons}>
            <TouchableOpacity style={styles.roundIcon} onPress={onBagPress}>
              {status === "CLOSE_CONNECTION" ? (
                <Image
                  source={require("@/assets/icons/suitcase.png")}
                  style={{ height: 16, width: 16 }}
                />
              ) : (
                <SimpleLineIcons name="bag" size={13} color="#000" />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.roundIcon} onPress={handlePress}>
              <Image
                source={require("../../../assets/icons/pitch2.png")}
                style={{ width: 15, height: 24 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View
          style={[
            styles.bottomSection,
            { backgroundColor: backgroundColor || bgColor },
          ]}
        >
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: textColor }]}>{name}</Text>
          </View>
          <Text style={[styles.role, { color: textColor }]}>{role}</Text>
          <Text style={[styles.location, { color: textColor }]}>
            {location}
          </Text>

          <View style={styles.actionIcons}>
            {/* Chat button - only show if user is not blocked */}
            {!isBlocked ? (
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: iconBgColor }]}
                onPress={onChatPress}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={15}
                  color={iconColor}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: iconBgColor }]}
              ></TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: iconBgColor }]}
              onPress={onSharePress}
            >
              <Feather name="share-2" size={18} color={iconColor} />
            </TouchableOpacity>

            {/* Block/Unblock button */}
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: iconBgColor }]}
              onPress={onBlockPress}
            >
              {isBlocked ? (
                // Show unblock icon when user is blocked
                <Image
                  source={require("../../../assets/icons/unblock.png")} // You'll need to add this icon
                  style={{ width: 24, height: 24, tintColor: iconColor }}
                  resizeMode="contain"
                />
              ) : (
                // Show block icon when user is not blocked
                <Image
                  source={require("../../../assets/icons/block2.png")}
                  style={{ width: 15, height: 24, tintColor: iconColor }}
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    );
  }
);

CustomCard.displayName = "CustomCard";
export default CustomCard;

const { width } = Dimensions.get("window");
const CARD_GAP = 16;
const CARD_WIDTH = (width - CARD_GAP * 3) / 2;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderRadius: 20,
    marginHorizontal: 4,
  },

  imageSection: {
    height: 180,
    padding: 10,
    justifyContent: "space-between",
  },

  image: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  topIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  roundIcon: {
    backgroundColor: "#fff",
    width: 28,
    height: 28,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSection: {
    padding: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontWeight: "bold",
    fontSize: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: "#0f0",
    borderRadius: 4,
  },
  role: {
    fontSize: 13,
    marginTop: 2,
  },
  location: {
    fontSize: 12,
    marginTop: 2,
  },
  actionIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  iconButton: {
    width: 28,
    height: 28,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
