import React, {useState} from 'react';
import {Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from '@react-navigation/native';


function LoginScreen () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const [message, setMessage] = useState('');
    const [isTaken, setIsTaken] = useState(false);
    
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
    //saves the login info
    const handleLogin = () => {
        console.log('email:', email);
        console.log('password:', password);
    }

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
        justifyContent:'center'
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
    }
});

export default LoginScreen