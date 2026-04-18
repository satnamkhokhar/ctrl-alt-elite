import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getSessionDetails, getUserDetails, startSession } from '../services/api';

function SessionLobbyScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { sessionId } = route.params || {};

    const [session, setSession] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const [starting, setStarting] = useState(false);
    const navigatedRef = useRef(false); // prevents double-navigation for non-hosts

    const navigateToSwipe = async (dietary) => {
        if (navigatedRef.current) return;
        navigatedRef.current = true;

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            navigatedRef.current = false;
            Alert.alert('Location Required', 'Please allow location access to find nearby restaurants.');
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const storedUserId = await AsyncStorage.getItem('userId');

        navigation.navigate('SwipeCardScreen', {
            sessionId,
            userId: storedUserId,
            isHost,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            radius: session?.max_distance * 1609.34 || 3000,
            dietary,
        });
    };

    const fetchSession = async () => {
        const result = await getSessionDetails(sessionId);

        if (result.success) {
            setSession(result.data);

            const participantPromises = result.data.members.map(async (userId) => {
                const userResult = await getUserDetails(userId);
                if (userResult.success) {
                    return {
                        userId,
                        name: `${userResult.data.first_name} ${userResult.data.last_name}`,
                        username: userResult.data.username,
                    };
                }
                return { userId, name: 'Unknown User', username: '' };
            });

            const participantData = await Promise.all(participantPromises);
            setParticipants(participantData);

            const storedUserId = await AsyncStorage.getItem('userId');
            setCurrentUserId(storedUserId);
            setIsHost(result.data.members[0] === parseInt(storedUserId));

            // Non-hosts: auto-navigate when host starts the session
            const isNonHost = result.data.members[0] !== parseInt(storedUserId);
            if (isNonHost && result.data.status === 'started' && !navigatedRef.current) {
                navigateToSwipe(null); // dietary already filtered server-side for the search
            }
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchSession();

        const interval = setInterval(() => {
            fetchSession();
        }, 3000);

        return () => clearInterval(interval);
    }, [sessionId]);

    const handleCopySessionId = () => {
        Clipboard.setStringAsync(sessionId.toString());
        Alert.alert('Copied!', `Session ID ${sessionId} copied to clipboard`);
    };

    const handleShare = () => {
        Share.share({
            message: `Join my DineSync session! Enter this code in the app: ${sessionId}`,
        });
    };

    const handleStartSwiping = async () => {
        if (starting) return;
        setStarting(true);
        const result = await startSession(sessionId);

        if (!result.success) {
            Alert.alert('Error', result.error);
            setStarting(false);
            return;
        }

        // dietary is aggregated from all members by the backend
        await navigateToSwipe(result.data.dietary);
        setStarting(false);
    };

    const handleLeaveSession = () => {
        Alert.alert(
            'Leave Session',
            'Are you sure you want to leave this session?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Leave',
                    style: 'destructive',
                    onPress: () => navigation.navigate('HomeScreen'),
                },
            ]
        );
    };

    if (loading) {
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
                        <Text style={styles.loadingText}>Loading session...</Text>
                    </SafeAreaView>
                </LinearGradient>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <LinearGradient
                colors={['#f00b0bff', '#c76d18ff']}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <SafeAreaView style={styles.container}>
                    <Text style={styles.title}>Session Lobby</Text>

                    <View style={styles.sessionCodeContainer}>
                        <Text style={styles.sessionCodeLabel}>Session ID:</Text>
                        <Text style={styles.sessionCode}>{sessionId}</Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.copyButton} onPress={handleCopySessionId}>
                                <Text style={styles.copyButtonText}>Copy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                                <Text style={styles.shareButtonText}>Share</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.participantsContainer}>
                        <Text style={styles.participantsTitle}>
                            Participants ({participants.length})
                        </Text>

                        {participants.map((participant, index) => (
                            <View key={participant.userId} style={styles.participantRow}>
                                <Text style={styles.participantText}>
                                    {participant.name}
                                    {index === 0 && ' (Host)'}
                                    {participant.userId === parseInt(currentUserId) && ' (You)'}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {isHost ? (
                        <TouchableOpacity style={[styles.startButton, starting && styles.buttonDisabled]} onPress={handleStartSwiping} disabled={starting}>
                            <Text style={styles.startButtonText}>{starting ? 'Starting...' : 'Start Swiping'}</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.waitingText}>Waiting for host to start...</Text>
                    )}

                    <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveSession}>
                        <Text style={styles.leaveButtonText}>Leave Session</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </LinearGradient>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 30,
    },
    sessionCodeContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'black',
        marginBottom: 30,
        alignItems: 'center',
        width: '100%',
    },
    sessionCodeLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    sessionCode: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#f00b0bff',
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
    },
    copyButton: {
        backgroundColor: '#f00b0bff',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#f00b0bff',
    },
    copyButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    shareButton: {
        backgroundColor: '#f00b0bff',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#f00b0bff',
    },
    shareButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    participantsContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'black',
        width: '100%',
        marginBottom: 20,
    },
    participantsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    participantRow: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    participantText: {
        fontSize: 16,
    },
    startButton: {
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2,
        height: 50,
        width: 300,
        borderRadius: 8,
        marginTop: 15,
        justifyContent: 'center',
        backgroundColor: 'white',
        opacity: .45,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    startButtonText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#f00b0bff',
        textAlign: 'center',
    },
    waitingText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    leaveButton: {
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2,
        height: 50,
        width: 300,
        borderRadius: 8,
        marginTop: 15,
        justifyContent: 'center',
        backgroundColor: 'white',
        opacity: .45,
    },
    leaveButtonText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#f00b0bff',
        textAlign: 'center',
    },
    loadingText: {
        color: 'white',
        fontSize: 18,
        marginTop: 10,
    },
});

export default SessionLobbyScreen;
