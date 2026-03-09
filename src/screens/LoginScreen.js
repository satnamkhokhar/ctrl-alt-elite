import React, {useState} from 'react';
import {Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';


function LoginScreen () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();
    const BASE_URL = `http://${Constants.expoConfig.hostUri.split(':')[0]}:5000`;

    const handleLogin = async () => {
        if (email.length === 0 || password.length === 0) {
            setErrorMessage('Please enter your email and password');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('login successful token:', data.access_token);
            await AsyncStorage.setItem('access_token', data.access_token);
            setErrorMessage(''); //clears any previous error messages
            navigation.navigate('HomeScreen'); //navigates to home screen on success
        } else {
            setErrorMessage(data.error || 'login failed');
        }
    } catch (error) {
        console.error('network error:', error);
        setErrorMessage('could not connect to the server');
    }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text style={styles.label}>Login or Create an Account! </Text>
                <Text style={styles.label}>Email: </Text>
                <TextInput
                style={styles.input}
                placeholder='enter your email'
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
                />
                <Text style={styles.label}>Password: </Text>
                <TextInput
                style={styles.input}
                placeholder='enter your password'
                value={password}
                onChangeText={setPassword}
                autoCapitalize='none'
                secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NamesScreen')}>
                    <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'pink',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        height: 30,
        width: 175,
        fontSize: 16,
        marginBottom: 16,
        borderRadius: 8,
        textAlign: 'center'
    },
    button: {
        alignItems: 'center',
        backgroundColor: 'mediumspringgreen',
        borderColor:'black',
        borderWidth: 2,
        height: 30,
        width: 150,
        borderRadius: 8,
        marginBottom: 8,
        justifyContent: 'center',
    },
    buttonText: {
        color:'black',
        fontSize: 16,
        fontWeight:'bold',
        textAlign:'center',
    },
    errorText: {
        color:'red',
    }
});

export default LoginScreen