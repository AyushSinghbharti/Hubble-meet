import AsyncStorage from '@react-native-async-storage/async-storage';

const HUBBLE_CIRCLE_KEY = "hubbleCircle";

// Get stored users
export const getHubbleCircle = async (): Promise<string[]> => {
    const jsonValue = await AsyncStorage.getItem(HUBBLE_CIRCLE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
};

// Add a user by ID
export const addToHubbleCircle = async (userId: string) => {
    const current = await getHubbleCircle();
    if (!current.includes(userId)) {
        const updated = [...current, userId];
        await AsyncStorage.setItem(HUBBLE_CIRCLE_KEY, JSON.stringify(updated));
    }
};

// Remove a user
export const removeFromHubbleCircle = async (userId: string) => {
    const current = await getHubbleCircle();
    const updated = current.filter((id) => id !== userId);
    await AsyncStorage.setItem(HUBBLE_CIRCLE_KEY, JSON.stringify(updated));
};

// Check if user is already in circle
export const isInHubbleCircle = async (userId: string) => {
    const current = await getHubbleCircle();
    return current.includes(userId);
};
