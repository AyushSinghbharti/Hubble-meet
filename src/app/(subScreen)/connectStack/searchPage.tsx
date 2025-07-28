import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import VbcCard from "@/src/components/VbcCard";
import { useSearchUser } from "@/src/hooks/useConnection";
import { useQueries } from "@tanstack/react-query";
import { fetchUserProfile } from "@/src/api/profile";
import { UserProfile } from "@/src/interfaces/profileInterface";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useConnectionStore } from "@/src/store/connectionStore";
import debounce from "lodash.debounce";
import { useAuthStore } from "@/src/store/auth";

const SearchScreen = () => {
  const { query } = useLocalSearchParams<{ query?: string }>();
  const [searchText, setSearchText] = useState(query || "");
  const [submittedText, setSubmittedText] = useState(query || "");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const connections = useConnectionStore((s) => s.connections);
  const userId = useAuthStore((s) => s.userId);
  const router = useRouter();

  // Search users based on input
  const { data: searchResults, isLoading: searching } = useSearchUser({
    // userId: userId,
    searchText,
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

  // Debounce input changes
  const debouncedSearch = useCallback(
    debounce((text: string) => {
      setSearchText(text);
    }, 300),
    []
  );

  const handleInputChange = (text: string) => {
    debouncedSearch(text);
    setSubmittedText(text);
    setShowSuggestions(true);
  };

  const handleSuggestionPress = (username: string) => {
    setSearchText(username);
    setSubmittedText(username);
    setShowSuggestions(false);
  };

  return (
    <View style={styles.container}>
      {/* Header with back and search input */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <AntDesign name="left" size={22} color="black" />
        </TouchableOpacity>

        <View style={styles.searchBarWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search profiles..."
            placeholderTextColor="#888"
            defaultValue={searchText}
            onChangeText={handleInputChange}
            returnKeyType="search"
            onSubmitEditing={() => {
              setSubmittedText(searchText);
              setShowSuggestions(false);
            }}
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
      </View>
      {(searching || queries.some((q) => q.isLoading)) && (
        <ActivityIndicator
          size="large"
          color="#6C63FF"
          style={{ marginTop: 20 }}
        />
      )}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  backBtn: {
    padding: 4,
    marginRight: 12,
  },
  searchBarWrapper: {
    flex: 1,
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
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  searchIcon: {
    marginLeft: 10,
  },
  suggestionsContainer: {
    maxHeight: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 8,
    elevation: 2,
    paddingHorizontal: 10,
  },
  suggestionItem: {
    paddingVertical: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },
});
