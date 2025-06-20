// screens/NotificationsScreen.js
import React from 'react';
import { View, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import NotificationCard from '../../../components/NotificationCard';
import NavHeader from '../../../components/NavHeader';
import { Platform } from 'react-native';


const DATA = [
    {
        id: '1',
        name: 'Kiran Patel',
        status: 'Accepted your request',
        date: '25/01/2025',
        image: require('../../../../assets/images/p1.jpg'), // Replace with your own image
    },
    {
        id: '2',
        name: 'Sara Ahmed',
        status: 'Sent you a message',
        date: '24/01/2025',
        image: require('../../../../assets/images/p1.jpg'),
    },
];

const NotificationsScreen = () => {
    return (
        <SafeAreaView style={styles.container}>

            <NavHeader title='Noticication' />
            <FlatList
                data={DATA}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <NotificationCard
                        name={item.name}
                        status={item.status}
                        date={item.date}
                        image={item.image}
                    />
                )}
                contentContainerStyle={{ padding: 16 }}
            />
        </SafeAreaView>
    );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        paddingTop: Platform.OS === 'ios' ? 10 : 30,
    },
});
