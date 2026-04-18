import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './src/components/UserContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
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
import FriendsScreen from './src/screens/FriendsScreen';
import FriendRequestsScreen from './src/screens/FriendRequestsScreen';
import SearchUsersScreen from './src/screens/SearchUsersScreen';
import OtherUserProfileScreen from './src/screens/OtherUserProfileScreen';
import MatchScreen from './src/screens/MatchScreen';
import UserProfile from './src/screens/UserProfile';
import FavoritesScreen from './src/screens/FavoritesScreen';
import RecentsScreen from './src/screens/RecentsScreen';
import GroupScreen from './src/screens/GroupScreen';

//allows the app to switch screens
const Stack = createNativeStackNavigator();

export default function App() {
    const [initialRoute, setInitialRoute] = useState(null);

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('token');
            setInitialRoute(token ? 'HomeScreen' : 'loginScreen');
        };
        checkToken();
    }, []);

    if (!initialRoute) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f00b0b' }}>
                <ActivityIndicator size="large" color="white" />
            </View>
        );
    }

    return (
      <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
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
            <Stack.Screen name='FriendsScreen' component={FriendsScreen} />
            <Stack.Screen name='FriendRequestsScreen' component={FriendRequestsScreen} />
            <Stack.Screen name='SearchUsersScreen' component={SearchUsersScreen} />
            <Stack.Screen name='OtherUserProfileScreen' component={OtherUserProfileScreen} />
            <Stack.Screen name='MatchScreen' component={MatchScreen} />
            <Stack.Screen name='UserProfile' component={UserProfile} />
            <Stack.Screen name='FavoritesScreen' component={FavoritesScreen} />
            <Stack.Screen name='RecentsScreen' component={RecentsScreen} />
            <Stack.Screen name='GroupScreen' component={GroupScreen} />
        </Stack.Navigator>
    </NavigationContainer>
      </UserProvider>
    );
}
