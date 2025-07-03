import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

interface Props {
  onSwipeSuccess: () => void;
  text: string;
  hasError?: string | boolean;
}

const SwipeToSubmitButton: React.FC<Props> = ({ onSwipeSuccess, text, hasError }) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const HEIGHT = 50;
  const CIRCLE_SIZE = HEIGHT;

  const translateX = useSharedValue(0);
  const MAX_TRANSLATE = containerWidth - CIRCLE_SIZE;

  useEffect(() => {
    if (hasError) {
      translateX.value = withSpring(0);
    }
  }, [hasError]);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number }
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = Math.min(
        Math.max(ctx.startX + event.translationX, 0),
        MAX_TRANSLATE
      );
    },
    onEnd: () => {
      if (translateX.value > MAX_TRANSLATE * 0.9) {
        translateX.value = withSpring(MAX_TRANSLATE);
        runOnJS(onSwipeSuccess)();
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const bgFillStyle = useAnimatedStyle(() => ({
    width: translateX.value + CIRCLE_SIZE,
  }));

  return (
    <View style={styles.outerContainer}>
      <View
        style={[styles.container, { height: HEIGHT }]}
        onLayout={(e: LayoutChangeEvent) =>
          setContainerWidth(e.nativeEvent.layout.width)
        }
      >
        <Animated.View style={[styles.fill, bgFillStyle, { borderRadius: HEIGHT / 2 }]} />
        <Text style={styles.label}>{text}</Text>

        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              styles.circle,
              {
                width: CIRCLE_SIZE,
                height: CIRCLE_SIZE,
                borderRadius: CIRCLE_SIZE / 2,
              },
              circleStyle,
            ]}
          >
            <AntDesign name="arrowright" size={24} color="#000" />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
};

export default SwipeToSubmitButton;

const styles = StyleSheet.create({
  outerContainer: {
    padding: 5,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 100,
    elevation: 3,
    backgroundColor: "#fff",
  },
  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#BBCF8D",
    zIndex: 1,
  },
  label: {
    fontSize: 16,
    color: "#000",
    fontFamily: "InterMedium",
    zIndex: 0,
  },
  circle: {
    position: "absolute",
    left: 0,
    backgroundColor: "#BBCF8D",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
});