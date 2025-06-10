import React from "react";
import {
  Modal,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
} from "react-native";
import countryData from "../dummyData/countryData";

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
  position: { x: number; y: number };
};

const SelectCountryModal: React.FC<SelectCountryModalProps> = ({
  visible,
  onClose,
  onSelect,
  position,
}) => {
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
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View
          style={[
            styles.modalContainer,
            { top: position?.y + 40, left: position.x - 10, position: "absolute" },
          ]}
        >
          <FlatList
            data={countryData}
            keyExtractor={(item) => item.code}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            style={{ maxHeight: 300 }}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  modalContainer: {
    width: "92%",
    maxHeight: 350,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 999,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  flag: {
    width: 32,
    height: 24,
    marginRight: 12,
    borderRadius: 4,
  },
  name: {
    fontSize: 16,
  },
  closeBtn: {
    marginTop: 10,
    alignSelf: "center",
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  closeText: {
    fontSize: 16,
    color: "#333",
  },
});

export default SelectCountryModal;
