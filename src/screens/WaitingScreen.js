import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { checkSessionStatus, finalizeSession } from '../services/api';

function WaitingScreen({ route, navigation }) {
    const { sessionId } = route.params;
    const [message, setMessage] = useState('Waiting for others to finish...');
    const [canFinalize, setCanFinalize] = useState(false);
    const [finalizing, setFinalizing] = useState(false);
    const navigatedRef = useRef(false);

    const handleFinalize = async () => {
        if (navigatedRef.current) return;
        setFinalizing(true);
        const finalizeResult = await finalizeSession(sessionId);
        if (finalizeResult.success) {
            navigatedRef.current = true;
            navigation.navigate('MatchScreen', {
                restaurant: finalizeResult.data.winning_restaurant,
                topRestaurants: finalizeResult.data.top_restaurants,
            });
        } else {
            setMessage(finalizeResult.error || 'Could not finalize session.');
            setFinalizing(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            if (navigatedRef.current) return;
            const statusResult = await checkSessionStatus(sessionId);

            if (statusResult.success) {
                if (statusResult.data.finished) {
                    clearInterval(interval);
                    await handleFinalize();
                } else {
                    // Show manual finalize button after 30 seconds as fallback
                    setCanFinalize(true);
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [sessionId]);

    return (
        <SafeAreaProvider>
            <LinearGradient
                colors={['#f00b0bff', '#c76d18ff']}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <SafeAreaView style={styles.container}>
                    <ActivityIndicator size="large" color="white" />
                    <Text style={styles.text}>{message}</Text>

                    {canFinalize && (
                        <TouchableOpacity style={[styles.button, finalizing && { opacity: 0.6 }]} onPress={handleFinalize} disabled={finalizing}>
                            <Text style={styles.buttonText}>{finalizing ? 'Loading results...' : "Everyone's Done? See Results"}</Text>
                        </TouchableOpacity>
                    )}
                    {finalizing && <Text style={styles.subText}>Finding your match...</Text>}
                </SafeAreaView>
            </LinearGradient>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    text: {
        marginTop: 20,
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    subText: {
        marginTop: 12,
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
    },
    button: {
        marginTop: 30,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 24,
        backgroundColor: 'white',
        opacity: 0.85,
    },
    buttonText: {
        color: '#f00b0bff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default WaitingScreen;