import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
import NavHeader from '../../../components/NavHeader';
import SettingsCard from '../../../components/Cards/SettingsCard';
import { useRouter } from 'expo-router';

const Setting = () => {
          const router = useRouter();
  return (
    <View style={styles.container}>
      <NavHeader title="Setting" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Section 1 */}
        <Text style={styles.sectionTitle}>MY DETAILS</Text>
        <SettingsCard
          items={[
            { label: 'Profile', onPress: () => router.push('/Profile1') },
            { label: 'Account', onPress: () => router.push('/Account'), showArrow: true },
          ]}
        />

        {/* Section 2 */}
        <Text style={styles.sectionTitle}>OTHER SETTINGS</Text>
        <SettingsCard
          items={[
            { label: 'Permissions', onPress: () => router.push('/Permissions') },
            { label: 'Notifications', onPress: () => router.push('/Notifications'), showArrow: true },
          ]}
        />

        {/* Section 3 */}
        <Text style={styles.sectionTitle}>LEGAL</Text>
        <SettingsCard
          items={[
            { label: 'Security & Privacy', onPress: () => router.push('/SecurityandPrivacy') },
            { label: 'Support & Help', onPress: () => router.push('/SupportHelp'), showArrow: true },
            {
              label: 'Logout account',
              onPress: () => router.push('/Logoutaccount'),
              showArrow: false,
              color: 'red',
            },
          ]}
        />
      </ScrollView>
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
});
