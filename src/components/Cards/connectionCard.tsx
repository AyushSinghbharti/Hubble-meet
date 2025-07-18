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
import { Feather } from "@expo/vector-icons";

interface User {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: any;
}

interface CardProps extends User {
  onSharePress: () => void;
  onAddPress: () => void; // report
  onPitchPress: () => void;
  onConnectPress: (receiver_id: string) => void;
  onCardPress: () => void;
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

const ConnectionCard = memo(
  ({
    id,
    name,
    role,
    location,
    avatar,
    onCardPress,
    onSharePress,
    onPitchPress,
    onAddPress,
    onConnectPress,
  }: CardProps) => {
    const bgColor = cardColors[Math.floor(Math.random() * cardColors.length)];
    const iconBgColor = iconColorMap[bgColor];
    const textColor = getTextColor(bgColor);
    const iconColor = getTextColor(iconBgColor);

    return (
      <Pressable style={styles.card} onPress={onCardPress}>
        <ImageBackground
          source={avatar}
          style={styles.imageSection}
          imageStyle={styles.image}
        >
          <View style={styles.topIcons}>
            <View />
            <TouchableOpacity style={styles.roundIcon} onPress={onPitchPress}>
              <Image
                source={require("../../../assets/icons/pitch2.png")}
                style={{ width: 16, height: 24 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View style={[styles.bottomSection, { backgroundColor: bgColor }]}>
          <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={[styles.role, { color: textColor }]} numberOfLines={1}>
            {role}
          </Text>
          <Text style={[styles.location, { color: textColor }]} numberOfLines={1}>
            {location}
          </Text>

          <View style={styles.actionIcons}>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: iconBgColor }]}
              onPress={() => onConnectPress(id)}
            >
              <Feather name="user-plus" size={18} color={iconColor} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: iconBgColor }]}
              onPress={onSharePress}
            >
              <Feather name="share-2" size={18} color={iconColor} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: iconBgColor }]}
              onPress={onAddPress}
            >
              <Feather name="alert-triangle" size={18} color={iconColor} />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    );
  }
);

ConnectionCard.displayName = "ConnectionCard";
export default ConnectionCard;

const { width } = Dimensions.get("window");
const CARD_GAP = 16;
const CARD_WIDTH = (width - CARD_GAP * 3) / 2;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginHorizontal: 4,
  },
  imageSection: {
    height: 190,
    padding: 10,
    justifyContent: "space-between",
  },
  image: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  topIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  roundIcon: {
    backgroundColor: "#fff",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSection: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
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
    marginTop: 14,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
