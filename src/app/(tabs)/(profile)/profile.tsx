import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, Entypo, Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
// Install if missing: expo install expo-app-loading
import InviteModal from '../../../components/Modal/InviteModal';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();


  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
        <TouchableOpacity onPress={() => router.push('(profile)/Setting')}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Profile Picture (old style) */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>Robin Gupta</Text>
        <Text style={styles.subtitle}>Head of Product at Amazon</Text>
      </View>

      {/* Profile Card */}
      <View style={[styles.card, styles.profileCard]}>
        <View style={styles.profileRow}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.profileImageSmall}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>Robin Gupta</Text>
            <Text style={styles.subtitle}>Head of Product at Amazon</Text>
            <Text style={styles.location}>Bengaluru, India</Text>
          </View>
          <Ionicons name="volume-high-outline" size={24} color="#000" />
        </View>

        <TouchableOpacity style={styles.shareIcon}>
          <Entypo name="share" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Expand Hubble Circle */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Expand your Hubble Circle</Text>
        <Text style={styles.cardText}>
          Invite friends and peers to join HubbleMeet and grow the community
        </Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.inviteButton}
        >
          <Text style={styles.inviteButtonText}>Invite to Hubblemeet</Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>About</Text>
        <Text style={styles.cardText}>
          I am a passionate and details oriented Product designer with a strong
          focus on creating user - centric designs that enhances usability and
          deliver seamless digital experiences
        </Text>
      </View>

      {/* Contact Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contact</Text>

        <View style={styles.contactRow}>
          <Ionicons name="mail-outline" size={20} color="#7D7D7D" style={{ marginRight: 8 }} />
          <View>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactEmail}>user.work@gmail.com</Text>
          </View>
        </View>

        <View style={styles.contactRow}>
          <Feather name="phone" size={20} color="#7D7D7D" style={{ marginRight: 8, marginTop: 12 }} />
          <View>
            <Text style={styles.contactLabel}>Mobile</Text>
            <Text style={styles.contactEmail}>+91 1234567890</Text>
          </View>
        </View>
      </View>

      {/* Invite Modal */}
      <InviteModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F8F8',
    flex: 1,
    padding: 16,
  },
  header: {
    marginTop: 24,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'InterBold',
  },
  // Profile Picture block (classic)
  profileContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#B2CD82',
  },
  name: {
    fontSize: 18,
    fontFamily: 'InterBold',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#7D7D7D',
    marginTop: 4,
  },

  // Profile Card
  profileCard: {
    backgroundColor: '#FFE07B',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    position: 'relative',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileImageSmall: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  location: {
    fontSize: 12,
    color: '#7D7D7D',
    fontFamily: 'Inter',
    marginTop: 2,
  },
  shareIcon: {
    position: 'absolute',
    bottom: 12,
    left: 16,
  },

  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'InterBold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#444',
    fontFamily: 'Inter',
    marginBottom: 12,
  },
  inviteButton: {
    backgroundColor: '#B2CD82',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  inviteButtonText: {
    color: '#fff',
    fontFamily: 'InterBold',
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  contactLabel: {
    fontSize: 12,
    color: '#777',
    fontFamily: 'SpaceMono',
  },
  contactEmail: {
    fontSize: 14,
    fontFamily: 'InterBold',
  },
});
