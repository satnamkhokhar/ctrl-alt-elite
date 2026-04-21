import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Checkbox from 'expo-checkbox';
import { updateDietaryRestrictions } from '../services/api';

const BASE_URL = `http://${Constants.expoConfig.hostUri.split(':')[0]}:5001`;
const OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher'];

function EditDietaryRestrictionsScreen({ navigation }) {
    const [restrictions, setRestrictions] = useState(
        Object.fromEntries(OPTIONS.map((o) => [o, false]))
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const res = await fetch(`${BASE_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok && data.dietary_restrictions) {
                    const active = data.dietary_restrictions.split(',').map((s) => s.trim());
                    setRestrictions(Object.fromEntries(OPTIONS.map((o) => [o, active.includes(o)])));
                }
            } catch (_) {
                // leave defaults unchecked
            }
            setIsLoading(false);
        };
        load();
    }, []);

    const toggleCheckbox = (key) => {
        setRestrictions((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setErrorMessage('');
        const selected = OPTIONS.filter((o) => restrictions[o]).join(',');
        const result = await updateDietaryRestrictions(selected);
        if (result.success) {
            navigation.goBack();
        } else {
            setErrorMessage(result.error || 'Failed to save');
            setIsSaving(false);
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
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={require('../../assets/images/return_button.png')} style={styles.backIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.content}>
                    <Text style={styles.title}>Dietary Restrictions</Text>

                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        OPTIONS.map((key) => (
                            <View key={key} style={styles.row}>
                                <Checkbox
                                    value={restrictions[key]}
                                    onValueChange={() => toggleCheckbox(key)}
                                />
                                <Text style={styles.rowText}>{key}</Text>
                            </View>
                        ))
                    )}

                    {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

                    <TouchableOpacity style={styles.button} onPress={handleSave} disabled={isSaving || isLoading}>
                        {isSaving
                            ? <ActivityIndicator color="#f00b0bff" />
                            : <Text style={styles.buttonText}>Save</Text>
                        }
                    </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </SafeAreaProvider>
    );
}

export default EditDietaryRestrictionsScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    header: { paddingHorizontal: 16, paddingTop: 8 },
    backIcon: { width: 36, height: 36 },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 20 },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    rowText: { fontSize: 16, color: 'white', fontWeight: 'bold', marginLeft: 10 },
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
        opacity: 0.45,
    },
    buttonText: { fontSize: 25, fontWeight: 'bold', color: '#f00b0bff', textAlign: 'center' },
    error: { color: 'white', fontWeight: 'bold', marginTop: 10 },
});
