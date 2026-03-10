import React from 'react';
import { Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

function HomeScreen() {
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Text>Home Screen - Coming Soon</Text>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

export default HomeScreen;