import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Share,
  Alert,
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";
import ProfileCardVertical from "./ProfileCardVertical";
import { UserProfile } from "@/src/interfaces/profileInterface";
import { useConnectionStore } from "../store/connectionStore";
import { useAuthStore } from "../store/auth";
import { resolveChatAndNavigate } from "../utility/resolveChatAndNavigate";
import BlockUserModal from "./Modal/BlockUserModal";
import CustomModal from "./Modal/CustomModal";
import axios from "axios";

const { width } = Dimensions.get("window");
const CENTER = width / 2;

const ProfileOrbit = () => {
  const router = useRouter();
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | boolean>(false);
  const connections = useConnectionStore((state) => state.connections);
  const user = useAuthStore((state) => state.user);
  const [addModal, setAddModal] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | boolean>(true);
  const [filteredConnections, setFilteredConnections] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useAuthStore((state) => state.user);

  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const orbitRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();

    Animated.loop(
      Animated.timing(orbitRotation, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);

  const rotateInterpolate = orbitRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const outerProfiles = filteredConnections.slice(0, 3);
  const innerProfiles = filteredConnections.slice(3);

  const renderOrbitAvatars = (radius: number, avatars: UserProfile[], length: number) =>
    avatars.map((avatar, index) => {
      const angle = (2 * Math.PI * index) / length;
      const imageSize = Math.floor(Math.random() * 30) + 25;
      const x = CENTER + radius * Math.cos(angle) - imageSize / 2;
      const y = CENTER + radius * Math.sin(angle) - imageSize / 2;

      return (
        <TouchableOpacity
          key={avatar.user_id}
          onPress={() => setSelectedProfile(avatar)}
          activeOpacity={0.8}
          style={[styles.avatarWrapper, { left: x, top: y }]}
        >
          <Image
            source={{
              uri:
                avatar.profile_picture_url ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRooEnD32-UtBw55GBfDTxxUZApMhWWnRaoLw&s",
            }}
            style={[
              styles.avatar,
              {
                borderColor: "#a8d69f",
                height: imageSize,
                width: imageSize,
              },
            ]}
          />
        </TouchableOpacity>
      );
    });

  const fetchCloseConnections = async ({
    userId,
    currentPage = 1,
    pageSize = 10,
  }: {
    userId: string;
    currentPage?: number;
    pageSize?: number;
  }): Promise<UserProfile[]> => {
    try {
      const res = await axios.post(
        "https://d2aks9kyhua4na.cloudfront.net/api/connection/close-connections",
        {
          userId,
          currentPage,
          pageSize,
        }
      );

      if (res.data?.success) return res.data.data;

      throw new Error(res.data?.message || "Failed to fetch close connections");
    } catch (error: any) {
      throw error;
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const fetchCloseCircleData = async () => {
      if (!currentUser?.user_id) {
        if (!isCancelled) {
          setFilteredConnections([]);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const result = await fetchCloseConnections({ userId: currentUser.user_id });
        if (!isCancelled) {
          setFilteredConnections(result);
        }
      } catch (err) {
        if (!isCancelled) {
          setFilteredConnections(
            connections.filter(
              (c) => c.connection_status?.toLowerCase() === "close_connection"
            )
          );
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchCloseCircleData();
    return () => {
      isCancelled = true;
    };
  }, [connections, currentUser?.user_id]);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading close circle...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Only show orbit rings if there are close connections */}
      {filteredConnections.length > 0 && (
        <>
          <Animated.View
            style={[
              styles.outerGradient,
              styles.gradientCircle,
              {
                transform: [{ scale: scaleAnim }, { rotate: rotateInterpolate }],
              },
            ]}
            pointerEvents="none"
          >
            <View style={styles.dashedBorderOuter} />
          </Animated.View>

          <Animated.View
            style={[
              styles.innerGradient,
              styles.gradientCircle,
              {
                transform: [{ scale: scaleAnim }, { rotate: rotateInterpolate }],
              },
            ]}
            pointerEvents="none"
          >
            <View style={styles.dashedBorderInner} />
          </Animated.View>
        </>
      )}

      {/* Avatars always shown regardless of orbit rings */}
      {renderOrbitAvatars(165, outerProfiles, outerProfiles.length)}
      {renderOrbitAvatars(115, innerProfiles, outerProfiles.length + 1)}

      {/* Center Avatar - always show */}
      <Image
        source={{
          uri:
            user?.profile_picture_url ||
            "https://xsgames.co/randomusers/assets/images/favicon.png",
        }}
        style={[styles.centerAvatar, { left: CENTER - 50, top: CENTER - 50 }]}
      />

      {/* View All Button - always show */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/HubbleCircleViewAll")}>
        <Text style={styles.buttonText}>View All</Text>
      </TouchableOpacity>

      {/* Message if no connections */}
      {/* {filteredConnections.length === 0 && (
        <View style={styles.noConnectionsContainer}>
          <Text style={styles.noConnectionsText}>
            No close circle connections found
          </Text>
        </View>
      )} */}

      {selectedProfile && (
        <ProfileCardVertical
          modalVisible={true}
          onClose={() => setSelectedProfile(null)}
          selectedProfile={selectedProfile}
          onPressChat={async () =>
            await resolveChatAndNavigate({ currentUser, targetUser: selectedProfile })
          }
          onPressShare={() => {
            Share.share({
              message: `Hey see my VBC card here ${selectedProfile?.full_name}`,
            });
          }}
          onPressBlock={() => {
            setBlockModal(true);
            setSelectedUser(selectedProfile);
          }}
          onPressBag={() => {
            setSelectedUser(selectedProfile);
            setAddModal(true);
          }}
          onPressPitch={() => router.push("/pitch")}
        />
      )}

      <BlockUserModal
        visible={blockModal}
        userName={selectedUser?.full_name}
        onClose={() => setBlockModal(false)}
        onSubmit={(reason) => {
          setBlockModal(false);
        }}
      />

      {selectedUser && (
        <CustomModal
          visible={addModal}
          onClose={() => setAddModal(false)}
          name={selectedUser.full_name}
          onConfirm={() => {
            Alert.alert("Open Bag", `Bag opened for ${selectedUser.full_name}`);
            setAddModal(false);
          }}
          confirmText="Open Bag"
          cancelText="Close"
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  noConnectionsContainer: {
    position: "absolute",
    top: CENTER - 10,
    left: CENTER - 100,
    width: 200,
    alignItems: "center",
  },
  noConnectionsText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
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
