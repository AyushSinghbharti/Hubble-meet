import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  LayoutChangeEvent,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import colourPalette from "../theme/darkPaletter";
import { FONT } from "@/assets/constants/fonts";
import { BlurView } from "expo-blur";

type TagDropdownProps = {
  options: string[];
  selected: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  mode?: "Dark" | "Light" | "Transparent";
  isSingleSelection?: boolean;
};

export default function TagDropdown({
  options,
  selected,
  onChange,
  placeholder = "Add",
  mode = "Transparent",
  isSingleSelection = false,
}: TagDropdownProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const handleAddTag = (tag: string) => {
    if (isSingleSelection) {
      onChange([tag]);
    } else {
      if (!selected.includes(tag)) {
        onChange([...selected, tag]);
      }
    }
    setSearchInput("");
    setModalVisible(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(selected.filter((tag) => tag !== tagToRemove));
  };

  const filteredOptions = options
    .filter(
      (option) =>
        option.toLowerCase().includes(searchInput.toLowerCase()) &&
        !selected.includes(option)
    )
    .slice(0, 20);

  const showAddCustomOption =
    searchInput.length > 0 &&
    !options.some(
      (option) => option.toLowerCase() === searchInput.toLowerCase()
    ) &&
    !selected.includes(searchInput);

  const dropdownData = [
    ...(showAddCustomOption ? [`__ADD__${searchInput}`] : []),
    ...filteredOptions,
  ];

  const openModal = () => {
    // For single selection, if an item is already selected, don't show the add button.
    if (isSingleSelection && selected.length > 0) return;
    setModalVisible(true);
    setSearchInput("");
  };

  const closeModal = () => {
    setModalVisible(false);
    setSearchInput("");
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.tagRow}>
          {selected.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text
                style={styles.tagText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {tag}
              </Text>
              <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                <Entypo name="cross" style={styles.remove} />
              </TouchableOpacity>
            </View>
          ))}

          {selected.length === 0 && (
            <TouchableOpacity onPress={openModal} style={styles.addButton}>
              <Text style={styles.addButtonText}>{placeholder}</Text>
              <Entypo name="plus" size={16} color="#B2CD82" />
            </TouchableOpacity>
          )}

          {selected.length > 0 && !isSingleSelection && (
            <TouchableOpacity onPress={openModal} style={styles.shortAddButton}>
              <Entypo name="plus" size={16} color="#B2CD82" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <BlurView
          style={styles.modalOverlay}
          intensity={15}
          experimentalBlurMethod="dimezisBlurView"
          tint="systemChromeMaterialLight"
        >
          <TouchableOpacity style={styles.closeWrapper} onPress={closeModal}>
            <View style={styles.closeButton}>
              <Entypo name="cross" size={24} color="#000" />
            </View>
          </TouchableOpacity>

          <View style={styles.bottomSheet}>
            {/* Search + Options */}
            <View style={styles.searchContainer}>
              <Entypo
                name="magnifying-glass"
                size={20}
                color="#aaa"
                style={styles.searchIcon}
              />
              <TextInput
                value={searchInput}
                onChangeText={setSearchInput}
                placeholder="Search options..."
                placeholderTextColor="#aaa"
                style={styles.searchInput}
                autoFocus
              />
            </View>

            {/* Options List */}
            <View style={styles.optionsContainer}>
              {searchInput.length > 0 && dropdownData.length > 0 ? (
                <FlatList
                  data={dropdownData}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => {
                    const isAddItem = item.startsWith("__ADD__");
                    const tagLabel = isAddItem
                      ? item.replace("__ADD__", "")
                      : item;

                    return (
                      <TouchableOpacity
                        onPress={() => handleAddTag(tagLabel)}
                        style={styles.optionItem}
                      >
                        <Text style={styles.optionText}>
                          {isAddItem ? `Add "${tagLabel}"` : tagLabel}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <FlatList
                  data={options
                    .filter((option) => !selected.includes(option))
                    .slice(0, 50)}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleAddTag(item)}
                      style={styles.optionItem}
                    >
                      <Text style={styles.optionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    padding: 8,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B2CD82",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  tagText: {
    color: "#000",
    fontFamily: FONT.ITALICMEDIUM,
    flexShrink: 1,
  },
  remove: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    paddingLeft: 5,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#B2CD82",
    borderRadius: 25,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  shortAddButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#B2CD82",
    borderRadius: 25,
    padding: 4,
  },
  addButtonText: {
    color: "#B2CD82",
    fontSize: 14,
    fontFamily: "InterMedium",
    marginRight: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  bottomSheet: {
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    maxHeight: "80%",
  },

  closeWrapper: {
    alignItems: "center",
    top: -15,
    zIndex: 10,
  },

  modalContainer: {
    flex: 1,
    verticalAlign: "bottom",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#B2CD82",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3a3a3a",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    fontFamily: "InterMedium",
  },
  optionsContainer: {
    flexGrow: 1,
    minHeight: 100,
    maxHeight: 300, // or adjust to your design
    paddingBottom: 20,
  },
  optionItem: {
    backgroundColor: "#3a3a3a",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 2,
    borderRadius: 8,
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "InterMedium",
  },
});
