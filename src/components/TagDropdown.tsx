import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';

type TagDropdownProps = {
  options: string[];
  selected: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
};

export default function TagDropdown({
  options,
  selected,
  onChange,
  placeholder = 'Add',
}: TagDropdownProps) {
  const [input, setInput] = useState('');
  const [inputLayout, setInputLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const containerRef = useRef<View>(null);

  const handleAddTag = (tag: string) => {
    if (!selected.includes(tag)) {
      onChange([...selected, tag]);
    }
    setInput('');
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
        style={styles.container}
        onLayout={onLayoutInput}
        ref={containerRef}
      >
        <View style={styles.tagRow}>
          {selected.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
              <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                <Text style={styles.remove}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={placeholder}
            style={styles.input}
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
              position: 'absolute',
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
    borderWidth: 1,
    borderColor: '#cfd4dc',
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B2CD82',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#000',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  remove: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    minWidth: 60,
    padding: 4,
    fontSize: 16,
    flexGrow: 1,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
  },
  dropdownItem: {
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
});
