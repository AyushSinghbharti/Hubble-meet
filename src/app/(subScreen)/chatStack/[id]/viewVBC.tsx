import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import PopUpNotification from "../../../../components/chatScreenComps/popUpNotification";
import PopUpOption from "../../../../components/chatScreenComps/popUpOption";
import ShareModal from "@/src/components/Share/ShareBottomSheet"; // Add this import
import { UserProfile } from "@/src/interfaces/profileInterface";
import {
  useBlockUser,
  useCloseConnection,
  useUnblockUser,
} from "@/src/hooks/useConnection";
import { useAuthStore } from "@/src/store/auth";
import colourPalette from "@/src/theme/darkPaletter";

export default function ViewVBC() {
  const params = useLocalSearchParams();
  const item: UserProfile = JSON.parse(params.item as string);
  const id = params.id;
  const router = useRouter();

  const [isCloseFriend, setCloseFriend] = useState(
    item?.status === "CLOSE_CONNECTION" || false
  );
  const [isVisible, setVisible] = useState(false);
  const [blockPopUp, setBlockPopUp] = useState(false);
  const [shareModal, setShareModal] = useState(false); // Add share modal state
  const [isBlocked, setBlocked] = useState(item?.status === "BLOCKED" || false);

  const userId = useAuthStore((s) => s.userId);

  // Update actions to reflect current blocked state
  const actions = [
    { id: "share", label: "Share", icon: "share-2" },
    {
      id: "chat",
      label: "Chat",
      icon: "message-square",
      image: require("../../../../../assets/icons/chat2.png"),
      disabled: isBlocked, // Disable chat if user is blocked
    },
    {
      id: "add",
      label: isCloseFriend
        ? "Remove from Hubble circle"
        : "Add to Hubble circle",
      icon: "star",
      image: isCloseFriend
        ? require("../../../../../assets/icons/star2.png")
        : require("../../../../../assets/icons/star.png"),
      disabled: isBlocked, // Disable add to circle if user is blocked
    },
    {
      id: "block",
      label: isBlocked ? "Unblock user" : "Block user",
      icon: "user-x",
      image: isBlocked
        ? require("../../../../../assets/icons/unblock.png") // You might need to add an unblock icon
        : require("../../../../../assets/icons/block.png"),
    },
  ];

  const { mutate: addToCircle } = useCloseConnection();
  const { mutate: blockUser } = useBlockUser();
  const { mutate: unBlockUser } = useUnblockUser();

  const handleBlock = () => {
    if (isBlocked) {
      // Unblock user
      unBlockUser(
        {
          user_id: userId,
          blocked_user_id: item.user_id,
        },
        {
          onSuccess: () => {
            setBlocked(false);
            console.log("User unblocked successfully");
          },
          onError: (error) => {
            console.error("Failed to unblock user:", error);
            // Optionally show error message to user
          },
        }
      );
    } else {
      // Block user
      blockUser(
        {
          user_id: userId,
          blocked_user_id: item.user_id,
        },
        {
          onSuccess: () => {
            setBlocked(true);
            setCloseFriend(false); // Remove from close friends when blocked
            console.log("User blocked successfully");
          },
          onError: (error) => {
            console.error("Failed to block user:", error);
            // Optionally show error message to user
          },
        }
      );
    }
    setBlockPopUp(false); // Close the popup
  };

  const operation = ({ option }: { option: string }) => {
    if (option === "add" && !isBlocked) {
      addToCircle(
        { user_id: userId, closed_user_id: item.user_id },
        {
          onSuccess: () => {
            setCloseFriend(!isCloseFriend);
            setVisible(true); // Show success notification
          },
          onError: (error) => {
            console.error("Failed to update circle status:", error);
          },
        }
      );
    } else if (option === "block") {
      setBlockPopUp(true);
    } else if (option === "chat" && !isBlocked) {
      router.back();
    } else if (option === "share") {
      setShareModal(true); // Open share modal
    }
  };

  const ActionRow = ({ item }: { item: (typeof actions)[0] }) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.row,
        item.disabled && styles.disabledRow, // Add disabled style
      ]}
      activeOpacity={item.disabled ? 1 : 0.6}
      onPress={() => !item.disabled && operation({ option: item.id })}
    >
      {item.image ? (
        <Image
          source={item.image}
          style={[
            { height: 22, width: 22, tintColor: colourPalette.textPrimary },
            item.disabled && styles.disabledImage, // Add disabled image style
          ]}
        />
      ) : (
        <Feather
          name={item.icon as any}
          size={21}
          color={
            item.disabled
              ? colourPalette.textPlaceholder
              : colourPalette.textPrimary
          }
        />
      )}
      <Text
        style={[
          styles.rowLabel,
          item.disabled && styles.disabledText, // Add disabled text style
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      backdropColor={colourPalette.backgroundPrimary}
      onRequestClose={() => router.back()}
      animationType="slide"
    >
      <View style={styles.header}>
        <TouchableOpacity
          hitSlop={16}
          style={{ paddingVertical: 12 }}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colourPalette.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity hitSlop={8}>
          <Image
            source={require("../../../../../assets/icons/pitch2.png")}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
      </View>

      <Image
        source={{
          uri:
            item.profile_picture_url ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRooEnD32-UtBw55GBfDTxxUZApMhWWnRaoLw&s",
        }}
        style={styles.avatar}
      />

      <Text style={styles.name}>{item.full_name}</Text>
      <Text style={styles.role}>{item.job_title}</Text>

      {/* Show blocked status */}
      {isBlocked && <Text style={styles.blockedStatus}>Blocked</Text>}

      <View style={styles.divider} />

      <View>
        {actions.map((a) => (
          <ActionRow key={a.id} item={a} />
        ))}
      </View>

      {/* Screen Popups */}
      <PopUpNotification
        visible={isVisible}
        closeFriend={!isCloseFriend}
        onClose={() => {
          setVisible(false);
        }}
        name={item.full_name}
      />

      <PopUpOption
        visible={blockPopUp}
        onClose={() => setBlockPopUp(false)}
        onSelect={handleBlock}
        message={
          isBlocked ? `Unblock ${item.full_name}` : `Block ${item.full_name}`
        }
        description={
          isBlocked
            ? "This contact will be able to send you messages again"
            : "Blocked contacts cannot send you message. This contact will not be notified"
        }
        acceptButtonName={isBlocked ? "Unblock" : "Block"}
        cancelButtonName="Cancel"
      />

      {/* Share Modal */}
      <ShareModal
        visible={shareModal}
        onClose={() => setShareModal(false)}
        cardProfile={item}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  videoBtn: {
    width: 24,
    height: 24,
  },

  /* Profile */
  avatar: {
    alignSelf: "center",
    width: 174,
    height: 174,
    borderRadius: 174 / 2,
  },
  name: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "InterBold",
    color: colourPalette.textPrimary,
  },
  role: {
    textAlign: "center",
    fontFamily: "Inter",
    marginTop: 4,
    fontSize: 13,
    color: colourPalette.textSecondary,
  },
  blockedStatus: {
    textAlign: "center",
    fontFamily: "Inter",
    marginTop: 4,
    fontSize: 12,
    color: colourPalette.buttonPrimary,
    fontWeight: "bold",
  },

  /* Divider */
  divider: {
    height: 1,
    backgroundColor: colourPalette.backgroundSecondary,
    marginVertical: 24,
    marginHorizontal: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  disabledRow: {
    opacity: 0.5,
  },
  rowLabel: {
    marginLeft: 16,
    fontSize: 15,
    color: colourPalette.textPrimary,
    fontFamily: "Inter",
  },
  disabledText: {
    color: colourPalette.textPlaceholder,
  },
  disabledImage: {
    opacity: 0.5,
  },
});
