import React, { useState } from "react";
import {
  Modal,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Dimensions,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import countryData from "../dummyData/countryData";
import { BlurView, ExperimentalBlurMethod } from "expo-blur";

type Country = {
  name: string;
  flag: string;
  code: string;
  dial_code: string;
};

type SelectCountryModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: Country) => void;
};

const { width, height } = Dimensions.get("window");

const SelectCountryModal: React.FC<SelectCountryModalProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const [search, setSearch] = useState("");

  const filteredData = countryData.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.dial_code.includes(search)
  );

  const renderItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        onSelect(item);
        onClose();
      }}
    >
      <Image source={{ uri: item.flag }} style={styles.flag} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.code}>{item.dial_code}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <BlurView
        style={{ flex: 1 }}
        experimentalBlurMethod="dimezisBlurView"
        intensity={10}
      >
        <Pressable style={styles.overlay} onPress={onClose}>
          {/* X Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <View style={styles.closeCircle}>
              <Ionicons name="close-outline" size={34} color="black" />
            </View>
          </TouchableOpacity>

          {/* Bottom Modal */}
          <View style={styles.bottomContainer}>
            {/* Search */}
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={24}
                color="#fff"
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Search"
                placeholderTextColor="#FFF"
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
              />
            </View>

            {/* List */}
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.code}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Pressable>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 0,
  },
  closeBtn: {
    alignItems: "center",
    marginBottom: 10,
  },
  closeCircle: {
    width: 50,
    height: 50,
    marginBottom: 10,
    backgroundColor: "#D3F36B",
    borderRadius: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    width: "100%",
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 16,
    maxHeight: height * 0.45,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  flag: {
    width: 28,
    height: 20,
    marginRight: 14,
    borderRadius: 4,
  },
  name: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  code: {
    fontSize: 16,
    color: "#ccc",
  },
});

export default SelectCountryModal;
