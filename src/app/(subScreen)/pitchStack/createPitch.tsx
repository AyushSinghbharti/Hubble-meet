import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  Entypo,
  FontAwesome,
} from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

export default function CreatePitch() {
  const [duration, setDuration] = useState<number>(30);
  const [pitchType, setPitchType] = useState("Business");
  const [format, setFormat] = useState("Upload");
  const [name, setName] = useState<string>();
  const [desc, setDesc] = useState<string>();
  const [error, setError] = useState<string>();
  const router = useRouter();

  const handleRoutes = () => {
    if (!name || !desc) {
      setError("Please fill all Fields");
      return;
    }

    if (format === "Upload") {
      router.push({
        pathname: "/pitchStack/uploadPitch",
        params: {
          item: JSON.stringify({ name, desc, format, pitchType, duration, videoUrl: null }),
        },
      });
    } else {
      router.push({
        pathname: "/pitchStack/recordPitch",
        params: {
          item: JSON.stringify({ name, desc, format, pitchType, duration, videoUrl: null }),
        },
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 20,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>My Pitch</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Pitch Duration */}
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <View style={styles.rowNoGap}>
            <Image
              source={require("../../../../assets/icons/timer.png")}
              style={styles.icon}
            />
            <Text style={styles.label}>Pitch duration.</Text>
          </View>

          {/* green chip */}
          <TouchableOpacity style={styles.durationButton}>
            <Text style={styles.selectedText}>{duration} Seconds</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pitch Type */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Image
            source={require("../../../../assets/icons/refresh.png")}
            style={styles.icon}
          />
          <Text style={styles.label}>Pitch type</Text>
        </View>
        <View style={styles.toggleGroup}>
          <TouchableOpacity
            onPress={() => setPitchType("Individual")}
            style={[
              styles.toggleButton,
              pitchType === "Individual" && styles.activeToggle,
            ]}
          >
            <Text
              style={
                pitchType === "Individual"
                  ? styles.activeText
                  : styles.toggleText
              }
            >
              Individual
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPitchType("Business")}
            style={[
              styles.toggleButton,
              pitchType === "Business" && styles.activeToggle,
            ]}
          >
            <Text
              style={
                pitchType === "Business" ? styles.activeText : styles.toggleText
              }
            >
              Business
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pitch Format */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Image
            source={require("../../../../assets/icons/format.png")}
            style={styles.icon}
          />
          <Text style={styles.label}>Pitch Format</Text>
        </View>
        <View style={styles.toggleGroup}>
          <TouchableOpacity
            onPress={() => setFormat("Record")}
            style={[
              styles.toggleButton,
              format === "Record" && styles.activeToggle,
            ]}
          >
            <Image
              source={require("../../../../assets/icons/record.png")}
              style={[
                styles.icon,
                { tintColor: format === "Record" ? "#fff" : "#000" },
              ]}
            />
            <Text
              style={
                format === "Record" ? styles.activeText : styles.toggleText
              }
            >
              Record
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFormat("Upload")}
            style={[
              styles.toggleButton,
              format === "Upload" && styles.activeToggle,
            ]}
          >
            <Image
              source={require("../../../../assets/icons/upload.png")}
              style={[
                styles.icon,
                { tintColor: format === "Upload" ? "#fff" : "#000" },
              ]}
            />
            <Text
              style={
                format === "Upload" ? styles.activeText : styles.toggleText
              }
            >
              Upload
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Name and Description */}
      <View style={styles.inputBox}>
        <TextInput
          placeholder="Display name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <View style={{ borderBottomWidth: 1, borderColor: "#DEDEE0" }}></View>
        <TextInput
          placeholder="Pitch caption"
          value={desc}
          onChangeText={setDesc}
          style={styles.input}
          multiline
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      {/* Proceed Button */}
      <TouchableOpacity style={[styles.proceedButton]} onPress={handleRoutes}>
        <Text style={styles.proceedText}>Proceed</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "InterBold",
    color: "#000",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#5C5C6533",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowNoGap: {
    flexDirection: "row",
    alignItems: "center",
  },

  /* pitch‑duration chip */
  durationButton: {
    backgroundColor: "#596c2d",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 140,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    height: 22,
    width: 22,
  },
  label: {
    marginLeft: 8,
    fontFamily: "InterSemiBold",
    color: "#57616B",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: "InterBold",
  },
  toggleGroup: {
    flexDirection: "row",
    backgroundColor: "#eaf0db",
    borderRadius: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  activeToggle: {
    backgroundColor: "#596c2d",
    borderWidth: 2,
    borderColor: "#fff",
  },
  toggleText: {
    color: "#4D5D2A",
    fontWeight: "500",
  },
  activeText: {
    color: "#fff",
    fontWeight: "600",
  },
  inputBox: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DEDEE0",
    marginBottom: 24,
    gap: 10,
  },
  input: {
    fontSize: 14,
    fontFamily: "InterSemiBold",
    paddingVertical: 8,
    color: "#111",
  },
  errorText: {
    color: "#EF5350",
    fontFamily: "InterMediumItalic",
    fontSize: 12,
  },
  proceedButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  proceedText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
