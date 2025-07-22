import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  Pressable,
  Image,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/auth";
import { logout } from "../../hooks/useAuth";
import NavHeader from "../../components/NavHeader";
import SettingsCard from "../../components/Cards/SettingsCard";
import Button from "../../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Setting = () => {
  const router = useRouter();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const clearToken = useAuthStore((store) => store.clearToken);

  const handleLogout = async () => {
    const router = useRouter();
    const { clearToken, resetUser } = useAuthStore.getState();

    try {
      console.log('[Logout] Clearing AsyncStorage...');
      await AsyncStorage.multiRemove(['authToken', 'userId', 'user', 'profileCompleted']);

      // Clear Zustand store state
      clearToken();
      resetUser();

      console.log('[Logout] Redirecting to login...');
      router.replace('/'); // or '/login' or '/onboardingScreen'
    } catch (err) {
      console.error('[Logout] Failed:', err);
    }
  };

  return (
    <View style={styles.container}>
      <NavHeader title="Setting" style={{ paddingHorizontal: 16 }} />

      <ScrollView contentContainerStyle={[styles.content]}>
        {/* Section 1 */}
        <Text style={styles.sectionTitle}>MY DETAILS</Text>
        <SettingsCard
          items={[
            { label: "Profile", onPress: () => router.push("/Profile1") },
            {
              label: "Account",
              onPress: () => router.push("/Account"),
              showArrow: true,
            },
          ]}
        />

        {/* Section 2 */}
        <Text style={styles.sectionTitle}>OTHER SETTINGS</Text>
        <SettingsCard
          items={[
            {
              label: "Permissions",
              onPress: () => router.push("/Permissions"),
            },
            {
              label: "Notifications",
              onPress: () => router.push("/Notifications"),
              showArrow: true,
            },
          ]}
        />

        {/* Section 3 */}
        <Text style={styles.sectionTitle}>LEGAL</Text>
        <SettingsCard
          items={[
            {
              label: "Security & Privacy",
              onPress: () => router.push("/SecurityandPrivacy"),
            },
            {
              label: "Support & Help",
              onPress: () => router.push("/SupportHelp"),
              showArrow: true,
            },
            {
              label: "Logout account",
              onPress: () => setLogoutModalVisible(true),
              showArrow: false,
              color: "red",
            },
          ]}
        />
      </ScrollView>

      {/* Logout Modal */}
      <Modal
        transparent
        visible={logoutModalVisible}
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <Pressable
          onPress={() => setLogoutModalVisible(false)}
          style={styles.modalBackground}
        >
          <View style={styles.modalBox}>
            {/* Close Icon */}
            <Pressable
              style={styles.closeIcon}
              onPress={() => setLogoutModalVisible(false)}
            >
              <Text style={styles.closeText}>×</Text>
            </Pressable>

            {/* Question Mark Icon */}
            <Image
              style={styles.logoutImage}
              source={require("../../../assets/icons/logout.png")}
            />

            {/* Title */}
            <Text style={styles.modalTitle}>Do You Want To Log Out?</Text>

            {/* Logout Button */}
            <Button
              label="Yes, Logout"
              onPress={handleLogout}
              width={"100%"}
              style={{ marginTop: 0 }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3E3E3E",
    paddingTop: Platform.OS === "ios" ? 10 : 30,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "InterBold",
    color: "#FFF",
    marginBottom: 8,
    marginTop: 24,
  },
  logoutImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    backgroundColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    backgroundColor: "red",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: {
    color: "#333",
    fontWeight: "600",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
  closeIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
  },
  closeText: {
    fontSize: 24,
    color: "#000",
  },
  questionMark: {
    fontSize: 60,
    color: "#F7941D", // Orange color
    marginBottom: 12,
  },

  logoutMainButton: {
    width: "100%",
    backgroundColor: "#1A1A1A", // Dark color
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutMainButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
