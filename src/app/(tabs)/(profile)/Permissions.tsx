// App.tsx or SettingScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Switch,
  Modal,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from "react-native-permissions";

import NavHeader from "../../../components/NavHeader";
import Button from "../../../components/Button";
import requestAndSavePermission from "@/utils/requestAndSavePermission";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@/src/store/auth";
import { useUpdateUserProfile } from "@/src/hooks/useProfile";
import { FONT } from "@/assets/constants/fonts";

export default function SettingsScreen() {
  const user = useAuthStore((s) => s.user);
  const [toggles, setToggles] = useState({
    shareVBC: user?.allow_vbc_sharing ?? false,
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

  const [modalVisible, setModalVisible] = useState(false);
  const [pendingToggle, setPendingToggle] = useState<{
    key: keyof typeof toggles;
    value: boolean;
  } | null>(null);

  // Get the correct photo permission based on platform and Android version
  const getPhotoPermission = () => {
    if (Platform.OS === "ios") {
      return PERMISSIONS.IOS.PHOTO_LIBRARY;
    } else {
      // For Android, use READ_MEDIA_IMAGES for API 33+ (Android 13+)
      // and READ_EXTERNAL_STORAGE for older versions
      if (Number(Platform.Version) >= 33) {
        return PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
      } else {
        return PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      }
    }
  };

  // Check actual device permissions on component mount
  const checkDevicePermissions = async () => {
    try {
      // Check contacts permission
      const contactsPermission =
        Platform.OS === "ios"
          ? PERMISSIONS.IOS.CONTACTS
          : PERMISSIONS.ANDROID.READ_CONTACTS;

      const contactsStatus = await check(contactsPermission);
      const hasContactsAccess = contactsStatus === RESULTS.GRANTED;

      // Check photos permission using the correct constant
      const photosPermission = getPhotoPermission();
      const photosStatus = await check(photosPermission);
      const hasPhotosAccess = photosStatus === RESULTS.GRANTED;

      // Update toggles based on actual permissions
      setToggles((prev) => ({
        ...prev,
        accessContacts: hasContactsAccess,
        accessPhotos: hasPhotosAccess,
      }));

      console.log("Contacts permission:", contactsStatus);
      console.log("Photos permission:", photosStatus);
    } catch (error) {
      console.error("Error checking permissions:", error);
    }
  };

  const toggleSwitch = async (key: keyof typeof toggles) => {
    // Check if user is trying to turn off contacts or photos permission
    if (
      (key === "accessContacts" || key === "accessPhotos") &&
      toggles[key] === true
    ) {
      // Show confirmation modal
      setPendingToggle({ key, value: !toggles[key] });
      setModalVisible(true);
      return;
    }

    // For enabling permissions, request them
    if (key === "accessContacts" && !toggles[key]) {
      const success = await handleContactsPermission();
      if (success) {
        const updated = { ...toggles, [key]: true };
        setToggles(updated);
        saveSettingsToStorage(updated);
      }
      return;
    }

    if (key === "accessPhotos" && !toggles[key]) {
      const success = await handlePhotosPermission();
      if (success) {
        const updated = { ...toggles, [key]: true };
        setToggles(updated);
        saveSettingsToStorage(updated);
      }
      return;
    }

    // For other toggles
    const updated = { ...toggles, [key]: !toggles[key] };
    setToggles(updated);
    saveSettingsToStorage(updated);
  };

  const handleContactsPermission = async (): Promise<boolean> => {
    try {
      const permission =
        Platform.OS === "ios"
          ? PERMISSIONS.IOS.CONTACTS
          : PERMISSIONS.ANDROID.READ_CONTACTS;

      const result = await request(permission);

      if (result === RESULTS.GRANTED) {
        await requestAndSavePermission("contacts");
        return true;
      } else if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
        Alert.alert(
          "Permission Required",
          "To enable contact access, please go to Settings and allow contacts permission for this app.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => openSettings() },
          ]
        );
      }
      return false;
    } catch (error) {
      console.error("Error requesting contacts permission:", error);
      return false;
    }
  };

  const handlePhotosPermission = async (): Promise<boolean> => {
    try {
      const permission = getPhotoPermission();
      const result = await request(permission);

      if (result === RESULTS.GRANTED) {
        await requestAndSavePermission("photos");
        return true;
      } else if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
        Alert.alert(
          "Permission Required",
          "To enable photo access, please go to Settings and allow photos permission for this app.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => openSettings() },
          ]
        );
      }
      return false;
    } catch (error) {
      console.error("Error requesting photos permission:", error);
      return false;
    }
  };

  const confirmToggleChange = async () => {
    if (!pendingToggle) return;

    const { key, value } = pendingToggle;

    // When disabling permissions, guide user to device settings
    if (
      (key === "accessContacts" || key === "accessPhotos") &&
      value === false
    ) {
      Alert.alert(
        "Disable Permission",
        "To completely disable this permission, you need to go to your device Settings > Apps > [Your App Name] > Permissions and turn off the permission there. This will ensure the permission is revoked at the system level.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => {
              openSettings();
              // Update UI state to reflect the intended change
              const updated = { ...toggles, [key]: value };
              setToggles(updated);
              saveSettingsToStorage(updated);
            },
          },
        ]
      );
    } else {
      const updated = { ...toggles, [key]: value };
      setToggles(updated);
      saveSettingsToStorage(updated);
    }

    // Close modal and reset pending toggle
    setModalVisible(false);
    setPendingToggle(null);
  };

  const cancelToggleChange = () => {
    setModalVisible(false);
    setPendingToggle(null);
  };

  const saveSettingsToStorage = async (settings: typeof toggles) => {
    try {
      await AsyncStorage.setItem("userSettings", JSON.stringify(settings));
      console.log("Settings saved");
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  };

  // Load settings from storage and check actual permissions when screen loads
  useEffect(() => {
    const initializeSettings = async () => {
      try {
        // First check actual device permissions
        await checkDevicePermissions();

        // Then load any saved settings (for non-permission toggles)
        const stored = await AsyncStorage.getItem("userSettings");
        if (stored) {
          const savedSettings = JSON.parse(stored);

          // Re-check permissions to ensure UI is accurate
          const contactsPermission =
            Platform.OS === "ios"
              ? PERMISSIONS.IOS.CONTACTS
              : PERMISSIONS.ANDROID.READ_CONTACTS;
          const photosPermission = getPhotoPermission();

          const [contactsStatus, photosStatus] = await Promise.all([
            check(contactsPermission),
            check(photosPermission),
          ]);

          setToggles({
            ...savedSettings,
            accessContacts: contactsStatus === RESULTS.GRANTED,
            accessPhotos: photosStatus === RESULTS.GRANTED,
          });
        }
      } catch (e) {
        console.error("Failed to initialize settings", e);
      }
    };

    initializeSettings();
  }, []);

  // Check permissions when app comes back to foreground
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active") {
        checkDevicePermissions();
      }
    };

    const subscription =
      Platform.OS === "ios"
        ? require("react-native").AppState.addEventListener(
          "change",
          handleAppStateChange
        )
        : require("react-native").AppState.addEventListener(
          "change",
          handleAppStateChange
        );

    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  const { mutate: updateUser } = useUpdateUserProfile();
  useEffect(() => {
    if (user) {
      updateUser({
        userId: user.user_id,
        data: { allowVbcSharing: toggles.shareVBC },
      });
    }
  }, [toggles.shareVBC]);

  const getModalContent = () => {
    if (!pendingToggle) return { title: "", description: "" };

    if (pendingToggle.key === "accessContacts") {
      return {
        title: "Disable Contact Access?",
        description:
          "You'll be directed to device settings to completely revoke contact permission. This will prevent the app from accessing your contacts until you re-enable it.",
      };
    }

    if (pendingToggle.key === "accessPhotos") {
      return {
        title: "Disable Photo Access?",
        description:
          "You'll be directed to device settings to completely revoke photo permission. This will prevent the app from accessing your photos until you re-enable it.",
      };
    }

    return { title: "", description: "" };
  };

  const modalContent = getModalContent();

  return (
    <ScrollView
      style={[styles.container]}
      contentContainerStyle={{ paddingBottom: 30, flex: 1 }}
    >
      <NavHeader title="Permissions" />

      <View style={styles.cardContainer}>
        <SettingItem
          label="Allow VBC "
          value={toggles.shareVBC}
          onValueChange={() => toggleSwitch("shareVBC")}
          subLabel={<Text>Allow Matched Users to Share Your {'\n'} VBCs to their Connections in the App</Text>}
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

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancelToggleChange}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
            <Text style={styles.modalDescription}>
              {modalContent.description}
            </Text>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelToggleChange}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmToggleChange}
              >
                <Text style={styles.confirmButtonText}>Go to Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const SettingItem = ({
  label,
  value,
  onValueChange,
  subLabel,
  bottomWidth,
}: any) => (
  <View style={[styles.settingItem, { borderBottomWidth: bottomWidth }]}>
    <View>
      <Text style={styles.settingLabel}>{label}</Text>
      {subLabel && <Text style={styles.settingSubLabel}>{subLabel}</Text>}
    </View>
    <Switch
      trackColor={{ false: "#EEEEE", true: "#BBCF8D" }}
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
    backgroundColor: "#121212",
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
    fontSize: 15,
    fontFamily: FONT.MONSERRATMEDIUM,
    color: "#fff",
  },
  settingSubLabel: {
    fontSize: 12,
    fontFamily: FONT.MONSERRATREGULAR,
    color: "#fff",
    marginTop: 4,
  },
  button: {
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
    width: "85%",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#111",
  },
  modalDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
