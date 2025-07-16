import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Alert,
  StyleSheet,
  Dimensions,
  Text,
  Share,
} from "react-native";
import CustomModal from "./Modal/CustomModal";
import BlockUserModal from "./Modal/BlockUserModal";
import CustomCard from "./Cards/vbcCard";
import { useRouter } from "expo-router";
import { UserProfile } from "@/src/interfaces/profileInterface";
import profileData from "../dummyData/dummyProfiles";
import { useConnectionStore } from "../store/connectionStore";

interface User {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: any;
}

const { width } = Dimensions.get("window");
const CARD_GAP = 10;
const CARD_WIDTH = (width - CARD_GAP * 2 - 8) / 2.15; // 8px total horizontal margin (4 + 4)

const VbcCard = ({ spacing }: { spacing?: any }) => {
  const [addModal, setAddModal] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const router = useRouter();
  const connections = useConnectionStore((state) => state.connections);
  const users: UserProfile[] = connections;

  const handleChatPress = (user: UserProfile) => {
    router.push({
      pathname: `chatStack/${user.user_id}`,
      params: { item: JSON.stringify(user) },
    });
  };
  const handleSharePress = (user: UserProfile) =>{
    Share.share({message: `Hey see my VBC card here ${user.full_name}`});
  }
  const handleBlockPress = (user: UserProfile) => {
    setBlockModal(true);
    setSelectedUser(user);
  };
  const handleProfilePress = (user: UserProfile) =>
    Alert.alert("Profile", `Viewing ${user.full_name}`);
  const handleBagPress = (user: UserProfile) => {
    setSelectedUser(user);
    setAddModal(true);
  };

  return (
    <>
      <FlatList
        data={users}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.user_id}
        contentContainerStyle={[styles.listContainer, { spacing }]}
        columnWrapperStyle={styles.row}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.cardWrapper,
              index % 2 !== 0 && { marginTop: 30 }, // add marginTop to every right column
            ]}
          >
            <CustomCard
              id={item.user_id}
              name={item.full_name}
              role={item.job_title}
              location={item.city}
              avatar={{ uri: item.profile_picture_url }}
              onChatPress={() => handleChatPress(item)}
              onSharePress={() => handleSharePress(item)}
              onAddPress={() => handleBlockPress(item)}
              onBagPress={() => handleBagPress(item)}
              onProfilePress={() => handleProfilePress(item)}
            />
          </View>
        )}
      />

      <BlockUserModal
        visible={blockModal}
        userName={selectedUser?.full_name}
        onClose={() => setBlockModal(false)}
        onSubmit={(reason) => {
          console.log("Blocked with reason:", reason);
          setBlockModal(false);
        }}
      />

      {selectedUser && (
        <CustomModal
          visible={addModal}
          onClose={() => setAddModal(false)}
          name={selectedUser.full_name}
          onConfirm={() => {
            Alert.alert("Open Bag", `Bag opened for ${selectedUser.full_name}`);
            setAddModal(false);
          }}
          confirmText="Open Bag"
          cancelText="Close"
        />
      )}
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
});
