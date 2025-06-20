import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Modal,
  Pressable,
  ImageBackground,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CENTER = width / 2;

const outerAvatars = [
  {
    src: require('../../assets/images/p1.jpg'),
    borderColor: '#FF6B6B',
    name: 'Robin Gupta',
    title: 'Design Lead at Amazon',
    location: 'Bengaluru, India',
  },
  {
    src: require('../../assets/images/p1.jpg'),
    borderColor: '#6BCB77',
    name: 'Sanya Mehta',
    title: 'Product Manager at Meta',
    location: 'Mumbai, India',
  },
  {
    src: require('../../assets/images/p1.jpg'),
    borderColor: '#4D96FF',
    name: 'Raj Patel',
    title: 'UX Designer at Flipkart',
    location: 'Delhi, India',
  },
  {
    src: require('../../assets/images/p1.jpg'),
    borderColor: '#FFB703',
    name: 'Aisha Khan',
    title: 'Data Analyst at Google',
    location: 'Hyderabad, India',
  },
];

const innerAvatars = [
  {
    src: require('../../assets/images/p1.jpg'),
    borderColor: '#8338EC',
    name: 'Ankit Sharma',
    title: 'Dev Lead at Swiggy',
    location: 'Pune, India',
  },
  {
    src: require('../../assets/images/p1.jpg'),
    borderColor: '#FB5607',
    name: 'Neha Singh',
    title: 'QA Engineer at Zoho',
    location: 'Chennai, India',
  },
  {
    src: require('../../assets/images/p1.jpg'),
    borderColor: '#3A86FF',
    name: 'Aman Verma',
    title: 'Mobile Dev at Zomato',
    location: 'Indore, India',
  },
  {
    src: require('../../assets/images/p1.jpg'),
    borderColor: '#FF006E',
    name: 'Priya Desai',
    title: 'HR at Paytm',
    location: 'Ahmedabad, India',
  },
  {
    src: require('../../assets/images/p1.jpg'),
    borderColor: '#06D6A0',
    name: 'Kunal Rao',
    title: 'Analyst at Ola',
    location: 'Jaipur, India',
  },
];

const ProfileOrbit = () => {
  const router = useRouter();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleViewAll = () => {
    router.push('/HubbleCircleViewAll');
  };

  const handleAvatarPress = (profile) => {
    setSelectedProfile(profile);
    setModalVisible(true);
  };

  const renderOrbitAvatars = (radius, avatars) =>
    avatars.map((avatar, index) => {
      const angle = (2 * Math.PI * index) / avatars.length;
      const x = CENTER + radius * Math.cos(angle) - 25;
      const y = CENTER + radius * Math.sin(angle) - 25;

      return (
        <TouchableOpacity
          key={index}
          onPress={() => handleAvatarPress(avatar)}
          activeOpacity={0.8}
          style={[styles.avatarWrapper, { left: x, top: y }]}
        >
          <Image
            source={avatar.src}
            style={[styles.avatar, { borderColor: avatar.borderColor }]}
          />
        </TouchableOpacity>
      );
    });

  return (
    <View style={styles.container}>
      {/* Orbit Gradients */}
      <LinearGradient
        colors={['#fff', '#B3C778']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.1, y: 3 }}
        style={[styles.gradientCircle, styles.outerGradient]}
      >
        <View style={styles.dashedBorderOuter} />
      </LinearGradient>

      <LinearGradient
        colors={['#B3C778', '#FFFFFF']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.gradientCircle, styles.innerGradient]}
      >
        <View style={styles.dashedBorderInner} />
      </LinearGradient>

      {/* Orbit Avatars */}
      {renderOrbitAvatars(165, outerAvatars)}
      {renderOrbitAvatars(115, innerAvatars)}

      {/* Center Avatar */}
      <Image
        source={require('../../assets/images/p1.jpg')}
        style={[styles.centerAvatar, { left: CENTER - 50, top: CENTER - 50 }]}
      />

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleViewAll}>
        <Text style={styles.buttonText}>View All</Text>
      </TouchableOpacity>


      {selectedProfile && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.overlay}>
            <View style={styles.modalBox}>
              <ImageBackground
                borderRadius={10}
                source={selectedProfile.src}
                style={styles.modalImage}
              >
                <View style={styles.modalTopIcons}>
                  <Ionicons name="chatbubble-ellipses" size={24} color="#4CAF50" />
                  <Ionicons name="chatbubble-ellipses" size={24} color="#4CAF50" />
                </View>
                <View style={[styles.profileDetails, { backgroundColor: selectedProfile.borderColor }]}>
                  <Text style={styles.name}>{selectedProfile.name}</Text>
                  <Text style={styles.title}>{selectedProfile.title}</Text>
                  <Text style={styles.location}>{selectedProfile.location}</Text>
                  <View style={styles.iconRow}>
                    <View style={styles.iconCircle}>
                      <Ionicons name="chatbubble-ellipses" size={24} color="#4CAF50" />
                    </View>
                    <View style={styles.iconCircle}>
                      <MaterialCommunityIcons name="share-variant" size={24} color="#4CAF50" />
                    </View>
                    <View style={styles.iconCircle}>
                      <Ionicons name="person" size={24} color="#4CAF50" />
                    </View>
                  </View>
                </View>
              </ImageBackground>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Entypo size={24} color={"#fff"} name="cross" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default ProfileOrbit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 30,
    right: 15,
  },
  gradientCircle: {
    position: 'absolute',
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderColor: '#a8d69f',
    borderStyle: 'dashed',
    position: 'absolute',
  },
  dashedBorderInner: {
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 2,
    borderColor: '#a8d69f',
    borderStyle: 'dashed',
    position: 'absolute',
  },
  avatarWrapper: {
    position: 'absolute',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    backgroundColor: '#fff',
  },
  centerAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'absolute',
    zIndex: 2,
    borderWidth: 2,
    borderColor: '#fff',
  },
  button: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: '#d1e9c6',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#b0d6a1',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  overlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    borderRadius: 20,
    width: "90%",
    alignItems: "center",
    marginTop: 40,
  },
  modalImage: {
    width: "100%",
    height: "80%",
    borderRadius: 20,
    marginBottom:Platform.OS === "ios" ? 10:55,
  },
  modalTopIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  profileDetails: {
    marginTop: 370,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  title: {
    fontSize: 16,
    color: "#444",
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FEF9C3",
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtn: {
    backgroundColor: "#333",
    width: 40,
    height: 40,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    top:Platform.OS === "ios" ? 110:55,
    alignSelf: "center",
  },
});
