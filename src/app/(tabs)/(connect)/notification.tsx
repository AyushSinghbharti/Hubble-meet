// screens/NotificationsScreen.js
import React from "react";
import {
  View,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import NotificationCard from "../../../components/NotificationCard";
// import NavHeader from "../../../components/NavHeader";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const DATA = [
  {
    id: "1",
    name: "Kiran Patel",
    status: "Accepted your request",
    date: "25/01/2025",
    image: require("../../../../assets/images/p1.jpg"), // Replace with your own image
  },
  {
    id: "2",
    name: "Sara Ahmed",
    status: "Sent you a message",
    date: "24/01/2025",
    image: require("../../../../assets/images/p1.jpg"),
  },
];

const NotificationsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.backButton}>
        <TouchableOpacity
          onPress={() => useRouter().back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Notification</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationCard
            name={item.name}
            status={item.status}
            date={item.date}
            image={item.image}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingTop: Platform.OS === "ios" ? 10 : 30,
  },
  backButton: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButtonPlaceholder: {
    width: 32,
  },
  title: {
    color: "#000",
    fontSize: 18,
    fontFamily: "InterBold",
  },
  rightPlaceholder: {
    width: 32,
  },
});
