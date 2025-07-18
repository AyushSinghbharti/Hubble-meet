import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import colorTheme from "../theme/colourTheme";
import { useRouter } from "expo-router";

interface CustomButtonProps {
  label: string;
  onPress: () => void;
  isActive?: boolean;
  number?: number;
  showLabel?: boolean;
  width?: number | string;
  style?: any;
  enableRedirect: boolean;
}

const Button: React.FC<CustomButtonProps> = ({
  label,
  number,
  width,
  showLabel = false,
  onPress,
  isActive = true,
  enableRedirect = true,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();

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

    if (enableRedirect) {
      setTimeout(() => {
        router.replace("/profile");
      }, 750);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={isActive ? handlePress : () => {}}>
      <Animated.View
        style={[
          styles.button,
          style,
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
    backgroundColor: colorTheme.buttonPrimaryDisabled,
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 24,
    height: 50,
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
    backgroundColor: colorTheme.buttonPrimary,
  },
  label: {
    color: "#000",
    fontFamily: "InterBold",
    fontSize: 16,
  },
  activeLabel: {
    color: "#000",
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
