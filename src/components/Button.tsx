import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";

interface CustomButtonProps {
  label: string;
  number: number;
  showLabel?: boolean;
  onPress?: () => void;
  isActive?: boolean;
  width?: number;
}

const Button: React.FC<CustomButtonProps> = ({
  label,
  number,
  showLabel = true,
  onPress,
  isActive = false,
  width,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    onPress?.();
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View
        style={[
          styles.button,
          isActive ? styles.activeButton : styles.inactiveBorder,
          { transform: [{ scale: scaleAnim }], width: width },
        ]}
      >
        <View style={styles.content}>
          <Text style={[styles.label, isActive && styles.activeLabel]}>
            {label}
          </Text>
          {showLabel && (
            <View style={styles.badge}>
              <Text style={styles.countText}>{number}</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 35,
    marginHorizontal: 4,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  inactiveBorder: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  activeButton: {
    backgroundColor: "#BBCF8D",
  },
  label: {
    fontSize: 16,
    color: "#374151",
  },
  activeLabel: {
    color: "#fff",
  },
  badge: {
    backgroundColor: "#000",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8, // replaced `bottom`
  },
  countText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Button;
