import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { loginUser } from '../services/api';


function LoginScreen () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const [message, setMessage] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            return setMessage('please enter your email and password');
        }

        const result = await loginUser(email, password);

        if (result.success) {
            await AsyncStorage.setItem('token', result.token);
            await AsyncStorage.setItem('user_id', result.userId.toString());
            navigation.navigate('HomeScreen');
        } else {
            setMessage(result.error);
        }
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
                <Text style={styles.DineSync}>{'\n'}DineSync</Text>
                <Text style={styles.label}>Login or Create an Account!{'\n\n'}</Text>
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
                <TouchableOpacity style={styles.button} onPress={handleLogin} testID="loginButton">
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NamesScreen')} testID="createAccountButton">
                    <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
                {message ? <Text style={styles.errorText}>{message}</Text> : null}
            </SafeAreaView>
            </LinearGradient>
        </SafeAreaProvider>
    );
}

//change the create account button to go back to names screen
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
        height: 30,
        width: 175,
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
    DineSync: {
        fontSize: 75,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'white',
    },
    errorText: {
        color: 'white',
        fontWeight: 'bold',
        marginTop: 8,
        textAlign: 'center',
    },
});

export default LoginScreen

/* checks if the login info exist in our database, should work after
we connect the frontend and backend but i can't test it until we connect

    const loginUser = async (email, password) => {
        try {
            const response = await fetch('backend URL', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('login successful token:', data.access_token);
            return data;
        } else {
            console.error('Login failed:', data.error);
            return null;
        }
    } catch (error) {
        console.error('network error:', error);
        return null;
    }
    };
*/
