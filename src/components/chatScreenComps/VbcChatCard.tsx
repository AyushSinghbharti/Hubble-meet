import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { FONT } from "@/assets/constants/fonts";
import { VbcCard as VbcInterface } from "@/src/interfaces/vbcInterface";

type Props = {
  vbc: Partial<VbcInterface> & {
    vCardDisplayName?: string;
    vCardJobTitle?: string;
    vCardCompanyName?: string | null;
    vCardLocation?: string | null;
    vCardAllowSharing?: boolean;
    avatarUrl?: string | null;
  };
  onPressPrimary?: () => void;     // e.g. View Profile
  onPressSecondary?: () => void;   // e.g. Share / Save
};

const VbcChatCard: React.FC<Props> = ({
  vbc,
  onPressPrimary,
  onPressSecondary,
}) => {
  const name = vbc.vCardDisplayName || vbc.displayName || "Unknown";
  const job = vbc.vCardJobTitle || vbc.jobTitle || "";
  const company = vbc.vCardCompanyName || vbc.companyName || "";
  const location = vbc.vCardLocation || vbc.location || "";
  const allowShare = vbc.vCardAllowSharing ?? vbc.allowSharing ?? false;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image
          source={
            vbc.avatarUrl
              ? { uri: vbc.avatarUrl }
              : require("@/assets/icons/profile.png")
          }
          style={styles.avatar}
        />

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {!!job && (
            <Text style={styles.sub} numberOfLines={1}>
              {job}
            </Text>
          )}
          {!!company && (
            <Text style={styles.subLight} numberOfLines={1}>
              {company}
            </Text>
          )}
          {!!location && (
            <Text style={styles.subLight} numberOfLines={1}>
              {location}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.actionsRow}>
        <Pressable style={styles.primaryBtn} onPress={onPressPrimary}>
          <Text style={styles.primaryTxt}>View Profile</Text>
        </Pressable>

        {allowShare && (
          <Pressable style={styles.secondaryBtn} onPress={onPressSecondary}>
            <Text style={styles.secondaryTxt}>Share</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default VbcChatCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    width: 230,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  row: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EAEAEA",
  },
  name: {
    fontFamily: FONT.SEMI_BOLD || FONT.BOLD || "Inter-SemiBold",
    fontSize: 15,
    color: "#1B1B1B",
  },
  sub: {
    fontFamily: FONT.MEDIUM || "Inter-Medium",
    fontSize: 13,
    color: "#4A4A4A",
    marginTop: 2,
  },
  subLight: {
    fontFamily: FONT.REGULAR || "Inter-Regular",
    fontSize: 12,
    color: "#7A7A7A",
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#EDEDED",
    marginVertical: 12,
  },
  actionsRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#6C63FF",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryTxt: {
    color: "#fff",
    fontFamily: FONT.MEDIUM || "Inter-Medium",
    fontSize: 12,
  },
  secondaryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6C63FF",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryTxt: {
    color: "#6C63FF",
    fontFamily: FONT.MEDIUM || "Inter-Medium",
    fontSize: 12,
  },
});
