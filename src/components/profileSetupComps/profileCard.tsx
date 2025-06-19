import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

/**
 *  ---------------------------------------------------------------------------
 *  ProfileCard
 *  ‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑‑
 *  A close replica of the yellow profile preview card shown in the reference
 *  screenshot.  Made fully reusable – pass different props or hook up the
 *  on‑press callbacks if needed.
 *  ---------------------------------------------------------------------------
 */
export default function ProfileCard({
  avatar,
  /** display name */
  name = "Robin Gupta",
  /** role */
  title = "Design Lead at Microsoft",
  /** city, country */
  location = "Bengaluru, India",
  /** actions */
  onVideoPress = () => {},
  onChatPress = () => {},
  onSharePress = () => {},
  onConnectPress = () => {},
}) {
  return (
    <View style={styles.cardWrapper}>
      {/* avatar  ------------------------------------------------------------ */}
      <Image
        source={
          avatar
            ? { uri: avatar }
            : {
                uri: "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid&w=740",
              }
        }
        style={styles.avatar}
      />

      {/* text block  -------------------------------------------------------- */}
      <View style={styles.infoBlock}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.location}>{location}</Text>
          </View>
          <TouchableOpacity style={styles.videoBtn} onPress={onVideoPress}>
            <Image
              source={require("../../../assets/icons/pitch2.png")}
              style={styles.iconsMain}
            />
          </TouchableOpacity>
        </View>

        {/* bottom actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={onChatPress}>
            <Image
              source={require("../../../assets/icons/chat.png")}
              style={styles.iconSub}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onSharePress}>
            <Feather name="share-2" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onConnectPress}>
            <Image
              source={require("../../../assets/icons/block.png")}
              style={styles.iconSub}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// styles
// ─────────────────────────────────────────────────────────────────────────────

const CARD_BG = "#FFE699";
const BTN_BG = "#FFF0C3";

const styles = StyleSheet.create({
  cardWrapper: {
    flexDirection: "row",
    backgroundColor: CARD_BG,
    padding: 16,
    borderRadius: 24,
    // alignItems: "flex-start",
    alignItems: "center",
    // justifyContent: "center",

    // subtle shadow (iOS + Android)
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  avatar: {
    width: 140,
    height: 152,
    borderRadius: 20,
  },
  infoBlock: { flex: 1, marginLeft: 16 },

  /* text */
  name: {
    fontSize: 20,
    fontFamily: "InterBold",
    marginBottom: 4,
    width: 100,
  },
  title: {
    fontSize: 14,
    color: "#646464",
    fontFamily: "InterSemiBold",
  },
  location: {
    fontSize: 12,
    fontFamily: "InterMedium",
    color: "#646464",
  },

  /* bottom actions */
  actionRow: {
    flexDirection: "row",
    marginTop: 24,
    gap: 10,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 30,
    backgroundColor: BTN_BG,
    justifyContent: "center",
    alignItems: "center",
  },

  /* video button */
  videoBtn: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  iconSub: {
    width: 24,
    height: 24,
  },
  iconsMain: {
    width: 30,
    height: 30,
  },
});
