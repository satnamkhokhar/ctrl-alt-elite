import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function WinnerStep({ state, setStep, updateState }) {
  const reset = () => {
    updateState({
      userName: '',
      restrictions: [],
      sessionCode: '',
      restaurants: [],
      currentIndex: 0,
      round: 1,
      winner: null,
    });
    setStep('profile');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Winner:</Text>
      <Text>{state.winner?.name}</Text>

      <TouchableOpacity onPress={reset}>
        <Text>Restart</Text>
      </TouchableOpacity>
    </View>
  );
}
