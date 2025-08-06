import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Share,
  Pressable,
  Alert,
  Modal,
} from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { FONT } from "@/assets/constants/fonts";
import { VbcCard as VbcInterface } from "@/src/interfaces/vbcInterface";
import { getStableColor } from "@/src/utility/getStableColor";
import { usePitchStore } from "@/src/store/pitchStore";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/src/store/auth";
import { lightenColor } from "@/utils/lightenColor";
import { resolveChatAndNavigate } from "@/src/utility/resolveChatAndNavigate";
import BlockUserModal from "@/src/components/Modal/BlockUserModal";
import ErrorAlert from "@/src/components/errorAlert";
import ShareModal from "../Share/ShareBottomSheet";
import { useUnblockUser, useBlockUser } from "@/src/hooks/useConnection";
import { useConnectionStore } from "@/src/store/connectionStore";

type Props = {
  vbc: Partial<VbcInterface> & {
    vCardDisplayName?: string;
    vCardJobTitle?: string;
    vCardCompanyName?: string | null;
    vCardLocation?: string | null;
    vCardAllowSharing?: boolean;
    avatarUrl?: string | null;

    displayName?: string;
    jobTitle?: string;
    companyName?: string | null;
    location?: string | null;
    allowSharing?: boolean;

    profile_picture_url?: string | null;
    allow_vbc_sharing?: boolean;
    color?: string | null;
  };
  backgroundColor?: string;
  viewShareButton?: boolean;
  viewChatButton?: boolean;
  viewBlockButton?: boolean;
  style?: any;
};

const FALLBACK_AVATAR = require("@/assets/icons/profile.png");

