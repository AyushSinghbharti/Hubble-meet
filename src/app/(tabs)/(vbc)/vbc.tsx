import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import SearchBar from "../../../components/SearchBar";
import Button from "../../../components/Button";
import VfcCard from "../../../components/VfcCard";
import HubbleCard from "../../../components/HubbleCard";
import RequestsCard from "../../../components/RequestsCard";

export default function VBCScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("VFC");

  return (
    <View style={styles.container}>
      {selectedTab !== "Requests" && (
        <>
        <View style={{marginTop:40}} > 
                <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Enter name or location"
          />

        </View>
        </>
      )}

      <View style={[styles.tabRow,selectedTab === "Requests" && { marginTop: 50 }]}>
        <Button
        width={100}
          label="VFC"
          number={0}
          showLabel={false}
          isActive={selectedTab === "VFC"}
          onPress={() => setSelectedTab("VFC")}
        />
        <Button
          label="Hubble Circle"
          number={0}
          showLabel={false}
          isActive={selectedTab === "Hubble Circle"}
          onPress={() => setSelectedTab("Hubble Circle")}
        />
        <Button
          label="Requests"
          number={5}
          showLabel={true}
          isActive={selectedTab === "Requests"}
          onPress={() => setSelectedTab("Requests")}
        />
      </View>


      <View style={[{ flex: 1 }, selectedTab === "Requests" && { marginTop: 20 }]}>
        {selectedTab === "VFC" && <VfcCard />}
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
});
