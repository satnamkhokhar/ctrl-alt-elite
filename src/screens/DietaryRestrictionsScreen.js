import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import CheckBox from '@react-native-community/checkbox';

function DietaryRestrictionsScreen({ navigation, route }) {
    const { firstName, lastName, username, email, password } = route.params;

    const [restrictions, setRestrictions] = useState({
        Vegetarian: false,
        Vegan: false,
        "Gluten-Free": false,
        Halal: false,
        Kosher: false,
    });

    const [errorMessage, setErrorMessage] = useState('');

    const toggleCheckbox = (key) => {
        setRestrictions({
            ...restrictions,
            [key]: !restrictions[key],
        });
    };

    const handleRegister = async () => {
        const selected = Object.keys(restrictions)
            .filter((key) => restrictions[key])
            .join(",");

        try {
            const response = await fetch('http://YOUR_IP:5000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    username,
                    email,
                    password,
                    dietary_restrictions: selected,
                }),
            });

            const data = await response.json();

            if (response.status === 201) {
                navigation.navigate('LoginScreen');
            } else {
                setErrorMessage(data.message || 'Registration failed');
            }
        } catch {
            setErrorMessage('Network error');
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Select Dietary Restrictions</Text>

                {Object.keys(restrictions).map((key) => (
                    <View key={key} style={styles.row}>
                        <CheckBox
                            value={restrictions[key]}
                            onValueChange={() => toggleCheckbox(key)}
                        />
                        <Text>{key}</Text>
                    </View>
                ))}

                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text>Finish Registration</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

export default DietaryRestrictionsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'pink',
    },
    title: { fontSize: 20, marginBottom: 20 },
    row: { flexDirection: 'row', marginBottom: 10 },
    button: {
        marginTop: 20,
        backgroundColor: 'mediumspringgreen',
        borderWidth: 2,
        padding: 10,
    },
    error: { color: 'red', marginTop: 10 },
});
