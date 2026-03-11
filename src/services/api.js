import Constants from 'expo-constants'; // imports Expo constants to get the local IP dynamically

const BASE_URL = `http://${Constants.expoConfig.hostUri.split(':')[0]}:5000`; // builds the base URL using the same IP Expo is running on

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