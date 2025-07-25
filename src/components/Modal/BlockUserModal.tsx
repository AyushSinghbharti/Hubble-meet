import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useAuthStore } from "@/src/store/auth";
import AlertModal from "@/src/components/Alerts/AlertModal";
import { FONT } from "@/assets/constants/fonts";
import { useBlockUser } from "@/src/hooks/useConnection"; // ✅ your custom hook

interface BlockUserModalProps {
  visible: boolean;
  onClose: () => void;
  userName: string;
  blockedUserId: string;
  onBlockSuccess?: () => void;
}

const BlockUserModal: React.FC<BlockUserModalProps> = ({
  visible,
  onClose,
  userName,
  blockedUserId,
  onBlockSuccess,
}) => {
  const [blockedModalVisible, setBlockedModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const userId = useAuthStore((state) => state.userId);
  const token = useAuthStore((state) => state.token);

  const { mutateAsync: blockUserMutation } = useBlockUser();

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (blockedModalVisible) {
      timer = setTimeout(() => {
        setBlockedModalVisible(false);
        if (onBlockSuccess) onBlockSuccess();
      }, 1500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [blockedModalVisible, onBlockSuccess]);

  const handleConfirmBlock = async () => {
    console.log(userId, blockedUserId);
    onClose(); // Close the modal immediately
    if (!userId || !blockedUserId) {
      setErrorMessage("Missing user data. Cannot block.");
      setErrorModalVisible(true);
      return;
    }

    try {
      await blockUserMutation({
        user_id: userId,
        blocked_user_id: blockedUserId,
      });

      console.log("User blocked via mutation:", { userId, blockedUserId });
      setBlockedModalVisible(true);
    } catch (error: any) {
      console.error("Error blocking user:", error);
      setErrorMessage(
        error?.message || "Failed to block user. Please try again."
      );
      setErrorModalVisible(true);
    }
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={onClose}>
          <View style={styles.modalBox}>
            <Text style={styles.title}>Block {userName}?</Text>
            <Text style={styles.label}>
              Are you sure you want to block{"\n"}
              <Text style={styles.boldText}>{userName}</Text>?
            </Text>
            <Text style={styles.warning}>
              Note: You can undo this action in{" "}
              <Text style={styles.boldText}>"Blocked Users"</Text> within
              Settings.
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={onClose}
                accessibilityLabel="Cancel blocking user"
                accessibilityRole="button"
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitBtnActive}
                onPress={handleConfirmBlock}
                accessibilityLabel={`Confirm block ${userName}`}
                accessibilityRole="button"
              >
                <Text style={styles.submitTextActive}>Block</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* ✅ Success Modal */}
      <AlertModal
        visible={blockedModalVisible}
        onClose={() => setBlockedModalVisible(false)}
        label="Connection Blocked"
        imageSource={require("../../../assets/icons/tick1.png")}
        positionBottom
        viewButton={false}
        onButtonPress={() => setBlockedModalVisible(false)}
      />

      {/* ❌ Error Modal */}
      <AlertModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        // label="Error Blocking User"
        label={errorMessage}
        imageSource={require("../../../assets/icons/cross.png")}
        buttonText="OK"
        viewButton
        onButtonPress={() => setErrorModalVisible(false)}
        positionBottom
      />
    </>
  );
};

export default BlockUserModal;

// styles unchanged...

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000099",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 350,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: FONT.BOLD, // Use app's font constants
    textAlign: "center",
    marginBottom: 16,
    color: "#1F2937",
  },
  label: {
    fontSize: 16,
    fontFamily: FONT.MEDIUM,
    color: "#1F2937",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  boldText: {
    fontFamily: FONT.BOLD,
  },
  warning: {
    fontSize: 12,
    fontFamily: FONT.MEDIUM,
    color: "#FF4D4D",
    marginBottom: 24,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    paddingVertical: 14,
    borderRadius: 12,
    marginRight: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "#1F2937",
    fontSize: 16,
    fontFamily: FONT.BOLD,
  },
  submitBtnActive: {
    flex: 1,
    backgroundColor: "#FF4D4D",
    paddingVertical: 14,
    borderRadius: 12,
    marginLeft: 12,
    alignItems: "center",
  },
  submitTextActive: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: FONT.BOLD,
  },
});
