import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { acceptFriendRequest, getFriendshipStatus, sendFriendRequest, unfriend } from '../services/api';

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

    const isFriendButtonDisabled = () => friendStatus === 'request_sent' || actionLoading;

    const renderRestaurantCard = (item) => (
        <View style={styles.card} key={String(item.restaurant_id)}>
            <Image source={require('../../assets/images/cuisine.png')} style={styles.cardIcon} />
            <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
        </View>
    );

    return (
        <SafeAreaProvider>
            <LinearGradient
                colors={['#f00b0bff', '#c76d18ff']}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <SafeAreaView style={styles.inner}>

                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={require('../../assets/images/return_button.png')} style={styles.headerIcon} />
                        </TouchableOpacity>
                        <Text style={styles.title}>DineSync</Text>
                        <View style={styles.headerIcon} />
                    </View>

                    {isLoading ? (
                        <ActivityIndicator size="large" color="white" style={styles.loader} />
                    ) : profile ? (
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                            {/* Profile */}
                            <View style={styles.profileSection}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        {profile.first_name?.[0]}{profile.last_name?.[0]}
                                    </Text>
                                </View>
                                <Text style={styles.name}>{profile.first_name} {profile.last_name}</Text>
                                <Text style={styles.username}>@{profile.username}</Text>

                                {/* Friend button */}
                                <TouchableOpacity
                                    style={[
                                        styles.friendButton,
                                        friendStatus === 'friends' && styles.friendButtonActive,
                                        isFriendButtonDisabled() && styles.friendButtonDisabled,
                                    ]}
                                    onPress={handleFriendAction}
                                    disabled={isFriendButtonDisabled()}
                                >
                                    <Text style={[styles.friendButtonText, friendStatus === 'friends' && styles.friendButtonTextActive]}>
                                        {actionLoading ? '...' : getFriendButtonLabel()}
                                    </Text>
                                </TouchableOpacity>
                                {friendStatus === 'friends' && (
                                    <Text style={styles.unfriendHint}>Tap to unfriend</Text>
                                )}
                            </View>

                            {/* Favorites */}
                            {profile.favorite_restaurants && profile.favorite_restaurants.length > 0 && (
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <Image source={require('../../assets/images/heart.png')} style={styles.sectionIcon} />
                                        <Text style={styles.sectionLabel}>favorites</Text>
                                    </View>
                                    <View style={styles.grid}>
                                        {profile.favorite_restaurants.slice(0, 3).map(renderRestaurantCard)}
                                    </View>
                                </View>
                            )}

                            {/* Recents */}
                            {profile.recent_restaurants && profile.recent_restaurants.length > 0 && (
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <Image source={require('../../assets/images/clock.png')} style={styles.sectionIcon} />
                                        <Text style={styles.sectionLabel}>recent</Text>
                                    </View>
                                    <View style={styles.grid}>
                                        {profile.recent_restaurants.slice(0, 3).map(renderRestaurantCard)}
                                    </View>
                                </View>
                            )}

                        </ScrollView>
                    ) : (
                        <Text style={styles.errorText}>Could not load profile.</Text>
                    )}

                    {/* Bottom nav */}
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={() => navigation.navigate('FriendsScreen')}>
                            <Image source={require('../../assets/images/star.png')} style={styles.footerIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                            <Image source={require('../../assets/images/house.png')} style={styles.footerIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('GroupScreen')}>
                            <Image source={require('../../assets/images/group.png')} style={styles.footerIconLarge} />
                        </TouchableOpacity>
                    </View>

                </SafeAreaView>
            </LinearGradient>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    inner: { flex: 1, paddingHorizontal: 20 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'white',
    },
    headerIcon: { width: 36, height: 36 },
    loader: { marginTop: 60 },
    scrollContent: { paddingBottom: 16 },
    profileSection: {
        alignItems: 'center',
        marginVertical: 20,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'white',
    },
    avatarText: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    username: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.85)',
        marginBottom: 16,
    },
    friendButton: {
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 32,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    friendButtonActive: { backgroundColor: 'white' },
    friendButtonDisabled: { opacity: 0.6 },
    friendButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    friendButtonTextActive: { color: '#f00b0bff' },
    unfriendHint: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        marginTop: 6,
    },
    section: { marginBottom: 20 },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionIcon: { width: 20, height: 20, marginRight: 6 },
    sectionLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    card: {
        width: '30.5%',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
        padding: 8,
        alignItems: 'center',
    },
    cardIcon: { width: 40, height: 40, marginBottom: 6 },
    cardName: {
        fontSize: 11,
        color: 'white',
        textAlign: 'center',
        fontWeight: '500',
    },
    errorText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 60,
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
    },
    footerIcon: { width: 50, height: 50 },
    footerIconLarge: { width: 70, height: 70 },
});

export default OtherUserProfileScreen;
