import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chats</Text>

      {/* Search Bar */}
      <View style={styles.searchBarHolder}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={24}
            color="#94A3B8"
            style={{ marginLeft: 10 }}
          />
          <TextInput
            placeholder="Search Chats"
            placeholderTextColor="#b8b6f6"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} />
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <FlatList
        data={dummyChats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 10 }}
        renderItem={({ item }) => <RenderCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F7F7F7" },
  header: {
    marginTop: 32,
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 8,
  },
  searchBarHolder: {
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dcdff1",
    borderRadius: 30,
    gap: 8,
    backgroundColor: "#fff",
  },
  searchInput: {
    fontFamily: "Inter",
    fontSize: 16,
    color: "#A5B4FC",
  },
  addButton: {
    backgroundColor: "#c5db98",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  chatCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
    borderBottomColor: "#E2E8F0",
    borderBottomWidth: 1,
  },
  leftSection: { flexDirection: "row", alignItems: "center" },
  imageWrapper: {
    marginRight: 12,
    borderWidth: 2,
    borderRadius: 50,
    borderColor: "#F0E5FF",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    backgroundColor: "#5DC72F",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  chatText: {},
  name: {
    fontFamily: "InterBold",
    fontSize: 16,
  },
  message: {
    color: "#8E8E8E",
    fontFamily: "Inter",
    fontSize: 12,
    marginTop: 2,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  time: {
    color: "#8E8E8E",
    fontSize: 12,
    marginBottom: 4,
    fontFamily: "Inter",
  },
  badge: {
    backgroundColor: "#BBCF8D",
    fontFamily: "Inter",
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
