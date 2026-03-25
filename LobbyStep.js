import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';

export default function LobbyStep({ state, updateState, setStep }) {
  const [input, setInput] = useState('');

  const addRestaurant = () => {
    if (!input) return;

    const newList = [
      ...state.restaurants,
      { name: input, votes: 0 }
    ];

    updateState({ restaurants: newList });
    setInput('');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Session Code: {state.sessionCode}</Text>

      <TextInput
        placeholder="Restaurant"
        value={input}
        onChangeText={setInput}
        style={{ borderWidth: 1 }}
      />

      <TouchableOpacity onPress={addRestaurant}>
        <Text>Add</Text>
      </TouchableOpacity>

      <FlatList
        data={state.restaurants}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />

      <TouchableOpacity onPress={() => setStep('voting')}>
        <Text>Start Voting</Text>
      </TouchableOpacity>
    </View>
  );
}
