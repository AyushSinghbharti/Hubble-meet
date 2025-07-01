import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";
import { FONT } from "../../../assets/constants/fonts";

interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  onButtonPress: () => void;
  label: string;
  imageSource: ImageSourcePropType;
  positionTop?: boolean;
  positionBottom?: boolean;
  viewButton?: boolean;
  buttonText?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  onClose,
  label,
  imageSource,
  positionTop = false,
  positionBottom = false,
  viewButton = false,
  buttonText,
  onButtonPress
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  let positionStyle = {};
  if (positionTop) {
    positionStyle = { justifyContent: "flex-start", paddingTop: 45 };
  } else if (positionBottom) {
    positionStyle = { justifyContent: "flex-end", paddingBottom: 100 };
  } else {
    positionStyle = { justifyContent: "center" };
  }

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, positionStyle]}>
        <View style={styles.modalBox}>
          <View style={styles.contentRow}>
            <Image
              source={imageSource}
              style={styles.iconImage}
              resizeMode="contain"
            />
            <Text style={styles.labelText}>{label}</Text>
          </View>

          {viewButton && (
            <Text
              onPress={onButtonPress}
              style={{
                paddingHorizontal: 8,
                backgroundColor: "#EEEEEE",
                paddingVertical: 4,
                marginRight: 6,
                borderRadius: 10,
                fontFamily: FONT.MEDIUM,
              }}
            >
              {buttonText}
            </Text>
          )}
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
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 4,
    alignItems: "center",
    padding: 6,
    paddingLeft: 8,
    borderLeftWidth: 5,
    borderLeftColor: "#F87171",
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
