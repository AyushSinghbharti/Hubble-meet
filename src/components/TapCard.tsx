// components/InfoCard.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // or any icon lib
import { FONT } from '@/assets/constants/fonts';

interface InfoCardProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
}

const TapCard: React.FC<InfoCardProps> = ({ title, description, icon }) => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.closeIcon} onPress={() => setVisible(false)}>
                <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>

            <View style={styles.row}>
                <Text style={styles.title}>{title}</Text>
                {icon && <View style={styles.icon}>{icon}</View>}
            </View>

            <Text style={styles.description}>{description}</Text>
        </View>
    );
};

export default TapCard;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        padding: 16,
        position: 'relative',
        margin: 10,
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        color: '#BBCF8D', // Light green
        fontSize: 18,
        fontWeight: '600',
        marginRight: 8,
        fontFamily: FONT.MONSERRATMEDIUM
    },
    icon: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 2,
    },
    description: {
        color: '#fff',
        fontSize: 14,
        fontFamily: FONT.MONSERRATREGULAR
    },
});
