import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import {
  Ionicons,
  Feather,
  SimpleLineIcons,
} from "@expo/vector-icons";

interface User {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: any;
}

interface CardProps extends User {
  onChatPress: () => void;
  onSharePress: () => void;
  onAddPress: () => void;
  onBagPress: () => void;
  onProfilePress: () => void;
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
    onChatPress,
    onSharePress,
    onAddPress,
    onBagPress,
    onProfilePress,
  }: CardProps) => {
    const bgColor = cardColors[Math.floor(Math.random() * cardColors.length)];
    const iconBgColor = iconColorMap[bgColor];
    const textColor = getTextColor(bgColor);
    const iconColor = getTextColor(iconBgColor);

    return (
      <View style={styles.card}>
        <ImageBackground
          source={avatar}
          style={styles.imageSection}
          imageStyle={styles.image}
        >
          <View style={styles.topIcons}>
            <TouchableOpacity style={styles.roundIcon} onPress={onBagPress}>
              <SimpleLineIcons name="bag" size={13} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.roundIcon} onPress={onProfilePress}>
              <Image
                source={require("../../../assets/icons/pitch2.png")}
                style={{ width: 15, height: 24 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View style={[styles.bottomSection, { backgroundColor: bgColor }]}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: textColor }]}>{name}</Text>
            <View style={styles.statusDot} />
          </View>
          <Text style={[styles.role, { color: textColor }]}>{role}</Text>
          <Text style={[styles.location, { color: textColor }]}>{location}</Text>

          <View style={styles.actionIcons}>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: iconBgColor }]}
              onPress={onChatPress}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={15} color={iconColor} />
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
              <Image
                source={require("../../../assets/icons/block2.png")}
                style={{ width: 15, height: 24, tintColor: iconColor }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  marginHorizontal: 4, // ⬅️ Gap between cards
},

 imageSection: {
  height: 180, // ⬅️ increased from 140
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
