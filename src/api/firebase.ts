import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';

// Initialize Firebase if it hasn't been initialized yet
export function initializeFirebase() {
  if (!firebase.apps.length) {
    // Firebase is automatically initialized using the google-services.json and GoogleService-Info.plist files
    // No need to pass any options here as the configuration is read from those files
    firebase.initializeApp();
    console.log('Firebase initialized successfully');
  } else {
    console.log('Firebase already initialized');
  }

  return firebase;
}

// Check if Firebase is ready
export function isFirebaseReady() {
  return firebase.apps.length > 0;
}

// Get the Firebase app instance
export function getFirebaseApp() {
  if (!firebase.apps.length) {
    return initializeFirebase();
  }
  return firebase.app();
}