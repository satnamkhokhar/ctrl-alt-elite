import * as validator from 'email-validator';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


function EmailPassword () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    //saves the users email, password, and the verification password
    const handleRestistration = () => {
        console.log('email:', email);
        console.log('password:', password);
        console.log('password:', verifyPassword);
        validateLogin(); 
    }

    const validateLogin = () => {
        setEmail(email);
        setPassword(password);
        setVerifyPassword(verifyPassword);
        //checks if the user responded to every prompt
        if (email.length === 0 || password.length === 0 ) {
            setErrorMessage('please enter a response into every box')
        }
        //checks if the email is valid
        if (validator.validate(email)) {
            setErrorMessage('');
        } else { return setErrorMessage('please enter a valid email address.');}
   
        //checks the password to meet the requirements
        if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\W/.test(password)) {
                return setErrorMessage('password have: \n at least 6 characters \n at least one capital letter \n at least one lowercase letter \n at least one special character'); 
            } else {setErrorMessage('')}
        
        //checks if the password matches the verification password
        if (password === verifyPassword) {} else {return setErrorMessage('passwords must match')};
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
                <Text style={styles.label}>Email:</Text>
                <TextInput
                style={styles.input}
                placeholder='enter your email'
                value={email}
                onChangeText={setEmail}
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
                <Text style={styles.label}>Verify Password: </Text>
                <TextInput
                style={styles.input}
                placeholder='verify your password'
                value={verifyPassword}
                onChangeText={setVerifyPassword}
                autoCapitalize='none'
                secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleRestistration}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text>: null}
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
        justifyContent:'center'
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
    },
    input: {
        borderWidth: 1,
        borderColor: 'white',
        height: 30,
        width: 175,
        fontSize: 16,
        marginBottom: 16,
        borderRadius: 8,
        textAlign: 'center',
        color: 'white',
    },
    button: {
        alignItems: 'center',
        borderColor:'white',
        borderWidth: 2,
        height: 30,
        width: 75,
        borderRadius: 8,
        justifyContent: 'center',
        marginBottom: 8,
    },
    buttonText: {
        color:'white',
        fontSize: 16,
        fontWeight:'bold',
        textAlign:'center',
        justifyContent: 'center'
    },
    errorText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default EmailPassword