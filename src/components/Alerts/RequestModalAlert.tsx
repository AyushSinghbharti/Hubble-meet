import { FONT } from '@/assets/constants/fonts';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import ManualBlur from '../BlurComp';


const { width } = Dimensions.get('window');
const IMAGE_SIZE = 80;

const MatchModal = ({ visible, onClose, onSendMessage, user1Image, user2Image }) => {
  const [merged, setMerged] = useState(false);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      progress.value = withTiming(
        1,
        { duration: 1500, easing: Easing.inOut(Easing.ease) },
        () => runOnJS(setMerged)(true)
      );
    } else {
      progress.value = 0;
      setMerged(false);
    }
  }, [visible]);

  const leftImageStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [-IMAGE_SIZE / 2, 0]);
    return { transform: [{ translateX }] };
  });

  const rightImageStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [IMAGE_SIZE / 2, 0]);
    return { transform: [{ translateX }] };
  });

  return (

    <ManualBlur >
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            {/* Merged Profile Images */}
            <View style={styles.avatarContainer}>
              {!merged ? (
                <>
                  <Animated.Image
                    source={typeof user1Image === 'string' ? { uri: user1Image } : user1Image}
                    style={[styles.image, leftImageStyle]}
                  />
                  <Animated.Image
                    source={typeof user2Image === 'string' ? { uri: user2Image } : user2Image}
                    style={[styles.image, rightImageStyle]}
                  />
                </>
              ) : (
                <View style={styles.mergedCircle}>
                  <View style={styles.leftHalf}>
                    <Image
                      source={typeof user1Image === 'string' ? { uri: user1Image } : user1Image}
                      style={styles.circleImage}
                    />
                  </View>
                  <View style={styles.rightHalf}>
                    <Image
                      source={typeof user2Image === 'string' ? { uri: user2Image } : user2Image}
                      style={styles.circleImage}
                    />
                  </View>
                </View>
              )}
            </View>

            {/* Title */}
            <Text style={styles.title}>Connection Made!</Text>

            {/* Button */}
            <TouchableOpacity style={styles.hiButton} onPress={onSendMessage}>
              <Image style={{ height: 15, width: 15 }} source={require('../../../assets/handshake1.png')} />
              <Text style={{ color: "#fff", fontFamily: FONT.REGULAR }}>Say “Hi”</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ManualBlur>

  );
};

export default MatchModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    backgroundColor: '#C7DA91',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    position: 'relative',

  },
  closeButton: {
    position: 'absolute',
    top: -105,
    backgroundColor: '#C7DA91',
    borderRadius: 30,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  closeText: {
    fontSize: 20,
    color: '#000',
  },
  avatarContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    borderWidth: 1,
    borderColor: '#fff',
    position: 'absolute',
  },
  mergedCircle: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  leftHalf: {
    flex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: IMAGE_SIZE / 2,
    borderBottomLeftRadius: IMAGE_SIZE / 2,
  },
  rightHalf: {
    flex: 1,
    overflow: 'hidden',
    borderTopRightRadius: IMAGE_SIZE / 2,
    borderBottomRightRadius: IMAGE_SIZE / 2,
  },
  circleImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#000',
  },
  hiButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 24,
    flexDirection: "row",
    columnGap: 10
  },
  hiButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
