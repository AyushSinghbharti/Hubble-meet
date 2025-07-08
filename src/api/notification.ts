import messaging from '@react-native-firebase/messaging';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Request permission for push notifications
export async function requestNotificationPermission() {
  if (Platform.OS === 'android') {
    // Create a notification channel for Android
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (!Device.isDevice) {
    console.log('Push notifications are not supported in emulators/simulators');
    return false;
  }

  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request permissions if not already granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permission not granted for push notifications');
    return false;
  }

  // Request Firebase messaging permission for iOS
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('iOS notification permission not granted');
      return false;
    }
  }

  return true;
}

// Get the Expo push token
export async function getExpoPushToken() {
  try {
    // Try to get project ID from Constants
    let projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

    // If project ID is not found in Constants, use a default value
    // You should replace this with your actual Expo project ID
    if (!projectId) {
      // For development, we can use a placeholder ID
      // In production, you should set this in app.json or app.config.js
      projectId = 'your-expo-project-id';
      console.log('Using default project ID for development:', projectId);
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    console.log('Expo Push Token:', token.data);
    return token.data;
  } catch (error) {
    console.error('Error getting Expo push token:', error);
    return null;
  }
}

// Get the Firebase token
export async function getFirebaseToken() {
  try {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log('Firebase Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting Firebase token:', error);
    return null;
  }
}

// Initialize Firebase messaging background handler
export function initializeFirebaseMessaging() {
  // Handle background messages
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
    logFCMMessage(remoteMessage, 'background');
  });

  // Return unsubscribe function
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground message received:', remoteMessage);
    logFCMMessage(remoteMessage, 'foreground');

    // Convert Firebase message to Expo notification format
    if (remoteMessage.notification) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification.title || '',
          body: remoteMessage.notification.body || '',
          data: remoteMessage.data || {},
        },
        trigger: null, // Show immediately
      });
    }
  });

  return unsubscribe;
}

// Send a test notification (for development purposes)
export async function sendTestNotification(expoPushToken: string) {
  try {
    // Create a local notification for immediate testing
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification',
        body: 'This is a test notification!',
        data: { testData: 'Test value' },
      },
      trigger: null, // Show immediately
    });

    // Also try to send a push notification
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Test Push Notification',
      body: 'This is a test push notification!',
      data: { testData: 'Test value' },
    };

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    console.log('Push notification sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending test notification:', error);
    throw error;
  }
}

// Add notification listeners
export function addNotificationListeners(onNotificationReceived: (notification: Notifications.Notification) => void,
  onNotificationResponse: (response: Notifications.NotificationResponse) => void) {
  // Listen for notifications received while app is in foreground
  const notificationListener = Notifications.addNotificationReceivedListener(onNotificationReceived);

  // Listen for user interactions with notifications
  const responseListener = Notifications.addNotificationResponseReceivedListener(onNotificationResponse);

  // Return cleanup function
  return () => {
    notificationListener.remove();
    responseListener.remove();
  };
}


// Function to log FCM messages for debugging purposes
export function logFCMMessage(message: any, source: string = 'unknown') {
  console.log(`[FCM ${source}] Message received:`, JSON.stringify(message, null, 2));

  // Log specific parts of the message
  if (message.notification) {
    console.log(`[FCM ${source}] Notification:`, {
      title: message.notification.title,
      body: message.notification.body
    });
  }

  if (message.data) {
    console.log(`[FCM ${source}] Data payload:`, message.data);
  }

  // Log token information if available
  if (message.from) {
    console.log(`[FCM ${source}] From:`, message.from);
  }

  if (message.messageId) {
    console.log(`[FCM ${source}] Message ID:`, message.messageId);
  }
}


// Example of server-side code to send FCM message
// Note: This is for reference only and should be implemented on your server
export function serverSideFCMExample() {
  console.log('Server-side FCM message sending example:');
  console.log(`
// Server-side code (Node.js with Firebase Admin SDK)
const admin = require('firebase-admin');

// Initialize with service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

// Send message to a specific device
const sendFCMMessage = async (token, title, body, data = {}) => {
  try {
    const message = {
      notification: {
        title,
        body,
      },
      data,
      token, // The FCM token of the device
    };

    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Example usage
sendFCMMessage(
  'device_token_here',
  'New Message',
  'You have received a new message!',
  { type: 'chat', senderId: '123' }
);
`);
}

// Subscribe to FCM topics
export async function subscribeToTopic(topic: string) {
  try {
    await messaging().subscribeToTopic(topic);
    console.log(`Subscribed to topic: ${topic}`);
    return true;
  } catch (error) {
    console.error(`Failed to subscribe to topic ${topic}:`, error);
    return false;
  }
}

