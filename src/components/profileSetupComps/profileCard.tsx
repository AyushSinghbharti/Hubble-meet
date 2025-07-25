import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Share,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { lightenColor } from "@/utils/lightenColor";

const FALLBACK_AVATAR =
  "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?w=740";

const shareProfile = async ({ name, title, location }) => {
  try {
    await Share.share({
      title: "Share your profile",
      message: `${name} • ${title} • ${location}\nCheck my profile here: <link>`,
    });
  } catch (e) {
    console.warn("Share error:", e);
  }
};

export default function ProfileCard({
  avatar,
  name = "Robin Gupta",
  title = "Design Lead at Microsoft",
  location = "Bengaluru, India",
  onVideoPress = () => {},
  onChatPress = () => {},
  onBlockPress = () => {},
  backgroundColor = "#FFE699",
  viewShareButton = true,
  viewChatButton = true,
  viewBlockButton = true,
  style,
}) {
  const { width } = useWindowDimensions();
  const compact = width < 380;

  /* sizes that scale with screen */
  const AVATAR = compact ? 96 : 140;
  const ACTION = compact ? 32 : 40;
  const VIDEO = ACTION + 10;
  const ICON = ACTION * 0.6;
  const showActions = viewShareButton || viewChatButton || viewBlockButton;

  const s = useMemo(
    () =>
      StyleSheet.create({
        card: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor,
          padding: compact ? 12 : 16,
          borderRadius: compact ? 20 : 24,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        },
        avatar: {
          width: AVATAR,
          height: AVATAR * 1.1,
          borderRadius: 20,
        },

        /* block holding everything except avatar */
        body: {
          flex: 1,
          marginLeft: compact ? 12 : 16,
        },

        /* first row → profile text & video btn */
        header: {
          flexDirection: "row",
          alignItems: "flex-start",
        },
        textWrap: {
          flex: 1, // ← takes remaining width
          flexShrink: 1, // ← wrap before pushing
        },
        videoBtn: {
          width: VIDEO,
          height: VIDEO,
          borderRadius: 99,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: 8, // space from text
          alignSelf: "flex-start",
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
        },
        name: {
          fontSize: compact ? 18 : 20,
          fontFamily: "InterBold",
          lineHeight: compact ? 22 : 24,
          flexWrap: "wrap",
        },
        title: {
          fontSize: compact ? 12 : 14,
          color: "#646464",
          fontFamily: "InterSemiBold",
          marginTop: 2,
        },
        location: {
          fontSize: compact ? 10 : 12,
          color: "#646464",
          fontFamily: "InterMedium",
          marginTop: 1,
        },

        /* second row → action icons */
        actions: {
          flexDirection: "row",
          marginTop: compact ? 14 : 22,
        },
        actionBtn: {
          width: ACTION,
          height: ACTION,
          borderRadius: 99,
          backgroundColor: lightenColor(backgroundColor, 75) || "#FFF0C3",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 10,
        },
      }),
    [backgroundColor, width]
  );

  return (
    <View style={[s.card, style]}>
      <Image
        source={avatar ? { uri: avatar } : { uri: FALLBACK_AVATAR }}
        style={s.avatar}
      />

      <View style={s.body}>
        <View style={s.header}>
          <View style={s.textWrap}>
            <Text style={s.name} numberOfLines={2}>
              {name}
            </Text>
            <Text style={s.title}>{title}</Text>
            <Text style={s.location}>{location}</Text>
          </View>

          <TouchableOpacity style={s.videoBtn} onPress={onVideoPress}>
            <Image
              source={require("../../../assets/icons/pitch2.png")}
              style={{ width: ICON + 4, height: ICON + 4 }}
            />
          </TouchableOpacity>
        </View>

        {showActions && (
          <View style={s.actions}>
            {viewChatButton && (
              <TouchableOpacity style={s.actionBtn} onPress={onChatPress}>
                <Image
                  source={require("../../../assets/icons/chat.png")}
                  style={{ width: ICON, height: ICON, tintColor: "#000" }}
                />
              </TouchableOpacity>
            )}

            {viewShareButton && (
              <TouchableOpacity
                style={s.actionBtn}
                onPress={() => shareProfile({ name, title, location })}
              >
                <Feather name="share-2" size={ICON} />
              </TouchableOpacity>
            )}

            {viewBlockButton && (
              <TouchableOpacity style={s.actionBtn} onPress={onBlockPress}>
                <Image
                  source={require("../../../assets/icons/block2.png")}
                  style={{ width: ICON, height: ICON }}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
