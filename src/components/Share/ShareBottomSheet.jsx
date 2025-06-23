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
} from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import AlertModal from '../Alerts/AlertModal';


const USERS = [
  { id: '1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Charlie', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'Diana', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: '5', name: 'Eve', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '6', name: 'Frank', avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: '7', name: 'Grace', avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: '8', name: 'Heidi', avatar: 'https://i.pravatar.cc/150?img=8' },
];

const ShareModal = ({ visible, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [requestSentVisible, setRequestSentVisible] = useState(false);

  const handleUserSelect = (user) => {
    const exists = selectedUsers.some((u) => u.id === user.id);
    if (exists) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSend = () => {
    if (selectedUsers.length === 0) return;
    setRequestSentVisible(true);
    setSelectedUsers([]);
    onClose();
  };

  const handleWhatsAppShare = () => {
    const url = `whatsapp://send?text=${encodeURIComponent(
      'Check this out! https://example.com'
    )}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert('WhatsApp not installed');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('WhatsApp error', err));
  };

  const filteredUsers = useMemo(() => {
    return USERS.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const renderItem = ({ item }) => {
    const isSelected = selectedUsers.some((u) => u.id === item.id);
    return (
      <TouchableOpacity
        style={styles.userColumn}
        onPress={() => handleUserSelect(item)}
      >
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{item.name}</Text>
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
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              numColumns={4}
              contentContainerStyle={styles.flatListContent}
              columnWrapperStyle={styles.row}
              keyboardShouldPersistTaps="handled"
            />

            <TouchableOpacity style={styles.externalShareButton} onPress={handleWhatsAppShare}>
              <Feather name="send" size={20} color="#25D366" />
              <Text style={styles.externalShareText}>Share on WhatsApp</Text>
            </TouchableOpacity>

            {selectedUsers.length > 0 && (
              <TouchableOpacity style={styles.sendBar} onPress={handleSend}>
                <Text style={styles.sendText}>Send</Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Custom Alert Modal */}
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
  modalWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: height * 0.8,
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
  flatListContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-around',
    marginBottom: 20,
  },
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
  name: {
    fontSize: 12,
    textAlign: 'center',
  },
  selectedTick: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  externalShareButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#E6F3FF',
    borderRadius: 10,
    marginTop: 10,
  },
  externalShareText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#25D366',
  },
  sendBar: {
    marginTop: 15,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
