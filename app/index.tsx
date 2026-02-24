import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

export default function Index() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.title}>DineSync</Text>
            <Text style={styles.subtitle}>Group Dining Made Easy</Text>
            <Text style={styles.status}>✅ React Native is running!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 30,
    },
    status: {
        fontSize: 20,
        color: '#4CAF50',
        marginBottom: 20,
    },
    info: {
        fontSize: 14,
        color: '#999',
    },
});
