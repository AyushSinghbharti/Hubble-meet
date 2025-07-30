import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Linking,
  Alert,
} from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import AlertModal from '../Alerts/AlertModal';
import { useConnectionStore } from '@/src/store/connectionStore';
import { useAuthStore } from '@/src/store/auth';
import { resolveChatAndNavigate } from '@/src/utility/resolveChatAndNavigate';

const INVITE_LINK = `http://com.hubblemeet/`;

const ShareModal = ({ visible, onClose, cardProfile }) => {
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [requestSentVisible, setRequestSentVisible] = useState(false);
  const connections = useConnectionStore((state) => state.connections);
  const user = useAuthStore((s) => s.user);

  const handleUserSelect = (user) => {
    const exists = selectedUsers.some((u) => u.user_id === user.user_id);
    if (exists) {
      setSelectedUsers(selectedUsers.filter((u) => u.user_id !== user.user_id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSend = async () => {
    if (selectedUsers.length === 0) return;

    for (const target of selectedUsers) {
      await resolveChatAndNavigate({
        initialMessage: `This is a VBC Card of ${cardProfile.full_name}`,
        messageType: 'VCARD',
        currentUser: user,
        targetUser: target,
        isRoutingEnable: false,
        vbcData: {
          id: cardProfile?.user_id,
          DisplayName: cardProfile?.full_name,
          Title: cardProfile?.job_title,
          CompanyName: cardProfile?.current_company?.[0] || "",
          Location: cardProfile?.city,
          IsDeleted: cardProfile.is_active,
          AllowSharing: cardProfile?.allow_vbc_sharing,
        }
      });
    }

    setRequestSentVisible(true);
    setSelectedUsers([]);
    onClose();
  };


  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(INVITE_LINK)}/${user.user_id}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open WhatsApp');
    });
  };

  const handleEmailShare = () => {
    const subject = 'Check this out!';
    const body = `Hey! Check this amazing app: ${INVITE_LINK}/${user.user_id}`;
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(emailUrl).catch(() => {
      Alert.alert('Error', 'Unable to open email app');
    });
  };

  const filteredUsers = useMemo(() => {
    return connections?.filter(
      (u) =>
        u.connection_status !== "BLOCKED" &&
        u.full_name?.toLowerCase().includes(search.toLowerCase())
    ) || [];
  }, [search, connections]);


  const renderItem = ({ item }) => {
    const isSelected = selectedUsers.some((u) => u.user_id === item.user_id);
    return (
      <TouchableOpacity
        style={styles.userColumn}
        onPress={() => handleUserSelect(item)}
      >
        <Image source={{ uri: item.profile_picture_url || "https://xsgames.co/randomusers/assets/images/favicon.png" }} style={styles.avatar} />
        <Text style={styles.name}>{item.full_name}</Text>
        {isSelected && (
          <View style={styles.selectedTick}>
            <AntDesign name="checkcircle" size={18} color="#007AFF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalWrap}
        >
          <Pressable style={styles.overlay} onPress={onClose} />

          <View style={styles.modalContainer}>
            <View style={styles.handleBar} />
            <TextInput
              placeholder="Search users..."
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#888"
            />

            <Text style={styles.title}>Share with</Text>
            <FlatList
              data={filteredUsers}
              keyExtractor={(item) => item.user_id}
              renderItem={renderItem}
              numColumns={4}
              contentContainerStyle={styles.flatListContent}
              columnWrapperStyle={styles.row}
              keyboardShouldPersistTaps="handled"
            />

            <View style={styles.externalRow}>
              <TouchableOpacity style={[styles.externalShareButton, { borderColor: '#25D366' }]} onPress={handleWhatsAppShare}>
                <Feather name="send" size={20} color="#25D366" />
                <Text style={[styles.externalShareText, { color: '#25D366' }]}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.externalShareButton, { borderColor: '#007AFF' }]} onPress={handleEmailShare}>
                <Feather name="mail" size={20} color="#007AFF" />
                <Text style={[styles.externalShareText, { color: '#007AFF' }]}>Email</Text>
              </TouchableOpacity>
            </View>

            {selectedUsers.length > 0 && (
              <TouchableOpacity style={styles.sendBar} onPress={handleSend}>
                <Text style={styles.sendText}>Send</Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <AlertModal
        visible={requestSentVisible}
        onClose={() => setRequestSentVisible(false)}
        imageSource={require('../../../assets/icons/tick1.png')}
        label="Profile Shared"
        onButtonPress={() => setRequestSentVisible(false)}
        positionBottom
      />
    </>
  );
};

export default ShareModal;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalWrap: { flex: 1, justifyContent: 'flex-end' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: height * 0.5,
    padding: 20,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 12,
  },
  searchInput: {
    borderColor: '#eee',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  flatListContent: { paddingBottom: 20 },
  row: { justifyContent: 'space-around', marginBottom: 20 },
  userColumn: {
    alignItems: 'center',
    width: width / 4 - 20,
    marginHorizontal: 5,
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: '#ccc',
    marginBottom: 5,
  },
  name: { fontSize: 12, textAlign: 'center' },
  selectedTick: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  externalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  externalShareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#E6F3FF',
    borderRadius: 10,
    borderWidth: 1,
  },
  externalShareText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
  },
  sendBar: {
    marginTop: 15,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  sendText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});