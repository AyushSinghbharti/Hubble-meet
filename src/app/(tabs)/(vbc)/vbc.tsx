import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import SearchBar from "../../../components/SearchBar";
import VBCCard from "../../../components/VbcCard";
import HubbleCard from "../../../components/HubbleCard";
import RequestsCard from "./RequestsCard";
import { useConnectionStore } from "@/src/store/connectionStore";
import { useUserConnectionVbcs } from "@/src/hooks/useConnection";
import { useAuthStore } from "@/src/store/auth";

export default function VBCScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("VBC");
  const requestCount = useConnectionStore((s) => s.requestCount);
  const connectionVbcs = useConnectionStore((s) => s.connectionVbcs);
  const userId = useAuthStore((userId) => userId);

  const tabs = [
    { label: "VBC", number: 0, showLabel: false },
    { label: "Hubble Circle", number: 0, showLabel: false },
    { label: "Requests", number: requestCount, showLabel: true },
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
        style={[styles.tabRow, selectedTab === "Requests" && { marginTop: 50 }]}
      >
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.label;
          return (
            <TouchableOpacity
              key={tab.label}
              onPress={() => setSelectedTab(tab.label)}
              style={[styles.tabButton, isActive && styles.activeTab]}
            >
              {tab.showLabel ? (
                <View style={styles.tabWithBadge}>
                  <Text
                    style={[styles.tabText, isActive && styles.activeTabText]}
                  >
                    {tab.label}
                  </Text>
                  <Text style={styles.badgeText}>{tab.number}</Text>
                </View>
              ) : (
                <Text
                  style={[styles.tabText, isActive && styles.activeTabText]}
                >
                  {tab.label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={[{ flex: 1 }]}>
        {selectedTab === "VBC" && (
          <VBCCard
            profiles={connectionVbcs
              .filter(
                (item) => item.connection_status?.toLowerCase() !== "blocked"
              )
              .filter((item) => {
                const q = searchQuery.toLowerCase();
                return (
                  item.full_name?.toLowerCase().includes(q) ||
                  item.city?.toLowerCase().includes(q) ||
                  item.job_title?.toLowerCase().includes(q)
                );
              })}
          />
        )}
        {selectedTab === "Hubble Circle" && <HubbleCard />}
        {selectedTab === "Requests" && <RequestsCard />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
  },
  tabRow: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    paddingVertical: 4,
    borderRadius: 30,
  },
  tabButton: {
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  activeTab: {
    backgroundColor: "#BBCF8D",
  },
  tabText: {
    color: "#111827",
    fontFamily: "InterSemiBold",
    textAlign: "center",
  },
  activeTabText: {
    color: "#1F2937",
  },
  tabWithBadge: {
    gap: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
    height: 22,
    width: 22,
    backgroundColor: "red",
    color: "white",
    fontSize: 13,
    textAlign: "center",
    verticalAlign: "middle",
    borderRadius: 20,
  },
  logo: {
    height: 12,
    width: 12,
  },
});
