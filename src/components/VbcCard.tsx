import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Alert,
  StyleSheet,
  Dimensions,
  Text,
  Share,
  Modal,
  TouchableOpacity,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import BlockUserModal from "./Modal/BlockUserModal";
import CustomCard from "./Cards/vbcCard";
import ShareModal from "./Share/ShareBottomSheet";
import { useRouter } from "expo-router";
import { UserProfile } from "@/src/interfaces/profileInterface";
import { useConnectionStore } from "../store/connectionStore";
import { useAuthStore } from "../store/auth";
import { resolveChatAndNavigate } from "../utility/resolveChatAndNavigate";
import ConnectionCard from "./Cards/connectionCard";
import ProfileViewer from "./graidentInfoCard";
import {
  useCloseConnection,
  useRemoveCloseConnection,
  useSendConnection,
  useUnblockUser,
} from "../hooks/useConnection";
import ErrorAlert from "./errorAlert";
import { VbcCard as VbcCardInterface } from "../interfaces/vbcInterface";
import { ConnectionUser } from "../interfaces/connectionInterface";
import { getStableColor } from "../utility/getStableColor";
import { usePitchStore } from "../store/pitchStore";
import PopUpNotification from "./chatScreenComps/popUpNotification";

const { width } = Dimensions.get("window");
const CARD_GAP = 10;
const CARD_WIDTH = (width - CARD_GAP * 2 - 8) / 2.15;

type UserProfileItem = UserProfile &
  Partial<ConnectionUser> &
  Partial<VbcCardInterface>;
type UserProfileDataInterface = UserProfileItem[];

const VbcCard = ({
  spacing,
  profiles,
  closeVBC,
  onEndReached,
  isLoadingMore,
}: {
  spacing?: any;
  profiles?: UserProfileDataInterface;
  closeVBC?: () => void;
  onEndReached?: () => void;
  isLoadingMore?: boolean;
}) => {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [isRemoveAction, setIsRemoveAction] = useState(false);
  const [popupName, setPopupName] = useState("");
  const [blockModal, setBlockModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [connectionDetailModal, setConnectionDetailModal] = useState(false);
  const connections = useConnectionStore((state) => state.connections);
  const users: UserProfileDataInterface = profiles
    ? profiles
    : connections.filter(
      (connection) => connection.connection_status !== "BLOCKED"
    );
  const currentUser = useAuthStore((state) => state.user);
  const userId = useAuthStore((s) => s.userId);
  const { mutate: sendConnection } = useSendConnection();
  const { mutate: unBlockUser } = useUnblockUser();
  const [error, setError] = useState<string | null>();

  const handleChatPress = async (user: UserProfile) => {
    await resolveChatAndNavigate({ currentUser, targetUser: user });
  };

  const handleSharePress = (user: UserProfile) => {
    setSelectedUser(user);
    setShareModal(true);
  };

  const handleBlockPress = (user: UserProfileItem) => {
    if (user.status === "BLOCKED" || user.connection_status === "BLOCKED") {
      unBlockUser({
        user_id: userId,
        blocked_user_id: user.user_id,
      });
      closeVBC?.(); // Close parent modal after unblocking
    } else {
      setBlockModal(true); // Open block modal
      setSelectedUser(user); // Set selected user
    }
  };

  const handleProfilePress = (user: UserProfile) => {
    setSelectedUser(user);
    setConnectionDetailModal(true);
  };

  const { mutate: removeCloseConnection } = useRemoveCloseConnection();
  const { mutate: addCloseCircle } = useCloseConnection();

  const handleBagPress = async (user: UserProfileItem) => {
    const isRemoving =
      user.status === "CLOSE_CONNECTION" ||
      user.connection_status === "CLOSE_CONNECTION";

    if (isRemoving) {
      removeCloseConnection({
        user_id: userId,
        closed_user_id: user.user_id,
      });
    } else {
      addCloseCircle({
        user_id: userId,
        closed_user_id: user.user_id,
      });
    }

    setPopupName(user.full_name);
    setIsRemoveAction(isRemoving);
    setShowPopup(true);

    setSelectedUser(user);
  };

  const handleSendRequestPress = (receiverId: string) => {
    sendConnection(
      {
        user_id: userId || "",
        receiver_id: receiverId,
      },
      {
        onSuccess: (res) => {
          setError("Request send successfully");
        },
        onError: (error) => {
          const message =
            error?.response?.data?.message ?? "Something went wrong";
          setError(message);
        },
      }
    );
  };


  const handlePitchPress = (user) => {

    router.push({ pathname: "/pitch", params: { pitchId: user.user_id } });

  };

  return (
    <>
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

      <FlatList
        data={users}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.user_id}
        contentContainerStyle={[styles.listContainer, { spacing }]}
        columnWrapperStyle={styles.row}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? (
            <ActivityIndicator style={{ marginVertical: 16 }} size="small" />
          ) : null
        }
        renderItem={({ item, index }) => {
          const cardColor = item.color ?? getStableColor(item.user_id);

          return (
            <View
              style={[styles.cardWrapper, index % 2 !== 0 && { marginTop: 30 }]}
            >
              {item.isConnected === false ? (
                <ConnectionCard
                  id={item.user_id}
                  name={item.full_name}
                  role={item.job_title || ""}
                  location={item.city || ""}
                  backgroundColor={cardColor}
                  avatar={{ uri: item.profile_picture_url }}
                  onSharePress={() => handleSharePress(item)}
                  onCardPress={() => handleProfilePress(item)}
                  onAddPress={() => handleBlockPress(item)}
                  onConnectPress={handleSendRequestPress}
                />
              ) : (
                <CustomCard
                  id={item.user_id}
                  name={item.full_name}
                  role={item.job_title || ""}
                  location={item.city || ""}
                  isBlocked={
                    item.status === "BLOCKED" ||
                    item.connection_status === "BLOCKED" ||
                    false
                  }
                  backgroundColor={cardColor}
                  status={item.status || item.connection_status}
                  avatar={{ uri: item.profile_picture_url }}
                  onChatPress={() => handleChatPress(item)}
                  onSharePress={() => handleSharePress(item)}
                  onBlockPress={() => handleBlockPress(item)}
                  onBagPress={() => handleBagPress(item)}
                  onProfilePress={() => handleProfilePress(item)}
                  handlePress={() => handlePitchPress(item)}
                />
              )}
            </View>
          );
        }}
      />

      <BlockUserModal
        visible={blockModal}
        blockedUserId={selectedUser?.user_id || ""}
        userName={selectedUser?.full_name || ""}
        onClose={() => {
          setBlockModal(false);
          closeVBC?.(); // Close parent modal when block modal closes
        }}
      />

      <PopUpNotification
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        name={popupName}
        closeFriend={isRemoveAction}
      />

      {/* Share Modal */}
      {selectedUser && (
        <ShareModal
          visible={shareModal}
          onClose={() => setShareModal(false)}
          cardProfile={selectedUser}
        />
      )}

      <Modal
        visible={connectionDetailModal}
        transparent
        animationType="fade"
        onRequestClose={() => setConnectionDetailModal(!connectionDetailModal)}
        style={{ flex: 1 }}
      >
        <ProfileViewer
          item={selectedUser}
          onPress={() => setConnectionDetailModal(!connectionDetailModal)}
          onAddPress={handleSendRequestPress}
          error={error}
          setError={setError}
        />
      </Modal>
    </>
  );
};

export default VbcCard;

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 16,
    paddingBottom: 130,
  },
  row: {
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginLeft: -10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  detailCard: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    elevation: 5,
  },
  detailName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#6C63FF",
    borderRadius: 8,
  },
});
