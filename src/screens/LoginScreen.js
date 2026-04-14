import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
//import { useUser } from '../components/useUser';


function LoginScreen () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const [message, setMessage] = useState('');
    const [isTaken, setIsTaken] = useState(false);
    
    //const { login } = useUser()

    //saves the login info
    const handleLogin = () => {
        console.log('email:', email);
        console.log('password:', password);
    /*
        try {
            await login(email, password)
        } catch (error) {

        }
    */
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
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomeScreen')} testID="loginButton">
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NamesScreen')} testID="createAccountButton">
                    <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
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
        borderColor:'white',
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
        color:'red',
        fontSize: 16,
        fontWeight:'bold',
        textAlign:'center',
    },
    DineSync: {
        fontSize: 75,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'white',
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
