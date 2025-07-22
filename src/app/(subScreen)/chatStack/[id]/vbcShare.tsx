// screens/chatStack/[id]/vbcShare.tsx
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

  const handleShare = (vbc: VbcCard) => {
    if (!user || !chatId) return;
    // console.log(vbc.displayName);
    console.log(JSON.stringify(vbc, null, 2));
    sendMessage(
      {
        content: "This is VBC",
        messageType: "VCARD",
        sender: {
          id: user.user_id,
          username: user.full_name,
          email: user.email,
        },
        chat: { id: chatId, name: "", isGroup: false },
        vCardData: {
          userId: vbc.user_id,
          displayName: vbc.full_name,
          jobTitle: vbc.job_title || "",
        //   companyName: vbc.company_name[0] || "",
          location: vbc.city || "",
          allowSharing: true,
        },
      },
      // sendMessage(
      //   {
      //     content: "Hello from user1",
      //     messageType: "VCARD",
      //     sender: {
      //       id: "69b83914-b7ef-4039-a9b6-61935224b7dd",
      //       username: "user1",
      //       email: "testuser200@gmail.com",
      //     },
      //     chat: {
      //       id: "d6384e9f-660c-4db3-bfc0-44e21cd160be",
      //       name: "",
      //       isGroup: false,
      //     },
      //     vCardData: {
      //       userId: "AC805aFKMC",
      //       displayName: "John Doe",
      //       jobTitle: "Wosk",
      //       companyName: "Ayu",
      //       location: "GRAMBEL",
      //       allowSharing: false,
      //     },
      //   },
      {
        onSuccess: () => {
          Alert.alert("Shared", `${vbc.displayName} sent as vCard`);
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
              data={vbcCards}
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
                    backgroundColor={item.color}
                    title={item.job_title}
                    location={item.city}
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
