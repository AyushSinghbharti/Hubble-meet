import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';

type TagInputProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
};

export default function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = React.useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInput('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tagRow}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
            <TouchableOpacity onPress={() => removeTag(index)}>
              <Text style={styles.remove}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TextInput
          value={input}
          onChangeText={setInput}
          onSubmitEditing={addTag}
          placeholder="Add"
          style={styles.input}
          returnKeyType="done"
          blurOnSubmit={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#cfd4dc',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
    marginTop: 4,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
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
    flex: 1,
  },
});
