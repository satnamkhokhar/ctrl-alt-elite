import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';

import ProfileStep from '../components/ProfileStep';
import SessionChoiceStep from '../components/SessionChoiceStep';
import LobbyStep from '../components/LobbyStep';
import VotingStep from '../components/VotingStep';
import WinnerStep from '../components/WinnerStep';

const STEP_COMPONENTS = {
  profile: ProfileStep,
  sessionChoice: SessionChoiceStep,
  lobby: LobbyStep,
  voting: VotingStep,
  winner: WinnerStep,
};

export default function SessionScreen() {
  const [step, setStep] = useState('profile');

  const [state, setState] = useState({
    userName: '',
    restrictions: [],
    sessionCode: '',
    restaurants: [],
    currentIndex: 0,
    round: 1,
    winner: null,
  });

  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const CurrentStep = STEP_COMPONENTS[step];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CurrentStep
        state={state}
        setStep={setStep}
        updateState={updateState}
      />
    </SafeAreaView>
  );
}
