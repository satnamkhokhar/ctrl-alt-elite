import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";

function LoginScreen () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log('email:', email);
        console.log('password:', password);
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
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
        width: 75,
        borderRadius: 8
    },
    buttonText: {
        color:'black',
        fontSize: 16,
        fontWeight:'bold',
        textAlign:'center',
    }
});

export default LoginScreen