import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text style={styles.text}>DineSync</Text>
            </SafeAreaView>
        </SafeAreaProvider>

    )
}
export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    text: {
        color: 'green',
        fontSize: 42,
        fontWeight: 'bold',
        textAlign: 'center',
    }
})
