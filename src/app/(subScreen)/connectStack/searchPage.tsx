import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import VbcCard from "@/src/components/VbcCard";
import { useSearchUser } from "@/src/hooks/useConnection";
import { useQueries } from "@tanstack/react-query";
import { fetchUserProfile } from "@/src/api/profile";
import { UserProfile } from "@/src/interfaces/profileInterface";
import { useLocalSearchParams } from "expo-router";
import { useConnectionStore } from "@/src/store/connectionStore";

const SearchScreen = () => {
  const { query } = useLocalSearchParams<{ query?: string }>();
  const [searchText, setSearchText] = useState(query || "");
  const [submittedText, setSubmittedText] = useState(query || "");
  const connections = useConnectionStore((s) => s.connections);

  useEffect(() => {
    if (query) {
      setSearchText(query);
      setSubmittedText(query);
    }
  }, [query]);

  const { data: searchResults, isLoading: searching } = useSearchUser({
    searchText: submittedText,
    currentPage: 1,
    PageSize: 100,
  });

  const userIds = searchResults?.data?.map((u) => u.user_id) || [];

  const queries = useQueries({
    queries: userIds.map((userId) => ({
      queryKey: ["user-profile", userId],
      queryFn: () => fetchUserProfile(userId),
      enabled: !!userId,
    })),
  });

  const connectedUserIds = connections.map((conn) => conn.user_id);
  const profiles: (UserProfile & { isConnected: boolean })[] = queries
    .map((q) => q.data)
    .filter((profile): profile is UserProfile => !!profile)
    .map((profile) => ({
      ...profile,
      isConnected: connectedUserIds.includes(profile.user_id),
    }));

  return (
    <View style={styles.container}>
      <View style={styles.searchBarWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search profiles..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          onSubmitEditing={() => setSubmittedText(searchText)}
        />
        <TouchableOpacity onPress={() => setSubmittedText(searchText)}>
          <Feather
            name="search"
            size={20}
            color="#555"
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>

      {(searching || queries.some((q) => q.isLoading)) && (
        <ActivityIndicator
          size="large"
          color="#6C63FF"
          style={{ marginTop: 20 }}
        />
      )}

      {/* Use FlatList inside VbcCard for proper scrolling */}
      <View style={{ flex: 1 }}>
        <VbcCard profiles={profiles} spacing={20} />
      </View>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9ff",
    paddingTop: 60,
    paddingHorizontal: 12,
  },
  searchBarWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  searchIcon: {
    marginLeft: 10,
  },
});
