import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DietaryRestrictionsScreen from './src/screens/DietaryRestrictionsScreen';
import EmailPassword from './src/screens/EmailPassword';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import NamesScreen from './src/screens/NamesScreen';
import JoinSessionScreen from './src/screens/JoinSessionScreen';
import SessionLobbyScreen from "./src/screens/SessionLobbyScreen";
import SessionScreen from './src/screens/SessionScreen';
import SwipeCardScreensScreen from './src/screens/SwipeCardScreen';
import WaitingScreen from './src/screens/WaitingScreen';

//allows the app to switch screens
const Stack = createNativeStackNavigator();

export default function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='loginScreen'>
            <Stack.Screen name='loginScreen' component={LoginScreen} />
            <Stack.Screen name='NamesScreen' component={NamesScreen} />
            <Stack.Screen name='EmailPassword' component={EmailPassword}/>
            <Stack.Screen name='HomeScreen' component={HomeScreen} />
            <Stack.Screen name='DietaryRestrictionsScreen' component={DietaryRestrictionsScreen} />
            <Stack.Screen name='SwipeCardScreen' component={SwipeCardScreensScreen} />
            <Stack.Screen name='WaitingScreen' component={WaitingScreen} />
            <Stack.Screen name='SessionLobbyScreen' component={SessionLobbyScreen} />
            <Stack.Screen name='SessionScreen' component={SessionScreen} />
            <Stack.Screen name='JoinSessionScreen' component={JoinSessionScreen} />
        </Stack.Navigator>
    </NavigationContainer>   
    );
}
