import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createSession } from '../services/api';

export default function SessionScreen() {
    const navigation = useNavigation();
    const [budget, setBudget] = useState('');
    const [maxDistance, setMaxDistance] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateSession = async () => {
        if (!budget || !maxDistance) {
            return setErrorMessage('budget and max distance are required');
        }

        setErrorMessage('');
        setLoading(true);

        const result = await createSession(parseFloat(budget), parseFloat(maxDistance));

        setLoading(false);

        if (result.success) {
            setSessionId(result.data.session_id);
        } else {
            setErrorMessage(result.error);
        }
    };

    const handleContinue = () => {
        navigation.navigate('SessionLobbyScreen', { sessionId });
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
                    <KeyboardAvoidingView
                        style={styles.container}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            keyboardShouldPersistTaps="handled"
                        >
                            <Text style={styles.title}>Create Session</Text>

                            {!sessionId ? (
                                <>
                                    <Text style={styles.label}>Budget ($)</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. 30"
                                        placeholderTextColor="rgba(255,255,255,0.6)"
                                        value={budget}
                                        onChangeText={setBudget}
                                        keyboardType="numeric"
                                    />

                                    <Text style={styles.label}>Max Distance (miles)</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. 5"
                                        placeholderTextColor="rgba(255,255,255,0.6)"
                                        value={maxDistance}
                                        onChangeText={setMaxDistance}
                                        keyboardType="numeric"
                                    />

                                    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={handleCreateSession}
                                        disabled={loading}
                                    >
                                        <Text style={styles.buttonText}>
                                            {loading ? 'Creating...' : 'Create Session'}
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <View style={styles.successContainer}>
                                    <Text style={styles.successText}>Session Created!</Text>
                                    <Text style={styles.label}>Share this Session ID with your group:</Text>
                                    <Text style={styles.sessionId}>{sessionId}</Text>
                                    <TouchableOpacity style={styles.button} onPress={handleContinue}>
                                        <Text style={styles.buttonText}>Go to Lobby</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </LinearGradient>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
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
        textAlign: 'center',
        width: '100%',
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
    successContainer: {
        alignItems: 'center',
        width: '100%',
    },
    successText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    sessionId: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
        marginVertical: 20,
    },
});
