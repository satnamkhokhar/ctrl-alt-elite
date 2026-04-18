import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { loginUser } from '../services/api';

function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            setMessage('Please enter your email and password.');
            return;
        }
        setIsLoading(true);
        setMessage('');
        const result = await loginUser(email.trim(), password);
        setIsLoading(false);
        if (result.success) {
            await AsyncStorage.setItem('token', result.token);
            await AsyncStorage.setItem('userId', String(result.userId));
            navigation.navigate('HomeScreen');
        } else {
            setMessage(result.error || 'Login failed. Please try again.');
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
                    <Text style={styles.DineSync}>{'\n'}DineSync</Text>
                    <Text style={styles.label}>Login or Create an Account!{'\n\n'}</Text>
                    <Text style={styles.label}>Email: </Text>
                    <TextInput
                        style={styles.input}
                        placeholder='enter your email'
                        placeholderTextColor="white"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType='email-address'
                        autoCapitalize='none'
                    />
                    <Text style={styles.label}>Password: </Text>
                    <TextInput
                        style={styles.input}
                        placeholder='enter your password'
                        placeholderTextColor="white"
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize='none'
                        secureTextEntry
                    />

                    {message ? <Text style={styles.errorText}>{message}</Text> : null}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                        disabled={isLoading}
                        testID="loginButton"
                    >
                        {isLoading
                            ? <ActivityIndicator color="red" />
                            : <Text style={styles.buttonText}>Login</Text>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('NamesScreen')}
                        testID="createAccountButton"
                    >
                        <Text style={styles.buttonText}>Create Account</Text>
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
    },
    label: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        margin: 1,
    },
    input: {
        borderWidth: 1,
        borderColor: 'white',
        height: 40,
        width: 200,
        fontSize: 16,
        marginBottom: 20,
        borderRadius: 8,
        textAlign: 'center',
        color: 'white',
    },
    button: {
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2,
        height: 30,
        width: 150,
        borderRadius: 8,
        marginBottom: 8,
        justifyContent: 'center',
        backgroundColor: 'white',
        opacity: .45,
    },
    buttonText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    DineSync: {
        fontSize: 75,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'white',
    },
    errorText: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
});

export default LoginScreen;
