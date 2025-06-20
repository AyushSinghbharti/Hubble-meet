import { SafeAreaView, StyleSheet, Text, View, ScrollView, Platform } from "react-native";
import React from "react";
import SearchBar from "../../../components/SearchBar";
import VbcCard from "../../../components/VbcCard";
import NavHeader from "../../../components/NavHeader";

const HubbleCircleViewAll = () => {
  return (
    <View style={styles.container}>
      <View style={{ paddingTop: Platform.OS === "ios" ? 10 : 20 }}>
        <NavHeader />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>
          <SearchBar placeholder="Enter name or location" />

          <Text style={styles.title}>Your Hubble Circle</Text>

          <View style={styles.cardContainer}>
            <VbcCard />
            {/* Add more <VbcCard /> components if needed */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HubbleCircleViewAll;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  innerContainer: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 16,
    color: "#333",
  },
  cardContainer: {
    gap: 12,
    paddingBottom: 20,
  },
});
