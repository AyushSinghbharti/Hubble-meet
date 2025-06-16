import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import {
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";

// Dummy user data
const users = [
  {
    id: "1",
    name: "Robin Gupta",
    role: "Design Lead at Amazon",
    location: "Bengaluru, India",
    avatar: require("../../../assets/icons/Vfc/vbcactive.png"),
  },
  {
    id: "2",
    name: "Ananya Sen",
    role: "UX Designer at Swiggy",
    location: "Delhi, India",
    avatar: require("../../../assets/icons/Vfc/vbcactive.png"),
  },
  {
    id: "3",
    name: "Rahul Mehta",
    role: "PM at Flipkart",
    location: "Mumbai, India",
    avatar: require("../../../assets/icons/Vfc/vbcactive.png"),
  },
  {
    id: "4",
    name: "Neha Sharma",
    role: "Engineer at Zomato",
    location: "Chennai, India",
    avatar: require("../../../assets/icons/Vfc/vbcactive.png"),
  },
];

// Random pastel background colors
const getRandomColor = () => {
  const colors = ["#FDF0A6", "#FBC8C9", "#C9FBC8", "#F6F6F6", "#E0EAF3"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const CustomCard = ({ avatar, name, role, location }) => {
  const bgColor = getRandomColor();

  return (
    <View style={styles.card}>
      <ImageBackground source={avatar} style={styles.imageSection} imageStyle={styles.image}>
        <View style={styles.topIcons}>
          <TouchableOpacity style={styles.roundIcon}>
            <SimpleLineIcons name="bag" size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundIcon}>
            <Image
              source={require("../../../assets/icons/Vfc/vbcactive.png")}
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
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="share-2" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="account-plus-outline" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Main list
export default function ProfileCardList() {
  return (
    <FlatList
      data={users}
      numColumns={2}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item, index }) => (
        <View style={{ flex: 1, padding: 8, paddingTop: index % 2 === 1 ? 40 : 8 }}>
          <CustomCard {...item} />
        </View>
      )}
    />
  );
}

const CARD_WIDTH = Dimensions.get("window").width / 2 - 24;

const styles = StyleSheet.create({
  container: {
    flex:1,
    width:400



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
    width: 40,
    height: 40,
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
