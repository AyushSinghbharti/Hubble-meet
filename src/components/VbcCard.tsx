import React, { useState } from "react";
import {
  View,
  FlatList,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import CustomModal from "./Modal/CustomModal";
import BlockUserModal from "./Modal/BlockUserModal";
import CustomCard from "./Cards/vbcCard";

interface User {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: any;

}

const { width } = Dimensions.get("window");
const CARD_GAP = 10;
const CARD_WIDTH = (width - CARD_GAP * 2 - 8) / 2.1; // 8px total horizontal margin (4 + 4)


const VbcCard = ({spacing}) => {
  const [addModal, setAddModal] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const users: User[] = [
    {
      id: "1",
      name: "Robin Gupta",
      role: "Design Lead at Amazon",
      location: "Bengaluru, India",
      avatar: require("../../assets/images/p1.jpg"),
    },
    {
      id: "2",
      name: "Ananya Sen",
      role: "UX Designer at Swiggy",
      location: "Delhi, India",
      avatar: require("../../assets/images/p1.jpg"),
    },
    {
      id: "3",
      name: "Rahul Mehta",
      role: "PM at Flipkart",
      location: "Mumbai, India",
      avatar: require("../../assets/images/p1.jpg"),
    },
    {
      id: "4",
      name: "Neha Sharma",
      role: "Engineer at Zomato",
      location: "Chennai, India",
      avatar: require("../../assets/images/p1.jpg"),
    },
    {
      id: "5",
      name: "Neha Sharma",
      role: "Engineer at Zomato",
      location: "Chennai, India",
      avatar: require("../../assets/images/p1.jpg"),
    },
    {
      id: "6",
      name: "Neha Sharma",
      role: "Engineer at Zomato",
      location: "Chennai, India",
      avatar: require("../../assets/images/p1.jpg"),
    },
  ];

  const handleChatPress = (user: User) => Alert.alert("Chat", `Chat with ${user.name}`);
  const handleSharePress = (user: User) => Alert.alert("Share", `Share ${user.name}`);
  const handleAddPress = (user: User) => setBlockModal(true);
  const handleProfilePress = (user: User) => Alert.alert("Profile", `Viewing ${user.name}`);
  const handleBagPress = (user: User) => {
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
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContainer,,{spacing}]}
        columnWrapperStyle={styles.row}
       renderItem={({ item, index }) => (
  <View
    style={[
      styles.cardWrapper,
      index % 2 !== 0 && { marginTop: 30 }, // add marginTop to every right column
    ]}
  >
    <CustomCard
      {...item}
      onChatPress={() => handleChatPress(item)}
      onSharePress={() => handleSharePress(item)}
      onAddPress={() => handleAddPress(item)}
      onBagPress={() => handleBagPress(item)}
      onProfilePress={() => handleProfilePress(item)}
    />
  </View>
)}

      />

     <BlockUserModal
  visible={blockModal}
  userName="Geetha Reddy"
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
          name={selectedUser.name}
          onConfirm={() => {
            Alert.alert("Open Bag", `Bag opened for ${selectedUser.name}`);
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
paddingHorizontal:10,
  paddingTop: 16,
},

  row: {
    justifyContent: "space-between",
  
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginLeft:-10
  },
});
