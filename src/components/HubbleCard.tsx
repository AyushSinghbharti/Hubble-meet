import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Share,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import ProfileCardVertical from "./ProfileCardVertical";
import { UserProfile } from "@/src/interfaces/profileInterface";
import profileData from "../dummyData/dummyProfiles";
import { useConnectionStore } from "../store/connectionStore";
import { useAuthStore } from "../store/auth";
import { resolveChatAndNavigate } from "../utility/resolveChatAndNavigate";
import BlockUserModal from "./Modal/BlockUserModal";
import CustomModal from "./Modal/CustomModal";
import { getAllConnections, getCloseCircle } from "../api/connection";
// Import the API function

const { width } = Dimensions.get("window");
const CENTER = width / 2;

const ProfileOrbit = ({}: {}) => {
  const router = useRouter();
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(
    null
  );
  const connections = useConnectionStore((state) => state.connections);
  const user = useAuthStore((state) => state.user);
  const [addModal, setAddModal] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [filteredConnections, setFilteredConnections] = useState<UserProfile[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const currentUser = useAuthStore((state) => state.user);

  // Filter connections based on close circle score
  // useEffect(() => {
  //   const fetchCloseCircleData = async () => {
  //     if (!currentUser?.user_id) {
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       setLoading(true);

  //       // Call the API to get close circle data
  //       const closeCircleData = await getCloseCircle({
  //         userId: currentUser.user_id
  //       });

  //       // Filter connections based on score > 0.5
  //       const highScoreUsers = closeCircleData
  //         .filter((item: { user_id: string; score: number }) => item.score > 0.5)
  //         .map((item: { user_id: string; score: number }) => item.user_id);

  //       // Filter the connections to only include users with high scores
  //       const filtered = connections.filter((connection) =>
  //         highScoreUsers.includes(connection.user_id)
  //       );

  //       setFilteredConnections(filtered);
  //     } catch (error) {
  //       console.error("Error fetching close circle data:", error);
  //       // Fallback to all connections if API fails
  //       setFilteredConnections(connections);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCloseCircleData();
  // }, [connections, currentUser]);

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

        // If you really need the server list, keep this:
        const all = await getAllConnections({ userId: currentUser.user_id });

        const filtered = (all || connections).filter(
          (c) => c.connection_status === "CLOSE_CONNECTION"
        );

        if (!isCancelled) setFilteredConnections(filtered);
      } catch (err) {
        console.error("Error fetching close circle data:", err);
        if (!isCancelled) {
          // Fallback: just use local store connections with CLOSE
          setFilteredConnections(
            connections.filter(
              (c) => c.connection_status?.toLowerCase() === "CLOSE_CONNECTION"
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

  // Use filtered connections instead of all connections
  const outerProfiles = filteredConnections.slice(0, 3);
  const innerProfiles = filteredConnections.slice(
    3,
    filteredConnections.length - 1
  );

  //Functions
  const handleChatPress = async () => {
    await resolveChatAndNavigate({ currentUser, targetUser: selectedProfile });
  };

  const handleSharePress = () => {
    Share.share({
      message: `Hey see my VBC card here ${selectedProfile?.full_name}`,
    });
  };

  const handleBlockPress = () => {
    setBlockModal(true);
    setSelectedUser(selectedProfile);
  };

  const handleBagPress = () => {
    setSelectedUser(selectedProfile);
    setAddModal(true);
  };

  const handlePitchPress = () => {
    router.push("/pitch");
  };

  const handleViewAll = () => {
    router.push("/HubbleCircleViewAll");
  };

  const handleAvatarPress = (profile: UserProfile) => {
    setSelectedProfile(profile);
  };

  //Function
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
            source={{
              uri:
                avatar.profile_picture_url ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRooEnD32-UtBw55GBfDTxxUZApMhWWnRaoLw&s",
            }}
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

  // Show loading state while fetching data
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading close circle...</Text>
      </View>
    );
  }

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

      {/* Show message if no high-score connections */}
      {filteredConnections.length === 0 && (
        <View style={styles.noConnectionsContainer}>
          <Text style={styles.noConnectionsText}>
            No close circle connections found
          </Text>
        </View>
      )}

      {selectedProfile && (
        <ProfileCardVertical
          modalVisible={true}
          onClose={() => setSelectedProfile(null)}
          selectedProfile={selectedProfile}
          onPressChat={handleChatPress}
          onPressShare={handleSharePress}
          onPressBlock={handleBlockPress}
          onPressBag={handleBagPress}
          onPressPitch={handlePitchPress}
        />
      )}

      <BlockUserModal
        visible={blockModal}
        userName={selectedUser?.full_name}
        onClose={() => setBlockModal(false)}
        onSubmit={(reason) => {
          console.log("Blocked with reason:", reason);
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
