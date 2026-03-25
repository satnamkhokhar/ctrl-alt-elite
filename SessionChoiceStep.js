import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function SessionChoiceStep({ setStep, updateState }) {
  const [code, setCode] = useState('');

  const createSession = () => {
    const generated = Math.random().toString(36).substring(2, 8).toUpperCase();
    updateState({ sessionCode: generated });
    setStep('lobby');
  };

  const joinSession = () => {
    updateState({ sessionCode: code });
    setStep('lobby');
  };

  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity onPress={createSession}>
        <Text>Create Session</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Enter code"
        value={code}
        onChangeText={setCode}
        style={{ borderWidth: 1 }}
      />

      <TouchableOpacity onPress={joinSession}>
        <Text>Join Session</Text>
      </TouchableOpacity>
    </View>
  );
}
