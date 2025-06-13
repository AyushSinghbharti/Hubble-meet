import React, { memo, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import {
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import CustomModal from "./Modal/CustomModal";
import BlockUserModal from "./Modal/BlockUserModal";


interface User {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: any;
}

interface CardProps extends User {
  onChatPress: () => void;
  onSharePress: () => void;
  onAddPress: () => void;
  onBagPress: () => void;
  onProfilePress: () => void;
}

const getRandomColor = () => {
  const colors = ["#FDF0A6", "#FBC8C9", "#C9FBC8", "#F6F6F6", "#E0EAF3"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const CustomCard = memo(
  ({
    name,
    role,
    location,
    avatar,
    onChatPress,
    onSharePress,
    onAddPress,
    onBagPress,
    onProfilePress,
  }: CardProps) => {
    const bgColor = getRandomColor();

    return (
      <View style={styles.card}>
        <ImageBackground
          source={avatar}
          style={styles.imageSection}
          imageStyle={styles.image}
        >
          <View style={styles.topIcons}>
            <TouchableOpacity style={styles.roundIcon} onPress={onBagPress}>
              <SimpleLineIcons name="bag" size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.roundIcon} onPress={onProfilePress}>
              <Image
                source={require("../../assets/icons/Vfc/vbcinactive.png")}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View style={[styles.bottomSection, { backgroundColor: bgColor }]}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>{role}</Text>
          <Text style={styles.location}>{location}</Text>
          <View style={styles.actionIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={onChatPress}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={onSharePress}>
              <Feather name="share-2" size={20} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={onAddPress}>
              <MaterialCommunityIcons
                name="account-plus-outline"
                size={20}
                color="#333"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
);

CustomCard.displayName = "CustomCard";

const ProfileCardList = () => {
  const [addModal, setaddModal] = useState(false);
  const [blockModal, setblockModal] = useState(false);
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
  const handleAddPress = (user: User) => {

    setblockModal(true);
  }
  const handleProfilePress = (user: User) => Alert.alert("Profile", `Viewing ${user.name}`);

  const handleBagPress = (user: User) => {
    setSelectedUser(user);
    setaddModal(true);
  };

  return (
    <>
      <FlatList
        data={users}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        renderItem={({ item, index }) => (
          <View style={{ flex: 1, padding: 8, paddingTop: index % 2 === 1 ? 40 : 8 }}>
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
        onClose={() => setblockModal(false)}
        onSubmit={(reason) => {
          console.log("Blocked with reason:", reason);
          setblockModal(false);
        }}
      />

      {selectedUser && (
        <CustomModal
          visible={addModal}
          title={`Bag for ${selectedUser.name}`}
          onClose={() => setaddModal(false)}
          onConfirm={() => {
            Alert.alert("Open Bag", `Bag opened for ${selectedUser.name}`);
            setaddModal(false);
          }}
          confirmText="Open Bag"
          cancelText="Close"
        />
      )}
    </>
  );
};

export default ProfileCardList;

const CARD_WIDTH = Dimensions.get("window").width / 2 - 24;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  imageSection: {
    height: 140,
    padding: 10,
    justifyContent: "space-between",
  },
  image: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  topIcons: {
    flexDirection: "row",
    justifyContent: "space-between",

  },
  roundIcon: {
    backgroundColor: "#fff",
    width: 28,
    height: 28,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSection: {
    padding: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#111",
  },
  role: {
    fontSize: 13,
    color: "#444",
    marginTop: 2,
  },
  location: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  actionIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  iconButton: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 10,
    elevation: 2,
  },
});
