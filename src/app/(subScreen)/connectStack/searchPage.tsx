import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import VbcCard from "@/src/components/VbcCard";
import { useSearchUser } from "@/src/hooks/useConnection";
import debounce from "lodash.debounce";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthStore } from "@/src/store/auth";
import { useConnectionStore } from "@/src/store/connectionStore";

const PAGE_SIZE = 10;

const SearchScreen = () => {
  const { query } = useLocalSearchParams<{ query?: string }>();
  const [searchText, setSearchText] = useState(query || "");
  const [submittedText, setSubmittedText] = useState(query || "");
  const [profiles, setProfiles] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const userId = useAuthStore((s) => s.userId);
  const connections = useConnectionStore((s) => s.connections);
  const router = useRouter();

  const {
    data: searchResults,
    isLoading,
    isFetching,
  } = useSearchUser({
    userId,
    searchText,
    currentPage: page,
    PageSize: PAGE_SIZE,
  });

  // Merge and deduplicate profiles
  useEffect(() => {
    if (!searchResults?.data) return;
    const connectedUserIds = connections.map((c) => c.user_id);

    const enriched = searchResults.data.map((u) => ({
      ...u,
      isConnected: connectedUserIds.includes(u.user_id),
    }));

    setProfiles((prev) => {
      const existingIds = new Set(prev.map((p) => p.user_id));
      const merged = [...prev];
      enriched.forEach((item) => {
        if (!existingIds.has(item.user_id)) merged.push(item);
      });
      return merged;
    });

    setHasMore(enriched.length === PAGE_SIZE);
  }, [searchResults]);

  // Reset pagination when search text changes
  useEffect(() => {
    setProfiles([]);
    setPage(1);
    setHasMore(true);
  }, [searchText]);

  const loadMore = () => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const debouncedSearch = useCallback(
    debounce((text: string) => {
      setSearchText(text);
    }, 300),
    []
  );

  const handleInputChange = (text: string) => {
    debouncedSearch(text);
    setSubmittedText(text);
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
            value={submittedText}
            onChangeText={handleInputChange}
            returnKeyType="search"
            onSubmitEditing={() => setSearchText(submittedText)}
          />
          <TouchableOpacity onPress={() => setSearchText(submittedText)}>
            <Feather
              name="search"
              size={20}
              color="#555"
              style={styles.searchIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading && page === 1 ? (
        <ActivityIndicator
          size="large"
          color="#6C63FF"
          style={{ marginTop: 20 }}
        />
      ) : profiles.length > 0 ? (
        <VbcCard
          profiles={profiles}
          spacing={20}
          onEndReached={loadMore}
          isLoadingMore={isFetching && page > 1}
        />
      ) : (
        <Text style={{ textAlign: "center", marginTop: 40, color: "#999" }}>
          No profiles found.
        </Text>
      )}
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
});
