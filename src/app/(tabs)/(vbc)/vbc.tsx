import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import SearchBar from "../../../components/SearchBar";
import VBCCard from "../../../components/VbcCard";
import HubbleCard from "../../../components/HubbleCard";
import RequestsCard from "./RequestsCard";
import { Pressable } from "react-native-gesture-handler";

export default function VBCScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("VBC");

  const tabs = [
    { label: "VBC", number: 0, showLabel: false },
    { label: "Hubble Circle", number: 0, showLabel: false },
    { label: "Requests", number: 5, showLabel: true },
  ];

  return (
    <View style={styles.container}>
      {selectedTab !== "Requests" && (
        <View style={{ marginTop: 40 }}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Enter name or location"
          />
        </View>
      )}

      <View
        style={[
          styles.tabRow,
          selectedTab === "Requests" && { marginTop: 50 },
        ]}
      >
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.label;
          return (
            <TouchableOpacity
              key={tab.label}
              onPress={() => setSelectedTab(tab.label)}
              style={[
                styles.tabButton,
                isActive && styles.activeTab,
              ]}
            >
              {tab.showLabel ? (
                <View style={styles.tabWithBadge}>
                  <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                    {tab.label}
                  </Text>
                  <Pressable style={[styles.badge,{bottom:20,right:30}]}>
                    <Image
                      style={styles.logo}
                      source={require("../../../../assets/logo/Logo1.png")}
                    />
                    <Text style={styles.badgeText}>{tab.number}</Text>
                  </Pressable>
                </View>
              ) : (
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {tab.label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View
        style={[{ flex: 1 }, selectedTab === "Requests" && { marginTop: 20 }]}
      >
        {selectedTab === "VBC" && <VBCCard />}
        {selectedTab === "Hubble Circle" && <HubbleCard />}
        {selectedTab === "Requests" && <RequestsCard />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  tabButton: {
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    flex: 1,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: "#BBCF8D",
    height: 50,
    bottom: 4,
  },
  tabText: {
    color: "#111827",
    fontWeight: "600",
    textAlign: "center",
  },
  activeTabText: {
    color: "#1F2937",

  },
  tabWithBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
       left:30,

  },
  badge: {
    backgroundColor: "red",
    height: 25,
    width: 50,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginLeft: 5,
  },
  badgeText: {
    color: "white",
    fontSize: 13,
  },
  logo: {
    height: 12,
    width: 12,
  },
});
