import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Checkbox from 'expo-checkbox';
import { registerUser } from '../services/api';

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

        const result = await registerUser({
            first_name: firstName,
            last_name: lastName,
            username,
            email,
            password,
            dietary_restrictions: selected,
        });

        if (result.success) {
            navigation.navigate('HomeScreen');
        } else {
            setErrorMessage(result.error || 'Registration failed');
        }
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
                    <Text style={styles.title}>Select Dietary Restrictions</Text>

                    {Object.keys(restrictions).map((key) => (
                        <View key={key} style={styles.row}>
                            <Checkbox
                                value={restrictions[key]}
                                onValueChange={() => toggleCheckbox(key)}
                            />
                            <Text style={styles.rowText}>{key}</Text>
                        </View>
                    ))}

                    {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={styles.buttonText}>Finish Registration</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </LinearGradient>
        </SafeAreaProvider>
    );
}

export default DietaryRestrictionsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 20 },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    rowText: { fontSize: 16, color: 'white', fontWeight: 'bold' },
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
    buttonText: { fontSize: 25, fontWeight: 'bold', color: '#f00b0bff', textAlign: 'center' },
    error: { color: 'white', fontWeight: 'bold', marginTop: 10 },
});
