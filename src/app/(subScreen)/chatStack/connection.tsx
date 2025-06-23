import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import VbcCard from "../../../components/VbcCard";
import { useRouter } from "expo-router";

export default function Connections() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Connections</Text>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="more-vert" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <View style={styles.scrollArea}>
        <VbcCard
          spacing={20}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 50,
    backgroundColor: "#F7F7F7",
    elevation: 5,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
  },
  title: {
    fontSize: 18,
    fontFamily: "InterSemiBold",
    color: "#000",
    flex: 1,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    marginLeft: 8,
  },
  scrollArea: {
    paddingHorizontal: 12,
  },
});
