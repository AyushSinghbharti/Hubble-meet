// screens/NotificationsScreen.tsx
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
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
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
        contentContainerStyle={{ padding: 16 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshing={isRefetching}
        onRefresh={handleRefresh}
        ListFooterComponent={
          isFetching && !isRefetching ? <ChatCardSkeleton /> : null
        }
        ListEmptyComponent={
          !isLoading && !isFetching ? (
            <Text style={{ textAlign: "center", marginTop: 40 }}>
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
    backgroundColor: "#f9fafb",
    paddingTop: Platform.OS === "ios" ? 10 : 30,
  },
  backButton: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    color: "#000",
    fontSize: 18,
    fontFamily: "InterBold",
  },
  rightPlaceholder: {
    width: 32,
  },
});
