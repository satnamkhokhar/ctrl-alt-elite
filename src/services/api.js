import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants'; // imports Expo constants to get the local IP dynamically

const BASE_URL = `http://${Constants.expoConfig.hostUri.split(':')[0]}:5001`; // builds the base URL using the same IP Expo is running on

export const loginUser = async (email, password) => { // handles the login fetch call
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // tells the backend we are sending JSON
            },
            body: JSON.stringify({ email, password }), // sends email and password as JSON
        });

        const data = await response.json(); // reads the JSON response

        if (response.ok) {
            return { success: true, token: data.access_token }; // returns the token on success
        } else {
            return { success: false, error: data.error || 'login failed' }; // returns the error message on failure
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' }; // returns error if server is unreachable
    }
};

export const registerUser = async (userData) => { // handles the registration fetch call
    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData), // sends all registration data as JSON
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true }; // returns success on 201
        } else {
            return { success: false, error: data.error || 'registration failed' }; // returns error on failure
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};
export const fetchRestaurants = async (searchData) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await fetch(`${BASE_URL}/restaurants/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(searchData),
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, restaurants: data };
        } else {
            return { success: false, error: data.error || 'failed to fetch restaurants' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};

export const castVote = async (sessionId, restaurantId, userId, voteValue) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await fetch(`${BASE_URL}/votes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                session_id: sessionId,
                restaurant_id: restaurantId,
                user_id: userId,
                vote_value: voteValue,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.error || 'failed to cast vote' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};

export const checkSessionStatus = async (sessionId) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await fetch(`${BASE_URL}/votes/session/${sessionId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.error || 'failed to check session status' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};

export const finalizeSession = async (sessionId) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await fetch(`${BASE_URL}/votes/session/${sessionId}/finalize`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.error || 'failed to finalize session' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};