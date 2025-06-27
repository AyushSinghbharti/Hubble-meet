import React from "react";
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
    <View style={{ borderTopWidth: 1.5, borderColor: "red", paddingTop: 5 }}>
      <Image source={icons[`${iconKey}Fill`]} style={[styles.icon]} />
    </View>
  ) : (
    <Image
      source={icons[iconKey]}
      style={[styles.icon, { tintColor: "#9DB2CE" }]}
    />
  );

export default function StackLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Tabs
        initialRouteName="(connect)"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#99BB66",
          tabBarInactiveTintColor: "#9DB2CE",
          tabBarLabelStyle: {paddingTop: 5},
          tabBarStyle: {
            backgroundColor: "#fff",
            position: "absolute",
            borderTopWidth: 0,
            elevation: 5000,
            height: Platform.OS === "ios" ? 80 : 85,
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
                    style={[styles.icon, { tintColor: "#fff" }]}
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
                    style={[styles.icon, { tintColor: "#fff" }]}
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
    width: 24,
    height: 24,
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
