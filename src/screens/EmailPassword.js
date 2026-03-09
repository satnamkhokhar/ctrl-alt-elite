import React, {useState} from 'react';
import {Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import * as validator from 'email-validator';
import {useNavigation, useRoute} from '@react-navigation/native';


function EmailPassword () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();
    const route = useRoute();
    const { firstName, lastName, username } = route.params; // pulls data passed from NameScreen

    //saves the users email, password, and the verification password
    const handleRegistration = () => {
        const isValid = validateForm();
        if (!isValid) return;

        // navigates to DietaryRestrictionsScreen passing all collected data
        navigation.navigate('DietaryRestrictionsScreen', {
            firstName,
            lastName,
            username,
            email,
            password,
        });
    };

    const validateForm = () => {
        //checks if the user responded to every prompt
        if (email.length === 0 || password.length === 0 ) {
            setErrorMessage('please enter a response into every box');
            return false; // stops if fields are empty
        }
        //checks if the email is valid
        if (!validator.validate(email)) {
            setErrorMessage('please enter a valid email address.');
            return false;
        }
        //checks the password to meet the requirements
        if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\W/.test(password)) {
                setErrorMessage('password must have: \n at least 6 characters \n at least one capital letter \n at least one lowercase letter \n at least one special character');
                return false;
        }
        //checks if the password matches the verification password
        if (password !== verifyPassword) {
            setErrorMessage('password must match');
            return false;
        }
        setErrorMessage('');
        return true;
    }

    return (
        <SafeAreaProvider>
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
                <TouchableOpacity style={styles.button} onPress={handleRegistration}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text>: null}
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
        width: 75,
        borderRadius: 8,
        justifyContent: 'center',
    },
    buttonText: {
        color:'black',
        fontSize: 16,
        fontWeight:'bold',
        textAlign:'center',
        justifyContent: 'center'
    },
    errorText: {
        color: 'red',
    },
});

export default EmailPassword