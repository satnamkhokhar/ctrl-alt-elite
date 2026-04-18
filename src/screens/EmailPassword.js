import * as validator from 'email-validator';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../components/UserContext';

function EmailPassword() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();
    const { userData } = useContext(UserContext);

    const handleNext = () => {
        if (email.length === 0 || password.length === 0) {
            return setErrorMessage('Please enter a response into every box.');
        }
        if (!validator.validate(email)) {
            return setErrorMessage('Please enter a valid email address.');
        }
        if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\W/.test(password)) {
            return setErrorMessage('Password must have:\n at least 6 characters\n one capital letter\n one lowercase letter\n one special character');
        }
        if (password !== verifyPassword) {
            return setErrorMessage('Passwords must match.');
        }

        setErrorMessage('');
        navigation.navigate('DietaryRestrictionsScreen', {
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username,
            email,
            password,
        });
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
                    <Text style={styles.label}>Email:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='enter your email'
                        placeholderTextColor="white"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize='none'
                        keyboardType='email-address'
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
                    <Text style={styles.label}>Verify Password: </Text>
                    <TextInput
                        style={styles.input}
                        placeholder='verify your password'
                        placeholderTextColor="white"
                        value={verifyPassword}
                        onChangeText={setVerifyPassword}
                        autoCapitalize='none'
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.button} onPress={handleNext}>
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
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
        height: 40,
        width: 200,
        fontSize: 16,
        marginBottom: 16,
        borderRadius: 8,
        textAlign: 'center',
        color: 'white',
    },
    button: {
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2,
        height: 30,
        width: 75,
        borderRadius: 8,
        justifyContent: 'center',
        marginBottom: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    errorText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 8,
    },
});

export default EmailPassword;
