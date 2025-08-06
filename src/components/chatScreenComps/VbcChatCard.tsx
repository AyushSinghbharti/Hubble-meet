import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { FONT } from "@/assets/constants/fonts";
import { VbcCard as VbcInterface } from "@/src/interfaces/vbcInterface";
import { getStableColor } from "@/src/utility/getStableColor";
import { usePitchStore } from "@/src/store/pitchStore";
import { useRouter } from "expo-router";
import { useOtherUserProfile } from "@/src/hooks/useProfile";
import { fetchOtherUserProfile } from "@/src/api/profile";

type Props = {
  vbc: Partial<VbcInterface> & {
    vCardUserId: string;
    vCardDisplayName?: string;
    vCardJobTitle?: string;
    vCardCompanyName?: string | null;
    vCardLocation?: string | null;
    vCardProfilePic?: string | null;
    avatarUrl?: string | null;
    vCardBgColor?: string | null;
    displayName?: string;
    jobTitle?: string;
    companyName?: string | null;
    location?: string | null;
    profile_picture_url?: string | null;
    color?: string | null;
  };
  backgroundColor?: string;
  style?: any;
};

const FALLBACK_AVATAR = require("@/assets/icons/profile.png");

const VbcChatCard: React.FC<Props> = ({ vbc, backgroundColor, style }) => {
  // ---- resolve fields ----
  const name = vbc.vCardDisplayName ?? "Unknown";
  const title = vbc.vCardJobTitle ?? "";
  const company = vbc.vCardCompanyName ?? "";
  const location = vbc.vCardLocation ?? "";
  const avatar = vbc.vCardProfilePic ?? null;
  const bgColor =
    vbc.vCardBgColor ||
    getStableColor(vbc.vCardUserId || "") ||
    backgroundColor ||
    vbc.color ||
    "#F5E6B3";
  const [loading, setLoading] = useState(false);

  const setCurrentPitchUser = usePitchStore((s) => s.setCurrentPitchUser);
  const router = useRouter();

  // ---- responsive sizing ----
  const { width } = useWindowDimensions();
  const maxWidth = Math.min(width * 0.7, 300);

  const handleProfilePress = async () => {
    setLoading(true);
    const res = await fetchOtherUserProfile(vbc?.vCardUserId || "");
    console.log(res);
    setCurrentPitchUser(res);
    setLoading(false);
    router.push("/connect");
  };

  const s = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: bgColor,
          borderRadius: 24,
          width: maxWidth,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
          marginVertical: 8,
          overflow: "hidden",
        },
        // Part 1: Top section with image left and content right
        topSection: {
          flexDirection: "row",
          alignItems: "center",
          padding: 8,
          paddingHorizontal: 16,
        },
        avatar: {
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#EAEAEA",
        },
        content: {
          flex: 1,
          marginLeft: 16,
        },
        name: {
          fontSize: 18,
          fontFamily: FONT.MONSERRATSEMIBOLD,
          color: "#1B1B1B",
          lineHeight: 20,
        },
        title: {
          fontSize: 14,
          color: "#646464",
          fontFamily: FONT.MONSERRATMEDIUM,
          lineHeight: 18,
        },
        company: {
          fontSize: 12,
          color: "#646464",
          fontFamily: FONT.MONSERRATMEDIUM,
        },
        location: {
          fontSize: 13,
          color: "#7A7A7A",
          fontFamily: FONT.REGULAR || "Inter-Regular",
          lineHeight: 16,
        },
        // Part 2: Bottom section with View button
        bottomSection: {
          borderTopWidth: 2,
          borderTopColor: "rgba(0, 0, 0, 0.1)",
        },
        viewButton: {
          paddingVertical: 6,
          alignItems: "center",
          backgroundColor: "transparent",
        },
        viewButtonText: {
          color: "#1B1B1B",
          fontSize: 18,
          fontFamily: FONT.MONSERRATSEMIBOLD,
        },
      }),
    [bgColor, maxWidth]
  );

  if (loading) {
    return (
      <View
        style={[
          s.card,
          style,
          { minHeight: 100, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <View style={[s.card, style]}>
      {/* Part 1: Top section - Image left, content right */}
      <Pressable style={s.topSection} onPress={handleProfilePress}>
        <Image
          source={avatar ? { uri: avatar } : FALLBACK_AVATAR}
          style={s.avatar}
        />

        <View style={s.content}>
          <Text style={s.name} numberOfLines={1}>
            {name}
          </Text>

          {!!title && (
            <Text style={s.title} numberOfLines={1}>
              {title}
            </Text>
          )}
          {!!company && (
            <Text style={s.company} numberOfLines={1}>
              {company}
            </Text>
          )}
          {!!location && (
            <Text style={s.location} numberOfLines={1}>
              {location}
            </Text>
          )}
        </View>
      </Pressable>

      {/* Part 2: Bottom section - View button with border top */}
      <View style={s.bottomSection}>
        <Pressable style={s.viewButton} onPress={handleProfilePress}>
          <Text style={s.viewButtonText}>View</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default VbcChatCard;
