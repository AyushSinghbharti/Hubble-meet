import React, { useState } from "react";
import {
  View,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import NotificationCard from "../../../components/NotificationCard";
import { useAuthStore } from "@/src/store/auth";
import { useNotificationStore } from "@/src/store/notificationStore";
import { useNotificationHistory } from "@/src/hooks/useNotification";
import ChatCardSkeleton from "@/src/components/skeletons/chatCard";

const PAGE_SIZE = 10;

const NotificationsScreen = () => {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const user = useAuthStore((state) => state.user);
  const { history } = useNotificationStore();

  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, refetch, isRefetching } =
    useNotificationHistory({
      userId: userId || "",
      page,
      size: PAGE_SIZE,
    });

  const handleLoadMore = () => {
    if (!isFetching && data?.notifications?.length >= PAGE_SIZE) {
      setPage((prev) => prev + 1);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    refetch();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Notification</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationCard
            name={item.title}
            status={item.message}
            date={new Date(item.createdAt).toLocaleDateString()}
            image={item?.image || user?.profile_picture_url}
          />
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshing={isRefetching}
        onRefresh={handleRefresh}
        ListFooterComponent={
          isFetching && !isRefetching ? <ChatCardSkeleton /> : null
        }
        ListEmptyComponent={
          !isLoading && !isFetching ? (
            <Text style={styles.emptyText}>
              No notifications found.
            </Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0E0E", // Dark background
    paddingTop: Platform.OS === "ios" ? 10 : 30,
  },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF", // Light title for dark bg
    fontSize: 18,
    fontFamily: "InterBold",
  },
  rightPlaceholder: {
    width: 32,
  },
  emptyText: {
    color: "#999",
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
    fontFamily: "InterRegular",
  },
});