// Unsubscribe from FCM topics
export async function unsubscribeFromTopic(topic: string) {
  try {
    await messaging().unsubscribeFromTopic(topic);
    console.log(`Unsubscribed from topic: ${topic}`);
    return true;
  } catch (error) {
    console.error(`Failed to unsubscribe from topic ${topic}:`, error);
    return false;
  }
}

// Example of how to send to topics from server-side
export function topicMessagingExample() {
  console.log('Topic messaging example:');
  console.log(`
// Server-side code (Node.js with Firebase Admin SDK)
const admin = require('firebase-admin');

// Send message to devices subscribed to a topic
const sendToTopic = async (topic, title, body, data = {}) => {
  try {
    const message = {
      notification: {
        title,
        body,
      },
      data,
      topic, // The FCM topic
    };

    const response = await admin.messaging().send(message);
    console.log('Successfully sent message to topic:', response);
    return response;
  } catch (error) {
    console.error('Error sending message to topic:', error);
    throw error;
  }
};

// Example usage
sendToTopic(
  'news',
  'Breaking News',
  'Check out our latest article!',
  { type: 'news', articleId: '456' }
);
`);
}

// Handle data-only messages (silent notifications)
export function handleDataOnlyMessages(callback: (data: any) => void) {
  // This handles data-only messages when the app is in the foreground
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    // Check if this is a data-only message (no notification payload)
    if (!remoteMessage.notification && remoteMessage.data) {
      console.log('Data-only message received in foreground:', remoteMessage.data);
      logFCMMessage(remoteMessage, 'data-only');

      // Process the data payload
      if (callback) {
        callback(remoteMessage.data);
      }
    }
  });

  return unsubscribe;
}

// Example of how to send data-only messages from server-side
export function dataOnlyMessageExample() {
  console.log('Data-only message example:');
  console.log(`
// Server-side code (Node.js with Firebase Admin SDK)
const admin = require('firebase-admin');

// Send data-only message to a specific device
const sendDataOnlyMessage = async (token, data = {}) => {
  try {
    const message = {
      data, // Only include data payload, no notification
      token,
      // Set content_available: true for iOS to wake up the app
      apns: {
        payload: {
          aps: {
            'content-available': 1,
          },
        },
      },
      // Set priority to high for Android
      android: {
        priority: 'high',
      },
    };

    const response = await admin.messaging().send(message);
    console.log('Successfully sent data-only message:', response);
    return response;
  } catch (error) {
    console.error('Error sending data-only message:', error);
    throw error;
  }
};

// Example usage
sendDataOnlyMessage(
  'device_token_here',
  { 
    type: 'sync_data', 
    action: 'refresh_content',
    timestamp: Date.now().toString()
  }
);
`);
}


// Debug function to help troubleshoot notification token issues
export function debugNotificationSetup() {
  console.log('======= NOTIFICATION SETUP DEBUG INFO =======');

  // Check device information
  console.log('Device Information:');
  console.log('- Is Physical Device:', Device.isDevice);
  console.log('- Device Type:', Device.deviceType);
  console.log('- OS:', Platform.OS);
  console.log('- OS Version:', Platform.Version);

  // Check Expo Constants
  console.log('\nExpo Configuration:');
  console.log('- Constants.expoConfig:', Constants.expoConfig ? 'Available' : 'Not available');
  if (Constants.expoConfig) {
    console.log('  - app.json name:', Constants.expoConfig.name);
    console.log('  - app.json slug:', Constants.expoConfig.slug);
    console.log('  - EAS Project ID:',
      Constants.expoConfig.extra?.eas?.projectId || 'Not configured');
  }

  console.log('- Constants.easConfig:', Constants.easConfig ? 'Available' : 'Not available');
  if (Constants.easConfig) {
    console.log('  - EAS Project ID:', Constants.easConfig.projectId || 'Not configured');
  }

  // Check Firebase configuration
  console.log('\nFirebase Configuration:');
  const firebaseApps = messaging().app.name ? 'Initialized' : 'Not initialized';
  console.log('- Firebase Apps:', firebaseApps);

  console.log('==========================================');

  // Return a summary of the issues found
  const issues = [];

  if (!Device.isDevice) {
    issues.push('Running on simulator/emulator - push notifications may not work properly');
  }

  if (!Constants.expoConfig?.extra?.eas?.projectId && !Constants.easConfig?.projectId) {
    issues.push('Missing Expo project ID - configure in app.json or app.config.js');
  }

  if (firebaseApps === 'Not initialized') {
    issues.push('Firebase not properly initialized');
  }

  return {
    issues,
    hasIssues: issues.length > 0
  };
}