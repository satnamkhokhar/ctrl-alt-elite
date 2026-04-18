import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants'; // imports Expo constants to get the local IP dynamically

const BASE_URL = `http://${Constants.expoConfig.hostUri.split(':')[0]}:5001`; // builds the base URL using the same IP Expo is running on

export const clearSession = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
};

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
            return { success: true, token: data.access_token, userId: data.user_id }; // returns the token on success
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

// Get session details including member list
export const getSessionDetails = async (sessionId) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await fetch(`${BASE_URL}/sessions/${sessionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
        return { success: true, data }; // Returns: {session_id, budget, max_distance, active_users, members, created_at }
        } else {
            return { success: false, error: data.error || 'failed to fetch session details' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};

export const joinSession = async (sessionId) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await fetch(`${BASE_URL}/sessions/${sessionId}/join`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.error || 'failed to join session' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};

export const startSession = async (sessionId) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await fetch(`${BASE_URL}/sessions/${sessionId}/start`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.error || 'failed to start session' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};

export const createSession = async (budget, maxDistance) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await fetch(`${BASE_URL}/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ budget, max_distance: maxDistance }),
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.error || data.msg || 'failed to create session' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};

// Search users by name or username
export const searchUsers = async (query) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/users/search?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.error || 'failed to search users' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};

export const sendFriendRequest = async (receiverId) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/friends/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ receiver_id: receiverId }),
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.error || 'failed to send friend request' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};

export const acceptFriendRequest = async (friendshipId) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/friends/accept/${friendshipId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.error || 'failed to accept friend request' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};

export const declineFriendRequest = async (friendshipId) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/friends/decline/${friendshipId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.error || 'failed to decline friend request' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};

export const unfriend = async (friendId) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/friends/${friendId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.error || 'failed to unfriend' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};

export const getFriends = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/friends`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.error || 'failed to get friends' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};

export const getFriendRequests = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/friends/requests`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.error || 'failed to get friend requests' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};

export const storeSessionRestaurants = async (sessionId, restaurantIds) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/sessions/${sessionId}/restaurants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ restaurant_ids: restaurantIds }),
        });
        const data = await response.json();
        return response.ok ? { success: true, data } : { success: false, error: data.error };
    } catch (error) {
        return { success: false, error: 'could not connect to server' };
    }
};

export const getSessionRestaurants = async (sessionId) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/sessions/${sessionId}/restaurants`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        return response.ok ? { success: true, data } : { success: false, error: data.error };
    } catch (error) {
        return { success: false, error: 'could not connect to server' };
    }
};

export const getGroups = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/groups`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, groups: data };
        } else {
            return { success: false, error: data.error || 'failed to get groups' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};

export const createGroup = async (groupName, userIds) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/groups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ group_name: groupName, user_ids: userIds }),
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.error || 'failed to create group' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};

export const deleteGroup = async (groupId) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/groups/${groupId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, error: data.error || 'failed to delete group' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};

export const getFavorites = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/users/me`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, favorites: data.favorite_restaurants };
        } else {
            return { success: false, error: data.error || 'failed to get favorites' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};

export const addFavorite = async (restaurantId) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/users/me/favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ restaurant_id: restaurantId }),
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, error: data.error || 'failed to add favorite' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};

export const removeFavorite = async (restaurantId) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/users/me/favorites/${restaurantId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, error: data.error || 'failed to remove favorite' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};

export const getFriendshipStatus = async (userId) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/friends/status/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.error || 'failed to get friendship status' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};

// Get user details by user ID (for displaying participant names)
export const getUserDetails = async (userId) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await fetch(`${BASE_URL}/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data }; // Returns { user_id, username, first_name, last_name, email }
        } else {
            return { success: false, error: data.error || 'failed to fetch user details' };
        }
    } catch (error) {
        console.error('network error:', error);
        return { success: false, error: 'could not connect to server' };
    }
};