import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SessionChoiceStep({ state, setStep, updateState }) {
  const [budget, setBudget] = useState('');
  const [maxDistance, setMaxDistance] = useState('');
  const [error, setError] = useState('');

  const createSession = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');

      //REPLACE WITH ACTUAL IP
      const response = await fetch('http://YOUR_IP:5000/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          budget,
          max_distance: maxDistance,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        updateState({ sessionCode: data.session_id });
        setStep('lobby');
      } else {
        setError(data.message || 'Failed to create session');
      }
    } catch {
      setError('Network error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create or Join Session</Text>

      <TextInput
        style={styles.input}
        placeholder="Budget"
        value={budget}
        onChangeText={setBudget}
      />

      <TextInput
        style={styles.input}
        placeholder="Max Distance"
        value={maxDistance}
        onChangeText={setMaxDistance}
      />

      <TouchableOpacity style={styles.button} onPress={createSession}>
        <Text>Create Session</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setStep('lobby')}>
        <Text>Join Session</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink' },
  title: { fontSize: 20, marginBottom: 20 },
  input: { width: 200, borderWidth: 1, marginBottom: 10, padding: 5, backgroundColor: 'white' },
  button: { backgroundColor: 'mediumspringgreen', borderWidth: 2, padding: 10, marginTop: 10 },
  error: { color: 'red', marginTop: 10 },
});
