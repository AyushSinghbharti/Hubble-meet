import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useAuthStore } from "@/src/store/auth";
import { useUserConnectionVbcs } from "@/src/hooks/useConnection";
import { useSendMessage } from "@/src/hooks/useChat";
import { Chat } from "@/src/interfaces/chatInterface";
import { VbcCard } from "@/src/interfaces/vbcInterface";
import ProfileCard from "@/src/components/profileSetupComps/profileCard";
import { getStableColor } from "@/src/utility/getStableColor";
import { useChatStore } from "@/src/store/chatStore";

type Props = {
  visible: boolean;
  chatId: string;
  chatName: string;
  onClose: () => void;
};

export default function ShareVBCScreen({
  visible,
  chatId,
  onClose,
  chatName,
}: Props) {
  const user = useAuthStore((s) => s.user);
  const {
    data: vbcCards,
    isLoading,
    isError,
  } = useUserConnectionVbcs({
    userId: user?.user_id || "",
  });
  const { mutate: sendMessage, isLoading: sending } = useSendMessage();
  const currentChat = useChatStore((state) => state.currentChat);
  // console.log(JSON.stringify(vbcCards, null, 4))

  const handleShare = (vbc: VbcCard) => {
    if (!user || !chatId) return;
    sendMessage(
      {
        content: `Shared VBC of ${vbc.full_name || vbc.display_name}`,
        messageType: "VCARD",
        sender: {
          id: user.user_id,
          username: user.full_name,
          email: user.email,
        },
        chat: { id: chatId, name: "", isGroup: false, participants:  currentChat.participants || [], },
        vCardData: {
          userId: vbc.user_id,
          displayName: vbc.full_name || vbc.display_name,
          jobTitle: vbc.job_title || "",
          companyName: vbc.company_name,
          location: vbc.city || vbc.location,
          allowSharing: true,
        },
      },
      {
        onSuccess: () => {
          Alert.alert("Shared", `${vbc.full_name} sent as vCard`);
          onClose();
        },
        onError: (err) => {
          console.error("Share VBC failed", err);
          Alert.alert("Error", "Failed to share vCard");
        },
      }
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={true}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.header}>Share a VBC</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>×</Text>
            </TouchableOpacity>
          </View>

          {isLoading || sending ? (
            <ActivityIndicator style={{ flex: 1 }} size="large" />
          ) : isError || !vbcCards ? (
            <View style={styles.center}>
              <Text>Couldn’t load your VBCs</Text>
            </View>
          ) : (
            <FlatList
              data={vbcCards.filter(
                (vbc) => vbc.connection_status !== "BLOCKED"
              )}
              keyExtractor={(i) => i.id}
              contentContainerStyle={{ paddingBottom: 32 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.25}
                  onPress={() => handleShare(item)}
                  style={{ marginBottom: 16 }}
                >
                  <ProfileCard
                    avatar={item.profile_picture_url}
                    name={item.full_name}
                    backgroundColor={
                      item.color || getStableColor(item.user_id || "")
                    }
                    title={item.job_title}
                    location={item.cities_on_radar[0]}
                    viewShareButton={false}
                  />
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.sep} />}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  container: {
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  header: { fontSize: 18, fontWeight: "600" },
  close: { fontSize: 24, lineHeight: 24 },
  sep: { height: 1, backgroundColor: "#eee", marginVertical: 8 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
