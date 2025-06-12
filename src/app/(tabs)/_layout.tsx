import React from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { Tabs } from "expo-router";

const baseUrl = "../../../assets/icons";

const icons = {
  chat: require(`${baseUrl}/chat.png`),
  pitch: require(`${baseUrl}/pitch.png`),
  connect: require(`${baseUrl}/connect.png`),
  vbc: require(`${baseUrl}/vbc.png`),
  profile: require(`${baseUrl}/profile.png`),
};

const getIcon = (iconKey: keyof typeof icons, focused: boolean) => (
  <Image
    source={icons[iconKey]}
    style={[styles.icon, { tintColor: focused ? "#BBCF8D" : "#000" }]}
  />
);

export default function StackLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#BBCF8D",
        tabBarStyle: {paddingTop: 7}
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
          tabBarLabel: ({ focused }) =>
            !focused ? (
              <Text
                style={{ fontWeight: "bold", fontSize: 10, color: "#64748B" }}
              >
                Connect
              </Text>
            ) : null,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <View style={styles.circleWrapper}>
                <Image
                  source={icons.connect}
                  style={[styles.icon, { tintColor: "#000" }]}
                />
                <Text
                  style={{ fontWeight: "bold", fontSize: 10, color: "#000" }}
                >
                  Connect
                </Text>
              </View>
            ) : (
              <View style={{ alignItems: "center" }}>
                <Image
                  source={icons.connect}
                  style={[styles.icon, { tintColor: "#000" }]}
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
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  circleWrapper: {
    backgroundColor: "#BBCF8D",
    borderRadius: 40,
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
    shadowColor: "#BBCF8D",
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
