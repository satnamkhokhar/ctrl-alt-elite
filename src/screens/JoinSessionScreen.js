import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { joinSession } from '../services/api';

export default function JoinSessionScreen() {
    const navigation = useNavigation();
    const [sessionId, setSessionId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleJoin = async () => {
        if (!sessionId) {
            return setErrorMessage('please enter a session ID');
        }

        setErrorMessage('');
        setLoading(true);

        const result = await joinSession(parseInt(sessionId));

        setLoading(false);

        if (result.success) {
            navigation.navigate('SessionLobbyScreen', { sessionId: parseInt(sessionId) });
        } else {
            setErrorMessage(result.error);
        }
    };

    return (
        <SafeAreaProvider>
            <LinearGradient
                colors={['#f00b0bff', '#c76d18ff']}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <SafeAreaView style={styles.container}>
                    <Text style={styles.title}>Join Session</Text>

                    <Text style={styles.label}>Session ID</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="enter session ID"
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        value={sessionId}
                        onChangeText={setSessionId}
                        keyboardType="numeric"
                    />

                    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleJoin}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Joining...' : 'Join Session'}
                        </Text>
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
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'flex-start',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 8,
        height: 44,
        width: '100%',
        fontSize: 16,
        color: 'white',
        paddingHorizontal: 12,
        marginBottom: 20,
    },
    button: {
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
    buttonText: {
        color: '#f00b0bff',
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    errorText: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
});
