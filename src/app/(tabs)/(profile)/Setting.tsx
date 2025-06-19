import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import NavHeader from '../../../components/NavHeader';
import SettingsCard from '../../../components/Cards/SettingsCard';
import { useRouter } from 'expo-router';

const Setting = () => {
  const router = useRouter();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    // TODO: Add your logout logic here
    console.log('User logged out');
    setLogoutModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <NavHeader title="Setting" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Section 1 */}
        <Text style={styles.sectionTitle}>MY DETAILS</Text>
        <SettingsCard
          items={[
            { label: 'Profile', onPress: () => router.push('/Profile1') },
            {
              label: 'Account',
              onPress: () => router.push('/Account'),
              showArrow: true,
            },
          ]}
        />

        {/* Section 2 */}
        <Text style={styles.sectionTitle}>OTHER SETTINGS</Text>
        <SettingsCard
          items={[
            { label: 'Permissions', onPress: () => router.push('/Permissions') },
            {
              label: 'Notifications',
              onPress: () => router.push('/Notifications'),
              showArrow: true,
            },
          ]}
        />

        {/* Section 3 */}
        <Text style={styles.sectionTitle}>LEGAL</Text>
        <SettingsCard
          items={[
            {
              label: 'Security & Privacy',
              onPress: () => router.push('/SecurityandPrivacy'),
            },
            {
              label: 'Support & Help',
              onPress: () => router.push('/SupportHelp'),
              showArrow: true,
            },
            {
              label: 'Logout account',
              onPress: () => setLogoutModalVisible(true),
              showArrow: false,
              color: 'red',
            },
          ]}
        />
      </ScrollView>

      {/* Logout Modal */}
    <Modal
  transparent
  visible={logoutModalVisible}
  animationType="fade"
  onRequestClose={() => setLogoutModalVisible(false)}
>
  <View style={styles.modalBackground}>
    <View style={styles.modalBox}>
      {/* Close Icon */}
      <Pressable style={styles.closeIcon} onPress={() => setLogoutModalVisible(false)}>
        <Text style={styles.closeText}>×</Text>
      </Pressable>

      {/* Question Mark Icon */}
      <Image     style={styles.logoutImage}       source={require('../../../../assets/icons/logout.png')}/>

      {/* Title */}
      <Text style={styles.modalTitle}>Do You Want To Log Out?</Text>

      {/* Logout Button */}
      <Pressable style={styles.logoutMainButton} onPress={handleLogout}>
        <Text style={styles.logoutMainButtonText}>Yes, Logout</Text>
      </Pressable>
    </View>
  </View>
</Modal>

    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'InterBold',
    color: '#6E812B',
    marginBottom: 8,
    marginTop: 24,
  },
  logoutImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    backgroundColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    backgroundColor: 'red',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
    fontWeight: '600',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
closeIcon: {
  position: 'absolute',
  top: 12,
  right: 12,
  zIndex: 1,
},
closeText: {
  fontSize: 24,
  color: '#000',
},
questionMark: {
  fontSize: 60,
  color: '#F7941D', // Orange color
  marginBottom: 12,
},

logoutMainButton: {
  width: '100%',
  backgroundColor: '#1A1A1A', // Dark color
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: 'center',
},
logoutMainButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},

});
