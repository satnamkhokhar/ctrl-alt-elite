import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

export default function VotingStep({ state, updateState, setStep }) {
  const current = state.restaurants[state.currentIndex];

  const vote = (type) => {
    const list = [...state.restaurants];

    if (type === 'yes') {
      list[state.currentIndex].votes++;
    }

    const next = state.currentIndex + 1;

    if (next < list.length) {
      updateState({ restaurants: list, currentIndex: next });
    } else {
      finish(list);
    }
  };

  const finish = (list) => {
    const max = Math.max(...list.map(r => r.votes));
    const winners = list.filter(r => r.votes === max);

    if (winners.length === 1) {
      updateState({ winner: winners[0] });
      setStep('winner');
    } else {
      Alert.alert('Tie - new round');
      updateState({
        restaurants: winners.map(r => ({ ...r, votes: 0 })),
        currentIndex: 0,
        round: state.round + 1
      });
    }
  };

  if (!current) return <Text>No restaurants</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text>{current.name}</Text>

      <TouchableOpacity onPress={() => vote('no')}>
        <Text>No</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => vote('yes')}>
        <Text>Yes</Text>
      </TouchableOpacity>
    </View>
  );
}
