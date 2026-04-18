import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getFriendshipStatus, sendFriendRequest, unfriend, acceptFriendRequest } from '../services/api';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = `http://${Constants.expoConfig.hostUri.split(':')[0]}:5001`;

function OtherUserProfileScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { userId } = route.params;

    const [profile, setProfile] = useState(null);
    const [friendStatus, setFriendStatus] = useState(null);
    const [friendshipId, setFriendshipId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadProfile();
    }, [userId]);

    const loadProfile = async () => {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('token');

        try {
            const response = await fetch(`${BASE_URL}/users/${userId}/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (response.ok) setProfile(data);
        } catch (e) {
            Alert.alert('Error', 'Could not load profile');
        }

        const statusResult = await getFriendshipStatus(userId);
        if (statusResult.success) {
            setFriendStatus(statusResult.data.status);
            setFriendshipId(statusResult.data.friendship_id || null);
        }

        setIsLoading(false);
    };

    const handleFriendAction = async () => {
        setActionLoading(true);

        if (friendStatus === 'none') {
            const result = await sendFriendRequest(userId);
            if (result.success) {
                setFriendStatus('request_sent');
                setFriendshipId(result.data.friendship_id);
            } else {
                Alert.alert('Error', result.error);
            }
        } else if (friendStatus === 'request_received') {
            const result = await acceptFriendRequest(friendshipId);
            if (result.success) {
                setFriendStatus('friends');
            } else {
                Alert.alert('Error', result.error);
            }
        } else if (friendStatus === 'friends') {
            Alert.alert(
                'Unfriend',
                `Remove ${profile?.first_name} from your friends?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Unfriend',
                        style: 'destructive',
                        onPress: async () => {
                            const result = await unfriend(userId);
                            if (result.success) {
                                setFriendStatus('none');
                                setFriendshipId(null);
                            } else {
                                Alert.alert('Error', result.error);
                            }
                        },
                    },
                ]
            );
        }

        setActionLoading(false);
    };

    const getFriendButtonLabel = () => {
        if (friendStatus === 'friends') return 'Friends ✓';
        if (friendStatus === 'request_sent') return 'Request Sent';
        if (friendStatus === 'request_received') return 'Accept Request';
        return 'Add Friend';
    };

    const isFriendButtonDisabled = () => {
        return friendStatus === 'request_sent' || actionLoading;
    };

    return (
        <SafeAreaProvider>
            <LinearGradient
                colors={['#f00b0bff', '#c76d18ff']}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <SafeAreaView style={styles.inner}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>

                    {isLoading ? (
                        <ActivityIndicator size="large" color="white" style={styles.loader} />
                    ) : profile ? (
                        <View style={styles.profileCard}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {profile.first_name?.[0]}{profile.last_name?.[0]}
                                </Text>
                            </View>

                            <Text style={styles.fullName}>{profile.first_name} {profile.last_name}</Text>
                            <Text style={styles.username}>@{profile.username}</Text>

                            <TouchableOpacity
                                style={[
                                    styles.friendButton,
                                    friendStatus === 'friends' && styles.friendButtonActive,
                                    isFriendButtonDisabled() && styles.friendButtonDisabled,
                                ]}
                                onPress={handleFriendAction}
                                disabled={isFriendButtonDisabled()}
                            >
                                <Text style={styles.friendButtonText}>
                                    {actionLoading ? '...' : getFriendButtonLabel()}
                                </Text>
                            </TouchableOpacity>
                            {friendStatus === 'friends' && (
                                <Text style={styles.unfriendHint}>Tap to unfriend</Text>
                            )}

                            {profile.favorite_restaurants && profile.favorite_restaurants.length > 0 && (
                                <View style={styles.favoritesSection}>
                                    <Text style={styles.sectionTitle}>Favorite Restaurants</Text>
                                    {profile.favorite_restaurants.map((r) => (
                                        <Text key={r.restaurant_id} style={styles.restaurantItem}>
                                            • {r.name}
                                        </Text>
                                    ))}
                                </View>
                            )}
                        </View>
                    ) : (
                        <Text style={styles.errorText}>Could not load profile.</Text>
                    )}
                </SafeAreaView>
            </LinearGradient>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    backButton: {
        marginBottom: 20,
    },
    backText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loader: {
        marginTop: 60,
    },
    profileCard: {
        alignItems: 'center',
        paddingTop: 20,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: 'white',
    },
    avatarText: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
    },
    fullName: {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    username: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
        marginBottom: 24,
    },
    friendButton: {
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 32,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 30,
    },
    friendButtonActive: {
        backgroundColor: 'white',
    },
    friendButtonDisabled: {
        opacity: 0.6,
    },
    unfriendHint: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        marginTop: 6,
        marginBottom: 24,
    },
    friendButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    favoritesSection: {
        alignSelf: 'stretch',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 8,
        padding: 14,
    },
    sectionTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
    },
    restaurantItem: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        marginBottom: 4,
    },
    errorText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 60,
        fontSize: 16,
    },
});

export default OtherUserProfileScreen;
