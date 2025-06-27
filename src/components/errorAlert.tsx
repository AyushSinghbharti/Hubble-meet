// components/ErrorAlert.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface ErrorAlertProps {
  message: string | String;
  onClose: () => void;
}

const ErrorAlert = ({ message, onClose }: ErrorAlertProps) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const animationTimer = setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 0);

    // Set up auto-close timer
    const closeTimer = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < -10) {
          handleClose();
        }
      },
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => false,
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    flexDirection: "row",
    backgroundColor: "#ffebee",
    padding: 12,
    minHeight: 50,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "space-between",
    borderLeftColor: "#d32f2f",
    borderLeftWidth: 5,
    elevation: 5,
    zIndex: 999,
  },
  message: {
    flex: 1,
    color: "#E53935",
    fontSize: 14,
    marginRight: 10,
  },
});

export default ErrorAlert;