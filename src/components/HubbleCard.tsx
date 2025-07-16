import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import ProfileCardVertical from "./ProfileCardVertical";
import { UserProfile } from "@/src/interfaces/profileInterface";
import profileData from "../dummyData/dummyProfiles";
import { useConnectionStore } from "../store/connectionStore";
import { useAuthStore } from "../store/auth";

const { width } = Dimensions.get("window");
const CENTER = width / 2;

const ProfileOrbit = ({}: {}) => {
  const router = useRouter();
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(
    null
  );
  const connections = useConnectionStore((state) => state.connections);
  const user = useAuthStore((state) => state.user);
  const outerProfiles = connections.slice(0, 3);
  const innerProfiles = connections.slice(3, connections.length - 1);

  const handleViewAll = () => {
    router.push("/HubbleCircleViewAll");
  };

  const handleAvatarPress = (profile: UserProfile) => {
    setSelectedProfile(profile);
  };

  const renderOrbitAvatars = (
    radius: number,
    avatars: UserProfile[],
    length: number
  ) =>
    avatars.map((avatar, index) => {
      const angle = (2 * Math.PI * index) / length;
      const imageSize = Math.floor(Math.random() * 30) + 25;
      const x = CENTER + radius * Math.cos(angle) - imageSize / 2;
      const y = CENTER + radius * Math.sin(angle) - imageSize / 2;

      return (
        <TouchableOpacity
          key={avatar.user_id}
          onPress={() => handleAvatarPress(avatar)}
          activeOpacity={0.8}
          style={[styles.avatarWrapper, { left: x, top: y }]}
        >
          <Image
            source={{ uri: avatar.profile_picture_url }}
            style={[
              styles.avatar,
              {
                borderColor: "#a8d69f", // Default color, or random/given color
                height: imageSize,
                width: imageSize,
              },
            ]}
          />
        </TouchableOpacity>
      );
    });

  return (
    <View style={styles.container}>
      {/* Orbit Gradients */}
      <LinearGradient
        colors={["#fff", "#BBCF8D"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.1, y: 3 }}
        style={[styles.gradientCircle, styles.outerGradient]}
      >
        <View style={styles.dashedBorderOuter} />
      </LinearGradient>

      <LinearGradient
        colors={["#B3C778", "#FFFFFF"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.gradientCircle, styles.innerGradient]}
      >
        <View style={styles.dashedBorderInner} />
      </LinearGradient>

      {/* Orbit Avatars */}
      {renderOrbitAvatars(165, outerProfiles, outerProfiles.length)}
      {renderOrbitAvatars(115, innerProfiles, outerProfiles.length + 1)}

      {/* Center Avatar */}
      {outerProfiles[0] && (
        <Image
          source={{
            uri:
              user?.profile_picture_url ||
              "https://xsgames.co/randomusers/assets/images/favicon.png",
          }}
          style={[styles.centerAvatar, { left: CENTER - 50, top: CENTER - 50 }]}
        />
      )}

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleViewAll}>
        <Text style={styles.buttonText}>View All</Text>
      </TouchableOpacity>

      {selectedProfile && (
        <ProfileCardVertical
          modalVisible={true}
          onClose={() => setSelectedProfile(null)}
          selectedProfile={selectedProfile}
        />
      )}
    </View>
  );
};

export default ProfileOrbit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    right: 15,
  },
  gradientCircle: {
    position: "absolute",
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  outerGradient: {
    width: 330,
    height: 330,
    top: CENTER - 165,
    left: CENTER - 165,
  },
  innerGradient: {
    width: 230,
    height: 230,
    top: CENTER - 115,
    left: CENTER - 115,
  },
  dashedBorderOuter: {
    width: 330,
    height: 330,
    borderRadius: 165,
    borderWidth: 2,
    borderColor: "#a8d69f",
    borderStyle: "dashed",
    position: "absolute",
  },
  dashedBorderInner: {
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 2,
    borderColor: "#a8d69f",
    borderStyle: "dashed",
    position: "absolute",
  },
  avatarWrapper: {
    position: "absolute",
  },
  avatar: {
    borderRadius: 25,
    borderWidth: 3,
    backgroundColor: "#fff",
  },
  centerAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: "absolute",
    borderWidth: 2,
    borderColor: "#fff",
  },
  button: {
    position: "absolute",
    bottom: 120,
    marginLeft: 15,
    alignSelf: "center",
    backgroundColor: "#d1e9c6",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#b0d6a1",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
});
