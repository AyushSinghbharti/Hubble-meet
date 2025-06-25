import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import colourPalette from "../theme/darkPaletter";

type TagDropdownProps = {
  options: string[];
  selected: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  mode?: "Dark" | "Light" | "Transparent";
};

export default function TagDropdown({
  options,
  selected,
  onChange,
  placeholder = "Add",
  mode = "Light",
}: TagDropdownProps) {
  const [input, setInput] = useState("");
  const [inputLayout, setInputLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const containerRef = useRef<View>(null);

  const handleAddTag = (tag: string) => {
    if (!selected.includes(tag)) {
      onChange([...selected, tag]);
    }
    setInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(selected.filter((tag) => tag !== tagToRemove));
  };

  const filteredOptions = options.filter(
    (option) =>
      option.toLowerCase().includes(input.toLowerCase()) &&
      !selected.includes(option)
  );

  const onLayoutInput = (e: LayoutChangeEvent) => {
    const { x, y, width, height } = e.nativeEvent.layout;
    setInputLayout({ x, y, width, height });
  };

  return (
    <View>
      <View
        style={[
          styles.container,
          {
            backgroundColor:
              mode === "Dark"
                ? colourPalette.inputBackground
                : mode === "Light"
                ? "#fff"
                : "transparent",
            borderWidth: mode && 2,
            borderColor:
              mode === "Dark" || mode === "Light"
                ? colourPalette.inputBorder
                : "#cfd4dc",
          },
        ]}
        onLayout={onLayoutInput}
        ref={containerRef}
      >
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
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={placeholder}
            placeholderTextColor="#aaa"
            style={[
              styles.input,
              {
                color: mode ? colourPalette.textPrimary : "#000",
                fontFamily: "InterMedium",
              },
            ]}
          />
        </View>
      </View>
      {input.length > 0 && filteredOptions.length > 0 && (
        <View
          style={[
            styles.dropdown,
            {
              top: inputLayout.y + inputLayout.height + 4,
              left: inputLayout.x,
              width: inputLayout.width,
              position: "absolute",
              zIndex: 999,
            },
          ]}
        >
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleAddTag(item)}
                style={styles.dropdownItem}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#cfd4dc",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 8,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8, // Adds a gap between tags for better spacing
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B2CD82",
    borderRadius: 16,
    paddingHorizontal: 10, // Reduced padding to give more space for text
    paddingVertical: 4,
    alignSelf: "flex-start",
    // Removed maxWidth: '100%' to allow the tag to expand
  },
  tagText: {
    color: "#000",
    fontStyle: "italic",
    fontWeight: "600",
    flexShrink: 1, // Allows text to shrink if necessary
    // Removed maxWidth: '90%' to allow text to take up more available space
  },
  remove: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 5,
  },
  input: {
    minWidth: 60,
    fontFamily: "InterMedium",
    padding: 4,
    fontSize: 16,
    flexGrow: 1,
    flexShrink: 1,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
  },
  dropdownItem: {
    padding: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
});
