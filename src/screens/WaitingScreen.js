import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { checkSessionStatus, finalizeSession } from '../services/api';

function WaitingScreen({ route, navigation }) {
    const { sessionId } = route.params;
    const [message, setMessage] = useState('Waiting for others...');
    // Temporary: this screen will just keep showing this "waiting" since the votes backend needs to be completed to show the results!

    useEffect(() => {
        const interval = setInterval(async () => {
            const statusResult = await checkSessionStatus(sessionId);

            if (statusResult.success && statusResult.data.finished) {
                const finalizeResult = await finalizeSession(sessionId);

                if (finalizeResult.success) {
                    //(MatchFoundScreen): will be moved to the restaurant match screen once its built, for now it goes back to the home screen.
                    navigation.navigate('HomeScreen', {
                        winningRestaurantId: finalizeResult.data.winning_restaurant_id,
                        winningScore: finalizeResult.data.winning_score,
                    });
                } else {
                    setMessage(finalizeResult.error);
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [sessionId, navigation]);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="black" />
                <Text style={styles.text}>{message}</Text>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'pink',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    text: {
        marginTop: 20,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default WaitingScreen;