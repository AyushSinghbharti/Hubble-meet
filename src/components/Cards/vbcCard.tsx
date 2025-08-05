import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_GAP = 16;
const CARD_WIDTH = (width - CARD_GAP * 3) / 2;
const AVATAR_HEIGHT = 180;

const cardColors = ["#FDF0A6", "#FBC8C9", "#C9FBC8", "#F6F6F6", "#E0EAF3"];
const iconColorMap = {
  "#FDF0A6": "#FFE36A",
  "#FBC8C9": "#F89CA1",
  "#C9FBC8": "#99E199",
  "#F6F6F6": "#DDDDDD",
  "#E0EAF3": "#ADC7E3",
};

const getTextColor = (hex) => {
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155 ? "#222" : "#fff";
};

const Card = ({
  name,
  role,
  company,
  location,
  avatar,
  cardColor,
  onHandshake,
  onVideo,
  onChat,
  onShare,
}) => {
  const bgColor =
    cardColor || cardColors[Math.floor(Math.random() * cardColors.length)];
  const iconBgColor = iconColorMap[bgColor];
  const textColor = getTextColor(bgColor);

  // Ensure company is array to avoid .join crash:
  const safeCompany = Array.isArray(company) ? company : [];
  const companyText =
    safeCompany.length > 0 ? `@${safeCompany.join(", ")}` : "";

  return (
    <View style={[styles.card, { backgroundColor: "#181818" }]}>
      <ImageBackground
        source={avatar}
        style={styles.avatar}
        imageStyle={styles.avatarImg}
      >
        <View style={styles.actionIconsTop}>
          <TouchableOpacity
            style={[styles.circleBtn, { backgroundColor: "#fff" }]}
            onPress={onHandshake}
          >
            <Image
              source={require("../../../assets/handshake.png")}
              style={{ width: 26, height: 26 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.circleBtn, { backgroundColor: "#fff" }]}
            onPress={onVideo}
          >
            <Ionicons name="videocam-outline" size={24} color="#2d7d46" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View style={[styles.infoSection, { backgroundColor: bgColor }]}>
        <Text style={[styles.name, { color: textColor }]}>
          {name ?? ""}
        </Text>
        <Text style={[styles.role, { color: textColor }]}>
          {role ?? ""}
        </Text>
        {/* Company text, always inside a <Text> */}
        <Text style={[styles.company, { color: textColor }]}>
          {companyText}
        </Text>
        <Text style={[styles.location, { color: textColor }]}>
          {location ?? ""}
        </Text>
      </View>
      <View style={[styles.bottomBar, { backgroundColor: "#181818" }]}>
        <TouchableOpacity style={styles.bottomBtn} onPress={onChat}>
          <Ionicons name="chatbubble-ellipses-outline" size={26} color={"#BBFFBB"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn} onPress={onShare}>
          <Feather name="share-2" size={26} color={"#BBFFBB"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#181818",
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 4,
    marginVertical: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  avatar: {
    width: "100%",
    height: AVATAR_HEIGHT,
    justifyContent: "space-between",
  },
  avatarImg: {
    width: "100%",
    height: AVATAR_HEIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  actionIconsTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    position: "absolute",
    width: "100%",
    top: 0,
    zIndex: 2,
  },
  circleBtn: {
    backgroundColor: "#fff",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  infoSection: {
    paddingVertical: 18,
    paddingHorizontal: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  role: {
    fontSize: 15,
    fontWeight: "500",
  },
  company: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 1,
  },
  location: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 5,
  },
  bottomBar: {
    flexDirection: "row",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 54,
    borderTopWidth: 1,
    borderTopColor: "#242424",
  },
  bottomBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
});

export default Card;
