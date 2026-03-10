import React from 'react';
import { Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

function DietaryRestrictionsScreen() {
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Text>Dietary Restrictions - Coming Soon</Text>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

export default DietaryRestrictionsScreen;