import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Switch } from 'react-native';

const ALL = ['Vegetarian','Vegan','Gluten-Free','Dairy-Free'];

export default function ProfileStep({ state, updateState, setStep }) {
  const toggle = (item) => {
    const list = state.restrictions.includes(item)
      ? state.restrictions.filter(r => r !== item)
      : [...state.restrictions, item];

    updateState({ restrictions: list });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Username</Text>
      <TextInput
        placeholder="Enter name"
        value={state.userName}
        onChangeText={(text) => updateState({ userName: text })}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <FlatList
        data={ALL}
        keyExtractor={(i) => i}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{item}</Text>
            <Switch
              value={state.restrictions.includes(item)}
              onValueChange={() => toggle(item)}
            />
          </View>
        )}
      />

      <TouchableOpacity onPress={() => setStep('sessionChoice')}>
        <Text>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
