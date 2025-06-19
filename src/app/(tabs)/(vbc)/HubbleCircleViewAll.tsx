import { SafeAreaView, StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import SearchBar from "../../../components/SearchBar";
import VbcCard from "../../../components/VbcCard";

const HubbleCircleViewAll = () => {
  return (
    <SafeAreaView style={styles.container}>
      <SearchBar placeholder="Enter name or location" />

      <Text style={styles.title}>Your Hubble Circle</Text>

      <>
        <VbcCard spacing={12} />
      </>
    </SafeAreaView>
  );
};

export default HubbleCircleViewAll;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal:10
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
