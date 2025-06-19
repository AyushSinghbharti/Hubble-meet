// import React from "react";
// import { Image } from "expo-image";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { useRouter } from "expo-router";

// const MyPitch = () => {
//   const router = useRouter();
//   return (
//     <View style={styles.container}>
//       <View style={[styles.headerContainer]}>
//         <View></View>
//         <Image
//           source={require("../../../../assets/images/logo.png")}
//           style={{ height: 24, width: 148 }}
//         />
//         <TouchableOpacity
//           onPress={() => router.push("/pitchStack/createPitch")}
//         >
//           <View style={[styles.iconContainer]}>
//             <Image
//               source={require("../../../../assets/icons/pitch2.png")}
//               style={{ height: 24, aspectRatio: 1 }}
//             />
//             <Text style={[styles.headerText]}>My Pitch</Text>
//           </View>
//         </TouchableOpacity>
//       </View>

//       {/* Body */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 18,
//     paddingTop: 32,
//   },
//   headerContainer: {
//     width: "100%",
//     flexDirection: "row",
//     marginTop: 2,
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   iconContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 2,
//   },
//   headerText: {
//     fontSize: 10,
//     color: "#64748B",
//   },
// });

// export default MyPitch;

// MyPitchScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons, Feather, Octicons } from "@expo/vector-icons";

export default function MyPitchScreen() {
  // In case you want to toggle play/pause later
  const [isPaused, setIsPaused] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Pitch</Text>
        {/* Placeholder to keep title centered */}
        <View style={{ width: 24 }} />
      </View>

      {/* Media (image for now, video later) */}
      <View style={styles.mediaWrapper}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
          }}
          style={styles.media}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.playBtn}
          activeOpacity={0.8}
          onPress={() => setIsPaused(!isPaused)}
        >
          <Ionicons
            name={isPaused ? "play" : "pause"}
            size={28}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* Name + company */}
      <View style={styles.card}>
        <Text style={styles.primaryText}>Jhon William</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.secondaryText}>
          Dummy Corp specialises in innovative digital sol…
        </Text>
      </View>

      {/* Meta rows */}
      <View style={[styles.card, styles.metaRow]}>
        <View style={styles.rowLeft}>
          <Octicons name="stopwatch" size={18} color="#FFA800" />
          <Text style={styles.rowLabel}>Pitch duration</Text>
        </View>
        <Text style={styles.rowValue}>30 sec pitch</Text>
      </View>

      <View style={[styles.card, styles.metaRow]}>
        <View style={styles.rowLeft}>
          <Feather name="users" size={18} color="#00C37A" />
          <Text style={styles.rowLabel}>Pitch type</Text>
        </View>
        <Text style={[styles.rowValue, { color: "#00C37A" }]}>Individual</Text>
      </View>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* Upload button */}
      <TouchableOpacity style={styles.actionBtn}>
        <Text style={styles.actionText}>Upload new Pitch</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFB",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  mediaWrapper: {
    width: "100%",
    aspectRatio: 9 / 16, // keeps it vertical‑video friendly
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  media: {
    flex: 1,
  },
  playBtn: {
    position: "absolute",
    top: "45%",
    left: "45%",
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    elevation: 2, // Android shadow
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  primaryText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  secondaryText: {
    fontSize: 14,
    color: "#6D6D74",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rowLabel: {
    fontSize: 14,
    color: "#4B4B4F",
  },
  rowValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  actionBtn: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  actionText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
