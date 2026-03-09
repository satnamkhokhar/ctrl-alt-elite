import React, {useState} from 'react';
import {Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from '@react-navigation/native';

function NamesScreen () {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();

    //checks if there is a first name, last name, and username entered
    const isNameEntered = firstName.trim().length > 0 && lastName.trim().length > 0 && username.trim().length > 0;

    //saves the users first name, last name, and username
    const handleNames = () => {
        console.log('firstName', firstName);
        console.log('lastName:', lastName);
        console.log('username', username);
        
        //moves to the next screen
        navigation.navigate('EmailPassword', {firstName, lastName, username});
    }

/* checks if the username is taken, should work after
we connect the frontend and backend but i can't test it until we connect
    
    //const [availabilityMessage, setAvailabiltyMessage] = useState('');
    //const [isTaken, setIsTaken] = useState(false);

    const checkUsernameAvailability = async (inputUsername) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/auth/check-username/${inputUsername}');
            const data = await response.json();

            setIsTaken(data.isTaken);
            setAvailabiltyMessage(data.message);
        } catch (error) {
            console.error('error checking username:', error);
            setAvailabilityMessage('error checking availability');
        }
        }

    const handleChangeText = (text) => {
        setUsername(text);
        checkUsernameAvailability(text);
        }

    }
*/
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text style={styles.label}>First Name:</Text>
                <TextInput
                style={styles.input}
                placeholder='enter your first name'
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize='none'
                />
                <Text style={styles.label}>Last Name:</Text>
                <TextInput
                style={styles.input}
                placeholder='enter your last name'
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize='none'
                />
                <Text style={styles.label}>Username:</Text>
                <TextInput
                style={styles.input}
                placeholder='enter your username'
                value={username}
                onChangeText={setUsername}
                // switch the onChangeText when the backend is connected to be
                // onChangeText={handleChangeText}
                autoCapitalize='none'
                />
                <Text style={styles.font}>Enter your information into all of the boxes to proceed</Text>
                {isNameEntered && (
                <TouchableOpacity style={styles.button} onPress={() => handleNames()}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
                )}
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
    font: {
        fontSize: 9,
        textAlign: 'center'
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
        marginBottom: 8,
        marginTop: 8,
        justifyContent: 'center',
    },
    buttonText: {
        color:'black',
        fontSize: 16,
        fontWeight:'bold',
        textAlign:'center',
    },
});

export default NamesScreen