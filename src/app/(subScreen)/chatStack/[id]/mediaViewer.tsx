import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
  Platform,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { Video, ResizeMode } from 'expo-av';
import { AntDesign, Feather } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

const { width, height } = Dimensions.get('window');

interface MediaItem {
  id: string;
  url: string;
  fileName?: string;
  type?: string;
  size?: number;
}

interface MediaViewerProps {
  visible: boolean;
  mediaItems: MediaItem[];
  initialIndex?: number;
  onClose: () => void;
}

const MediaViewer: React.FC<MediaViewerProps> = ({
  visible,
  mediaItems,
  initialIndex = 0,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isDownloading, setIsDownloading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      flatListRef.current?.scrollToIndex({ index: initialIndex, animated: false });
    }
  }, [visible, initialIndex]);

  const currentMedia = mediaItems[currentIndex];
  const isVideo = currentMedia?.type?.startsWith('video/') || 
                  currentMedia?.url?.includes('.mp4') || 
                  currentMedia?.url?.includes('.mov') ||
                  currentMedia?.url?.includes('.avi');
  const isImage = currentMedia?.type?.startsWith('image/') || 
                  (!isVideo && (currentMedia?.type?.startsWith('image/') || 
                  currentMedia?.url?.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)));
  const isDocument = !isImage && !isVideo;

  // Request permissions for Android
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 33) {
          // Android 13+ uses scoped storage
          const { status } = await MediaLibrary.requestPermissionsAsync();
          return status === 'granted';
        } else {
          // Android 12 and below
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'This app needs access to storage to save media files.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (error) {
        console.error('Permission request error:', error);
        return false;
      }
    }
    // iOS
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  };

  const handleNext = () => {
    if (currentIndex < mediaItems.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const downloadFile = async () => {
    if (!currentMedia) return;

    try {
      setIsDownloading(true);

      if (isDocument) {
        // Handle document downloads
        Alert.alert(
          'Download Document',
          `"${currentMedia.fileName || 'Document'}" - Choose an option:`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open in Browser',
              onPress: () => {
                Linking.openURL(currentMedia.url).catch(() => {
                  Alert.alert('Error', 'Could not open document');
                });
              },
            },
            {
              text: 'Save & Share',
              onPress: async () => {
                try {
                  const fileName = currentMedia.fileName || `document_${Date.now()}`;
                  const fileUri = FileSystem.documentDirectory + fileName;

                  // Download the file
                  const downloadResult = await FileSystem.downloadAsync(
                    currentMedia.url,
                    fileUri
                  );

                  if (downloadResult.uri) {
                    // Check if sharing is available
                    const isAvailable = await Sharing.isAvailableAsync();
                    if (isAvailable) {
                      await Sharing.shareAsync(downloadResult.uri);
                    } else {
                      Alert.alert(
                        'Success',
                        `Document downloaded to: ${downloadResult.uri}`
                      );
                    }
                  }
                } catch (error) {
                  console.error('Document download error:', error);
                  Alert.alert('Error', 'Failed to download document');
                }
              },
            },
          ]
        );
      } else {
        // Handle image and video downloads
        const hasPermission = await requestPermissions();
        
        if (!hasPermission) {
          Alert.alert(
            'Permission Required',
            'Please grant storage permission to save media to gallery.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Settings',
                onPress: () => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:');
                  } else {
                    Linking.openSettings();
                  }
                },
              },
            ]
          );
          return;
        }

        try {
          const fileName = currentMedia.fileName || `media_${Date.now()}`;
          const fileExtension = currentMedia.url.split('.').pop() || (isImage ? 'jpg' : 'mp4');
          const fullFileName = fileName.includes('.') ? fileName : `${fileName}.${fileExtension}`;

          // Download to local directory first
          const localUri = FileSystem.documentDirectory + fullFileName;

          const downloadResumable = FileSystem.createDownloadResumable(
            currentMedia.url,
            localUri,
            {},
            (downloadProgress) => {
              const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
              console.log(`Download progress: ${(progress * 100).toFixed(0)}%`);
            }
          );

          const result = await downloadResumable.downloadAsync();

          if (result && result.uri) {
            // Save to gallery using MediaLibrary
            const asset = await MediaLibrary.createAssetAsync(result.uri);
            
            if (isImage) {
              // For images, save to Photos album
              let album = await MediaLibrary.getAlbumAsync('Photos');
              if (!album) {
                album = await MediaLibrary.createAlbumAsync('Photos', asset, false);
              } else {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
              }
            } else {
              // For videos, save to Videos album
              let album = await MediaLibrary.getAlbumAsync('Videos');
              if (!album) {
                album = await MediaLibrary.createAlbumAsync('Videos', asset, false);
              } else {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
              }
            }

            Alert.alert(
              'Success!',
              `${isImage ? 'Image' : 'Video'} saved to gallery successfully!`
            );

            // Clean up temporary file
            await FileSystem.deleteAsync(result.uri, { idempotent: true });
          } else {
            Alert.alert('Error', 'Failed to download file');
          }
        } catch (error) {
          console.error('Media download error:', error);
          Alert.alert('Error', 'Failed to save to gallery. Please try again.');
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const renderMediaItem = ({ item, index }: { item: MediaItem; index: number }) => {
    const itemIsVideo = item.type?.startsWith('video/') || 
                       item.url?.includes('.mp4') || 
                       item.url?.includes('.mov') ||
                       item.url?.includes('.avi');
    const itemIsImage = item.type?.startsWith('image/') || 
                       (!itemIsVideo && (item.type?.startsWith('image/') || 
                       item.url?.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)));
    const itemIsDocument = !itemIsImage && !itemIsVideo;

    return (
      <View style={styles.mediaContainer}>
        {itemIsImage ? (
          <ExpoImage
            source={{ uri: item.url }}
            style={styles.mediaContent}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
        ) : itemIsVideo ? (
          <Video
            source={{ uri: item.url }}
            style={styles.mediaContent}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={index === currentIndex}
            isLooping
            isMuted={false}
          />
        ) : (
          <View style={styles.documentContainer}>
            <Feather name="file" size={80} color="#666" />
            <Text style={styles.documentName} numberOfLines={2}>
              {item.fileName || 'Document'}
            </Text>
            {item.size && (
              <Text style={styles.documentSize}>
                {(item.size / 1024 / 1024).toFixed(2)} MB
              </Text>
            )}
            <TouchableOpacity
              style={styles.documentDownloadButton}
              onPress={downloadFile}
              disabled={isDownloading}
            >
              <Text style={styles.downloadButtonText}>
                {isDownloading ? 'Processing...' : 'Download'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar hidden />
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.counter}>
              {currentIndex + 1} of {mediaItems.length}
            </Text>
            {currentMedia?.fileName && (
              <Text style={styles.fileName} numberOfLines={1}>
                {currentMedia.fileName}
              </Text>
            )}
          </View>

          <TouchableOpacity 
            onPress={downloadFile} 
            style={styles.downloadButton}
            disabled={isDownloading}
          >
            <Feather 
              name={isDownloading ? "loader" : "download"} 
              size={20} 
              color="white" 
            />
          </TouchableOpacity>
        </View>

        {/* Media Content */}
        <FlatList
          ref={flatListRef}
          data={mediaItems}
          renderItem={renderMediaItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />

        {/* Navigation Buttons */}
        {mediaItems.length > 1 && (
          <>
            {currentIndex > 0 && (
              <TouchableOpacity 
                style={[styles.navButton, styles.prevButton]} 
                onPress={handlePrevious}
              >
                <AntDesign name="left" size={24} color="white" />
              </TouchableOpacity>
            )}
            {currentIndex < mediaItems.length - 1 && (
              <TouchableOpacity 
                style={[styles.navButton, styles.nextButton]} 
                onPress={handleNext}
              >
                <AntDesign name="right" size={24} color="white" />
              </TouchableOpacity>
            )}
          </>
        )}

        {/* Status Message */}
        {isDocument && currentMedia && (
          <View style={styles.documentInfo}>
            <Text style={styles.documentInfoText}>
              {isImage || isVideo ? 'Tap download to save to gallery' : 'Tap download for options'}
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  counter: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  fileName: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaContent: {
    width: width * 0.9,
    height: height * 0.8,
  },
  documentContainer: {
    width: width * 0.8,
    height: height * 0.6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  documentName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  documentSize: {
    color: 'white',
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 30,
  },
  documentDownloadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  prevButton: {
    left: 20,
  },
  nextButton: {
    right: 20,
  },
  documentInfo: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  documentInfoText: {
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
  },
});

export default MediaViewer;