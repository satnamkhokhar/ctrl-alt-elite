import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import DietaryRestrictionsSelector from './DietaryRestrictionsSelector';

export default function ProfileStep({ state, updateState, setStep }) {

  const toggleRestriction = (item) => {
    const updated = state.restrictions.includes(item)
      ? state.restrictions.filter(r => r !== item)
      : [...state.restrictions, item];

    updateState({ restrictions: updated });
  };

  const handleSave = () => {
    if (!state.userName.trim()) {
      alert('Please enter a username');
      return;
    }

    setStep('sessionChoice');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Profile</Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={state.userName}
        onChangeText={(text) => updateState({ userName: text })}
      />

      <Text style={styles.label}>Dietary Restrictions</Text>

      <DietaryRestrictionsSelector
        selected={state.restrictions}
        onToggle={toggleRestriction}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
