// App.tsx or SettingScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Switch,
} from "react-native";

import NavHeader from "../../../components/NavHeader";
import Button from "../../../components/Button";
import requestAndSavePermission from "@/utils/requestAndSavePermission";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const [toggles, setToggles] = useState({
    shareVBC: false,
    accessContacts: true,
    accessPhotos: true,
    pendingRequests: true,
    newConnections: true,
    chatNotifications: true,
    allEmails: false,
    acknowledgmentEmails: false,
    reminderEmails: false,
    feedbackEmails: false,
    marketingEmails: false,
  });

  const toggleSwitch = async (key: keyof typeof toggles) => {
    const updated = { ...toggles, [key]: !toggles[key] };
    setToggles(updated);
    saveSettingsToStorage(updated);

    if (key === "accessContacts" && updated.accessContacts) {
      await requestAndSavePermission("contacts");
    }
    if (key === "accessPhotos" && updated.accessPhotos) {
      await requestAndSavePermission("photos");
    }
  };

  const saveSettingsToStorage = async (settings: typeof toggles) => {
    try {
      await AsyncStorage.setItem("userSettings", JSON.stringify(settings));
      console.log("Settings saved");
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  };

  // Load settings from storage when screen loads
  useEffect(() => {
    const loadSettingsFromStorage = async () => {
      try {
        const stored = await AsyncStorage.getItem("userSettings");
        if (stored) {
          setToggles(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    };

    loadSettingsFromStorage();
  }, []);


  return (
    <ScrollView
      style={[styles.container]}
      contentContainerStyle={{ paddingBottom: 30, flex: 1 }}
    >
      <NavHeader title="Permissions" />

      <View style={styles.cardContainer}>
        <SettingItem
          label="Allow Matched Users to Share My VBC"
          value={toggles.shareVBC}
          onValueChange={() => toggleSwitch("shareVBC")}
          bottomWidth={1}
        />
        <SettingItem
          label="Access Contacts from Phone"
          value={toggles.accessContacts}
          onValueChange={() => toggleSwitch("accessContacts")}
          subLabel="Required for sharing contacts in chat"
          bottomWidth={1}
        />
        <SettingItem
          label="Access Photos from Phone"
          value={toggles.accessPhotos}
          onValueChange={() => toggleSwitch("accessPhotos")}
          subLabel="Required for sharing media in chat"
          bottomWidth={0}
        />
      </View>

      <View style={{ flex: 1, justifyContent: "flex-end" }}>

        <Button label="Save settings" onPress={() => { }} />
      </View>
    </ScrollView>
  );
}

const SettingItem = ({ label, value, onValueChange, subLabel, bottomWidth }: any) => (
  <View style={[styles.settingItem, { borderBottomWidth: bottomWidth }]}>
    <View>
      <Text style={styles.settingLabel}>{label}</Text>
      {subLabel && <Text style={styles.settingSubLabel}>{subLabel}</Text>}
    </View>
    <Switch
      trackColor={{ false: "#EEEEE", true: "#596C2D" }}
      thumbColor={"#fff"}
      value={value}
      onValueChange={onValueChange}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#3E3E3E",
    paddingTop: Platform.OS === "ios" ? 10 : 30,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    marginTop: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  settingLabel: {
    width: "95%",
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
  },
  settingSubLabel: {
    fontSize: 12,
    fontFamily: "Inter",
    color: "#888",
    marginTop: 4,
  },
  button: {
    // marginTop: 380,
    backgroundColor: "#000",
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 12,
    marginHorizontal: 16,
    justifyContent: "flex-end",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
});
