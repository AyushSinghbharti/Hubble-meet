import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";

interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  label: string;
  imageSource: ImageSourcePropType;
  positionTop?: boolean;
  positionBottom?: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  onClose,
  label,
  imageSource,
  positionTop = false,
  positionBottom = false,
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  let positionStyle = {};
  if (positionTop) {
    positionStyle = { justifyContent: "flex-start", paddingTop: 60 };
  } else if (positionBottom) {
    positionStyle = { justifyContent: "flex-end", paddingBottom: 100 };
  } else {
    positionStyle = { justifyContent: "center" };
  }

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={[styles.overlay, positionStyle]}>
        <View style={styles.modalBox}>
          <View style={styles.contentRow}>
            <Image source={imageSource} style={styles.iconImage} resizeMode="contain" />
            <Text style={styles.labelText}>{label}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000066",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalBox: {
    width: "55%",
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    padding: 6,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconImage: {
    width: 36,
    height: 36,
    marginRight: 12,
  },
  labelText: {
    fontSize: 16,
    color: "#1F2937",
    flexShrink: 1,
  },
});
