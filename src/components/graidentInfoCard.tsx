import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { UserProfile } from "../interfaces/profileInterface";
import ErrorAlert from "./errorAlert";

const aspectRatio = 3 / 4;

const ProfileViewer = ({
  item,
  onPress,
  onAddPress,
  error,
  setError,
}: {
  item: UserProfile;
  onPress: () => void;
  onAddPress: (reciever_id: string) => void;
  error: string | null;
  setError: any;
}) => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.root}>
      {/* Background Image */}

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <Image
        source={{ uri: item.profile_picture_url }}
        style={[
          styles.backgroundImage,
          { aspectRatio, flex: 1, width: "100%" },
        ]}
        resizeMode="cover"
      />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={[
          "transparent",
          "transparent",
          "transparent",
          "rgba(255,255,255, 0.75)",
          "#ffffff",
        ]}
        style={styles.gradient}
        pointerEvents="none"
      />

      {/* Top Icons: Connect & Close */}
      <View style={styles.topIcons}>
        <TouchableOpacity
          onPress={() => onAddPress(item.user_id)}
          style={styles.iconBtn}
        >
          <MaterialIcons name="person-add" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPress} style={styles.iconBtn}>
          <MaterialIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Invisible pressable layer */}
        <Pressable onPress={onPress} style={styles.pressOverlay} />

        <LinearGradient
          colors={[
            "transparent",
            "rgba(255,255,255, 0.75)",
            "rgba(255,255,255, 0.85)",
            "rgba(255,255,255, 0.95)",
            "rgba(255,255,255, 1)",
            "#ffffff",
          ]}
          style={styles.innerGradient}
        >
          {/* HEADER */}
          <View style={styles.headerTextBlock}>
            <Text style={styles.name}>{item.full_name}</Text>
            <Text style={styles.position}>{item.job_title || ""}</Text>
            <Text style={styles.location}>{item.city || ""}</Text>
          </View>

          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.paragraph}>{item.bio}</Text>

          <Text style={styles.sectionTitle}>Industries work</Text>
          <View style={styles.chipRow}>
            {item.current_industry?.map((chip) => (
              <View key={chip} style={styles.chip}>
                <Text style={styles.chipText}>{chip}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Area of Interest</Text>
          <View style={styles.chipRow}>
            {item.industries_of_interest?.map((chip) => (
              <View key={chip} style={styles.chip}>
                <Text style={styles.chipText}>{chip}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginTop: 18,
    marginHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    width: "100%",
    aspectRatio,
  },
  topIcons: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 2,
  },
  iconBtn: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 12,
  },
  contentContainer: {
    paddingTop: 280,
    paddingBottom: 50,
  },
  pressOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  innerGradient: {
    width: "100%",
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 12,
  },
  headerTextBlock: {},
  name: {
    fontFamily: "InterBold",
    fontSize: 28,
    color: "#000",
  },
  position: {
    fontSize: 18,
    fontFamily: "InterSemiBold",
    color: "#000",
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    fontFamily: "InterSemiBold",
    color: "#000",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 26,
    marginBottom: 8,
    color: "#000",
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 21,
    color: "#444",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    marginRight: 10,
    marginBottom: 12,
    backgroundColor: "#f7f7f7",
  },
  chipText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
  },
});

export default ProfileViewer;
