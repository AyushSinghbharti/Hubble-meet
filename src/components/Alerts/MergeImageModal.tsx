// MergeImageModal.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    Modal,
    StyleSheet,
    Dimensions,
    Text,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    interpolate,
    runOnJS,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = 150;

interface MergeImageModalProps {
    visible: boolean;
    onClose: () => void;
    onComplete: () => void;
    user1Image: string;
    user2Image: string;
}

const MergeImageModal: React.FC<MergeImageModalProps> = ({
    visible,
    onClose,
    onComplete,
    user1Image,
    user2Image,
}) => {
    const [merged, setMerged] = useState(false);
    const progress = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            progress.value = withTiming(
                1,
                { duration: 2000, easing: Easing.inOut(Easing.ease) },
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

    const containerStyle = useAnimatedStyle(() => ({
        backgroundColor: merged ? '#74C69D' : 'black',
    }));

    return (
        <Modal visible={visible} transparent animationType="fade">
            <Animated.View style={[styles.modalBackground, containerStyle]}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeText}>X</Text>
                </TouchableOpacity>

                <View style={styles.centered}>
                    {!merged ? (
                        <>
                            <Animated.Image source={{ uri: user1Image }} style={[styles.halfImage, leftImageStyle]} />
                            <Animated.Image source={{ uri: user2Image }} style={[styles.halfImage, rightImageStyle]} />
                        </>
                    ) : (
                        <TouchableOpacity style={styles.mergedCircle} onPress={onComplete}>
                            <View style={styles.halfLeft}>
                                <Image source={{ uri: user1Image }} style={styles.circleImage} />
                            </View>
                            <View style={styles.halfRight}>
                                <Image source={{ uri: user2Image }} style={styles.circleImage} />
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>
        </Modal>
    );
};

export default MergeImageModal;

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centered: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    halfImage: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderRadius: 20,
        marginHorizontal: 10,
    },
    mergedCircle: {
        flexDirection: 'row',
        width: IMAGE_SIZE * 2,
        height: IMAGE_SIZE,
        overflow: 'hidden',
        borderRadius: 75,
        backgroundColor: 'white',
    },
    halfLeft: {
        flex: 1,
        overflow: 'hidden',
        borderTopLeftRadius: 75,
        borderBottomLeftRadius: 75,
    },
    halfRight: {
        flex: 1,
        overflow: 'hidden',
        borderTopRightRadius: 75,
        borderBottomRightRadius: 75,
    },
    circleImage: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 30,
        zIndex: 10,
    },
    closeText: {
        fontSize: 24,
        color: '#fff',
    },
});