const VbcChatCard: React.FC<Props> = ({
  vbc,
  backgroundColor,
  viewShareButton = true,
  viewChatButton = true,
  viewBlockButton = true,
  style,
}) => {
  const [blockModal, setBlockModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  // ---- resolve fields ----
  const id = vbc.user_id || vbc.id || "";
  const name =
    vbc.vCardDisplayName ||
    vbc.full_name ||
    (vbc as any).display_name ||
    "Unknown";
  const title =
    vbc.vCardJobTitle || vbc.jobTitle || (vbc as any).job_title || "";
  const company =
    vbc.vCardCompanyName || vbc.companyName || (vbc as any).company_name || "";
  const location = vbc.vCardLocation || vbc.location || (vbc as any).city || "";
  const avatar = vbc.avatarUrl || vbc.profile_picture_url || null;
  const bgColor =
    getStableColor(vbc.user_id || "") || backgroundColor || vbc.color;
  const initialStatus = vbc?.status || "NOT_CONNECTED";
  const showActions = viewShareButton || viewChatButton || viewBlockButton;

  const setCurrentPitchUser = usePitchStore((s) => s.setCurrentPitchUser);
  const setFocusUserId = usePitchStore((state) => state.setFocusUserId);
  const currentUser = useAuthStore((state) => state.user);
  const userId = useAuthStore((s) => s.userId);
  const connections = useConnectionStore((state) => state.connections);
  const router = useRouter();

  // Check if user is blocked from connections store
  useEffect(() => {
    const connection = connections.find((conn) => conn.user_id === id);
    setIsBlocked(
      connection?.connection_status === "BLOCKED" || initialStatus === "BLOCKED"
    );
  }, [connections, id, initialStatus]);

  // ---- responsive sizing (chat bubble width) ----
  const { width } = useWindowDimensions();
  const maxWidth = Math.min(width * 0.75, 360);
  const compact = maxWidth < 340;

  const AVATAR = compact ? 72 : 96;
  const ACTION = compact ? 30 : 36;
  const ICON = ACTION * 0.6;

  const handleProfilePress = async () => {
    setCurrentPitchUser(vbc);
    router.push("/connect");
  };

  // Handle video/pitch press - copied from VbcCard.tsx
  const onVideoPress = () => {
    setFocusUserId(vbc.user_id); // Set focused user in store
    router.push("/pitch"); // Navigate WITHOUT params
  };

  // Handle chat press - copied from VbcCard.tsx
  const onChatPress = async () => {
    try {
      await resolveChatAndNavigate({ currentUser, targetUser: vbc });
    } catch (error) {
      console.error("Chat navigation error:", error);
      setError("Failed to start chat");
    }
  };

  // Handle share press - open ShareModal
  const onSharePress = () => {
    setShareModal(true);
  };

  // Handle block press with proper state management
  const { mutate: unBlock } = useUnblockUser();
  const { mutate: blockUser } = useBlockUser();

  const onBlockPress = () => {
    if (isBlocked) {
      // Unblock user
      unBlock(
        { user_id: userId, blocked_user_id: id },
        {
          onSuccess: () => {
            setIsBlocked(false);
          },
          onError: (error) => {
            setError("Failed to unblock user");
          },
        }
      );
    } else {
      // Block user via modal
      setBlockModal(true);
    }
  };

  // Handle successful block from modal
  const handleBlockSuccess = () => {
    setIsBlocked(true);
    setBlockModal(false);
  };

  const s = useMemo(
    () =>
      StyleSheet.create({
        card: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: bgColor,
          padding: compact ? 10 : 14,
          borderRadius: compact ? 16 : 20,
          width: maxWidth,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
        },
        avatar: {
          width: AVATAR,
          height: AVATAR * 1.05,
          borderRadius: 18,
          backgroundColor: "#EAEAEA",
        },
        body: {
          flex: 1,
          marginLeft: compact ? 10 : 14,
        },
        header: {
          flexDirection: "row",
          alignItems: "flex-start",
        },
        textWrap: {
          flex: 1,
          flexShrink: 1,
        },
        name: {
          fontSize: compact ? 16 : 18,
          fontFamily: FONT.BOLD || "Inter-Bold",
          lineHeight: compact ? 20 : 22,
          color: "#1B1B1B",
        },
        title: {
          fontSize: compact ? 12 : 13.5,
          color: "#646464",
          fontFamily: FONT.SEMI_BOLD || "Inter-SemiBold",
          marginTop: 2,
        },
        company: {
          fontSize: compact ? 12 : 13,
          color: "#7A7A7A",
          fontFamily: FONT.REGULAR || "Inter-Regular",
          marginTop: 1,
        },
        location: {
          fontSize: compact ? 11 : 12,
          color: "#7A7A7A",
          fontFamily: FONT.MEDIUM || "Inter-Medium",
          marginTop: 1,
        },
        actions: {
          flexDirection: "row",
          marginTop: compact ? 8 : 12,
        },
        actionBtn: {
          width: ACTION,
          height: ACTION,
          borderRadius: 99,
          backgroundColor: lightenColor(bgColor, 50) || "#FFF0C3",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 10,
        },
      }),
    [bgColor, maxWidth, compact, AVATAR, ACTION, ICON, showActions]
  );

  return (
    <>
      {/* Error Alert */}
      {error && (
        <View
          style={{
            position: "absolute",
            top: -50,
            left: 0,
            right: 0,
            zIndex: 1000,
          }}
        >
          <ErrorAlert message={error} onClose={() => setError(null)} />
        </View>
      )}

      <Pressable style={[s.card, style]} onPress={handleProfilePress}>
        <Image
          source={avatar ? { uri: avatar } : FALLBACK_AVATAR}
          style={s.avatar}
        />

        <View style={s.body}>
          <View style={s.header}>
            <View style={s.textWrap}>
              <Text style={s.name} numberOfLines={2}>
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

            <TouchableOpacity style={s.actionBtn} onPress={onVideoPress}>
              <Image
                source={require("@/assets/icons/pitch2.png")}
                style={{ width: ICON + 4, height: ICON + 4 }}
              />
            </TouchableOpacity>
          </View>

          {showActions && (
            <View style={s.actions}>
              {viewChatButton && !isBlocked && (
                <TouchableOpacity style={s.actionBtn} onPress={onChatPress}>
                  <Image
                    source={require("@/assets/icons/chat.png")}
                    style={{ width: ICON, height: ICON, tintColor: "#000" }}
                  />
                </TouchableOpacity>
              )}

              {viewShareButton && (
                <TouchableOpacity style={s.actionBtn} onPress={onSharePress}>
                  <Feather name="share-2" size={ICON} />
                </TouchableOpacity>
              )}

              {viewBlockButton && (
                <TouchableOpacity style={s.actionBtn} onPress={onBlockPress}>
                  {isBlocked ? (
                    <Image
                      source={require("@/assets/icons/unblock.png")}
                      style={{ width: ICON + 7, height: ICON + 7 }}
                    />
                  ) : (
                    <Image
                      source={require("@/assets/icons/block2.png")}
                      style={{ width: ICON, height: ICON }}
                    />
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </Pressable>

      {/* Block User Modal */}
      <BlockUserModal
        visible={blockModal}
        blockedUserId={vbc.user_id || ""}
        userName={name}
        onClose={() => setBlockModal(false)}
        onBlockSuccess={handleBlockSuccess}
      />

      {/* Share Modal */}
      <ShareModal
        visible={shareModal}
        onClose={() => setShareModal(false)}
        cardProfile={vbc}
      />
    </>
  );
};

export default VbcChatCard;
