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
import { Tabs } from "expo-router";
import TabBarBackground from "../../components/TabBarBackground";
import {
  getUserIdFromStorage,
  getVBCIdFromStorage,
} from "@/src/store/localStorage";
import { useOtherUserProfile, useUserProfile } from "@/src/hooks/useProfile";
import { useCreateVbcCard, useGetVbcCard } from "@/src/hooks/useVbc";
import { useAuthStore } from "@/src/store/auth";
import { useConnectionStore } from "@/src/store/connectionStore";
import { dummyUserId } from "@/src/dummyData/dummyUserId";
import { useQueries } from "@tanstack/react-query";
import { fetchUserProfile } from "@/src/api/profile";
import { useConnectionRequests } from "@/src/hooks/useConnection";

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
  //Calling backend function
  const [userId, setUserId] = useState<string | null>(null);
  const [vbcId, setVbcId] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchStoredData = async () => {
      const storedUserId = await getUserIdFromStorage();
      const storedVbcId = await getVBCIdFromStorage();
      setUserId(storedUserId);
      setVbcId(storedVbcId);
    };
    fetchStoredData();
  }, []);

  useUserProfile(userId || "");
  useGetVbcCard(vbcId || "");
  const { mutate: createVbcCard } = useCreateVbcCard();
  useEffect(() => {
    if (!vbcId && user) {
      createVbcCard({
        user_id: user.user_id,
        display_name: user.full_name,
        job_title: user.job_title,
        company_name: user.current_company,
        location: user.city,
        allow_vbc_sharing: user.allow_vbc_sharing,
      });
    }
  }, [vbcId, user]);

  //Fetching all requests
  useConnectionRequests({ userId: userId, enabled: true });

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
