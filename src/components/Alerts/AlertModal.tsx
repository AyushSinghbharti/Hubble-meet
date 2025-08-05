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
  name?: string;
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
  name,
  onButtonPress,
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 1000);
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
          {/* Left Side: icon + label + name (in same row) */}
          <View style={styles.leftRow}>
            <Image
              source={imageSource}
              style={styles.iconImage}
              resizeMode="contain"
            />
            <Text style={[styles.labelText, { color: "#C0C0C0" }]}>{label}</Text>

            {name ? (
              <>

                <Text style={styles.nameText}>{name}</Text>
                <Text style={styles.separator}>|</Text>
              </>
            ) : null}
          </View>

          {/* Right Side: optional button */}
          {viewButton && (
            <Text onPress={onButtonPress} style={styles.actionText}>
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
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2D2D2D",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderLeftWidth: 5,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    flex: 1,
    flexWrap: "nowrap",
  },
  iconImage: {
    width: 36,
    height: 36,
    marginRight: 8,
  },
  labelText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: FONT.MEDIUM,
    marginRight: 6,
  },
  separator: {
    fontSize: 16,
    color: "#C0C0C0",

  },
  nameText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: FONT.MEDIUM,
    flexShrink: 1,
  },
  actionText: {
    fontSize: 14,
    color: "#DD4646",
    fontFamily: FONT.MEDIUM,
    paddingLeft: 10,
  },
});
