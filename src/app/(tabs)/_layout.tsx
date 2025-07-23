import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
import { Tabs, useRouter } from "expo-router";
import TabBarBackground from "../../components/TabBarBackground";
import {
  getUserIdFromStorage,
  getVBCIdFromStorage,
} from "@/src/store/localStorage";
import { useOtherUserProfile, useUserProfile } from "@/src/hooks/useProfile";
import { useGetVbcCard } from "@/src/hooks/useVbc";
import { useAuthStore } from "@/src/store/auth";
import { useConnectionStore } from "@/src/store/connectionStore";
import { dummyUserId } from "@/src/dummyData/dummyUserId";
import { useQueries } from "@tanstack/react-query";
import { fetchUserProfile } from "@/src/api/profile";
import {
  useConnectionRequests,
  useRecommendedProfiles,
  useUserConnections,
  useUserConnectionVbcs,
} from "@/src/hooks/useConnection";
import { logout } from "@/src/hooks/useAuth";
import { useGetUserPitch } from "@/src/hooks/usePitch";

const baseUrl = "../../../assets/icons";

const icons = {
  chat: require(`${baseUrl}/chat.png`),
  pitch: require(`${baseUrl}/pitch.png`),
  connect: require(`${baseUrl}/connect.png`),
  vbc: require(`${baseUrl}/vbc.png`),
  profile: require(`${baseUrl}/profile.png`),
  chatFill: require(`${baseUrl}/chatFill.png`),
  pitchFill: require(`${baseUrl}/pitchFill.png`),
  vbcFill: require(`${baseUrl}/vbcFill.png`),
  profileFill: require(`${baseUrl}/profileFill.png`),
};

const getIcon = (iconKey: keyof typeof icons, focused: boolean) =>
  focused && iconKey !== "connect" ? (
    <View
      style={{
        borderTopWidth: 1.5,
        borderColor: "red",
        paddingTop: 5,
        position: "absolute",
        top: -4.5,
      }}
    >
      <Image source={icons[`${iconKey}Fill`]} style={[styles.icon]} />
    </View>
  ) : (
    <Image
      source={icons[iconKey]}
      style={[styles.icon, { tintColor: "#9DB2CE" }]}
    />
  );

export default function StackLayout() {
  //Calling backend functions
  const router = useRouter();
  const userId = useAuthStore((s) => s.userId);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const addRecommendationsIdBulk = useConnectionStore((s) => s.addRecommendationsIdBulk);

  const [loading, setLoading] = useState(true);

  // ✅ Always call hooks statically
  const { data, isLoading, isError, error } = useUserProfile(userId || "");

  useGetVbcCard(userId || "");
  useConnectionRequests({ userId, enabled: true });
  useUserConnections(userId || "", true);
  useUserConnectionVbcs({ userId: userId || "" });
  useGetUserPitch(userId || "");
  useRecommendedProfiles(userId || "");
  useEffect(() => {
    addRecommendationsIdBulk(dummyUserId);
  }, []);
  

  // ✅ Control logic in useEffect, not around hooks
  useEffect(() => {
    if (isLoading) return;

    if (isError) {
      const status = error?.response?.status;
      if (status === 404) {
        console.warn("User not found — redirecting to profile setup");
        router.replace("/profileSetup");
      } else {
        console.warn("Authentication error — logging out");
        logout(router); // Pass router to logout
      }
      return;
    }

    if (
      !data ||
      (Object.values(data).every((v) => v === null || v === "") && userId)
    ) {
      console.warn("No user data — redirecting to login screen");
      router.replace("/login");
      return;
    }

    setUser(data);
    setLoading(false);
  }, [data, isLoading, isError, userId, router]);

  if (loading || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user && !isLoading) {
    return null; // Let the useEffect handle navigation
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Tabs
        initialRouteName="(connect)"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#99BB66",
          tabBarInactiveTintColor: "#9DB2CE",
          tabBarLabelStyle: { paddingTop: 5 },
          tabBarStyle: {
            backgroundColor: "#fff",
            marginBottom: 7,
            position: "absolute",
            borderTopWidth: 0,
            elevation: 5000,
            ...(Platform.OS === "ios" && { height: 80 }),
          },
          tabBarBackground: () => (
            <View style={{ position: "relative", top: -25 }}>
              <TabBarBackground />
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name="(chat)"
          options={{
            title: "Chat",
            tabBarIcon: ({ focused }) => getIcon("chat", focused),
          }}
        />
        <Tabs.Screen
          name="(pitch)"
          options={{
            title: "Pitch",
            tabBarIcon: ({ focused }) => getIcon("pitch", focused),
          }}
        />
        <Tabs.Screen
          name="(connect)"
          options={{
            title: "Connect",
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View
                  style={[
                    styles.circleWrapper,
                    { backgroundColor: "#99BB66", height: 60, width: 60 },
                  ]}
                >
                  <Image
                    source={icons.connect}
                    style={[styles.icon, { height: 30, width: 30 }]}
                  />
                </View>
              ) : (
                <View
                  style={[
                    styles.circleWrapper,
                    { backgroundColor: "#B2D37D", height: 55, width: 55 },
                  ]}
                >
                  <Image
                    source={icons.connect}
                    style={[
                      styles.icon,
                      { tintColor: "#000", height: 27, width: 27 },
                    ]}
                  />
                </View>
              ),
          }}
        />

        <Tabs.Screen
          name="(vbc)"
          options={{
            title: "VBC",
            tabBarIcon: ({ focused }) => getIcon("vbc", focused),
          }}
        />
        <Tabs.Screen
          name="(profile)"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused }) => getIcon("profile", focused),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  circleWrapper: {
    backgroundColor: "#B2D37D",
    borderRadius: 40,
    width: 55,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
    shadowColor: "#B2D37D",
    shadowOffset: { width: 50, height: 50 },
    shadowOpacity: 0,
    shadowRadius: 10,
    elevation: 10,
    overflow: "visible",
  },
  circleText: {
    marginTop: 4,
    fontSize: 9,
    fontWeight: "500",
    color: "#000",
  },
  labelText: {
    fontSize: 8,
    fontWeight: "500",
    color: "#000",
    marginTop: 2,
  },
});
