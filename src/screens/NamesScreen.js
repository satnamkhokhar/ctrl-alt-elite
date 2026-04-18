import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from '../components/UserContext';

function NamesScreen () {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();
    const { setUserData } = useContext(UserContext);

    //checks if there is a first name, last name, and username entered
    const isNameEntered = firstName.trim().length > 0 && lastName.trim().length > 0 && username.trim().length > 0;

    //saves the users first name, last name, and username
    const handleNames = () => {
        setUserData({ firstName, lastName, username });
        navigation.navigate('EmailPassword');
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
                <Text style={styles.label}>First Name:</Text>
                <TextInput
                style={styles.input}
                placeholder='enter your first name'
                placeholderTextColor="white"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize='none'
                />
                <Text style={styles.label}>Last Name:</Text>
                <TextInput
                style={styles.input}
                placeholder='enter your last name'
                placeholderTextColor="white"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize='none'
                />
                <Text style={styles.label}>Username:</Text>
                <TextInput
                style={styles.input}
                placeholder='enter your username'
                placeholderTextColor="white"
                value={username}
                onChangeText={setUsername}
                // switch the onChangeText when the backend is connected to be
                // onChangeText={handleChangeText}
                autoCapitalize='none'
                />
                <Text style={styles.font}>Enter your information into all of the boxes to proceed</Text>
                {isNameEntered && (
                <TouchableOpacity style={styles.button} onPress={() => handleNames()} testID="Next">
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
                )}
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
    font: {
        fontSize: 9,
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
        borderColor:'white',
        borderWidth: 2,
        height: 30,
        width: 75,
        borderRadius: 8,
        marginBottom: 8,
        marginTop: 8,
        justifyContent: 'center',
        color: 'white',
    },
    buttonText: {
        color:'white',
        fontSize: 16,
        fontWeight:'bold',
        textAlign:'center',
    },
});

export default NamesScreen

/* checks if the username is taken, should work after
we connect the frontend and backend but i can't test it until we connect
    
    //const [availabilityMessage, setAvailabiltyMessage] = useState('');
    //const [isTaken, setIsTaken] = useState(false);

    const checkUsernameAvailability = async (inputUsername) => {
        try {
            const response = await fetch('backend URL {inputUsername}');
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