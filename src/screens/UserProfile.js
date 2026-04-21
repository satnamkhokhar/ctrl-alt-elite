import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from '../components/UserContext';
import { useUser } from '../components/useUser';
import { getFavorites, getUserDetails } from '../services/api';

function UserProfile() {
    const { userData, setUserData } = useContext(UserContext);
    const { logout } = useUser();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(!userData.firstName);
    const [favorites, setFavorites] = useState([]);
    const [recents, setRecents] = useState([]);

    useEffect(() => {
        const init = async () => {
            if (!userData.firstName) {
                const userId = await AsyncStorage.getItem('userId');
                if (userId) {
                    const result = await getUserDetails(userId);
                    if (result.success) {
                        setUserData({
                            firstName: result.data.first_name,
                            lastName: result.data.last_name,
                            userName: result.data.username,
                        });
                    }
                }
                setLoading(false);
            }

            const favResult = await getFavorites();
            if (favResult.success) setFavorites(favResult.favorites || []);

            const raw = await AsyncStorage.getItem('recent_restaurants');
            if (raw) setRecents(JSON.parse(raw));
        };
        init();
    }, []);

    const signout = () => {
        logout();
        navigation.navigate('loginScreen');
    };

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
                        <TouchableOpacity onPress={() => navigation.navigate('EditDietaryRestrictionsScreen')}>
                            <Image source={require('../../assets/images/profile.png')} style={styles.headerIcon} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                        {/* Profile */}
                        <View style={styles.profileSection}>
                            <Image source={require('../../assets/images/profilepic.png')} style={styles.profilepic} />
                            {loading ? (
                                <ActivityIndicator color="white" style={{ marginTop: 8 }} />
                            ) : (
                                <>
                                    <Text style={styles.name}>{userData.firstName} {userData.lastName}</Text>
                                    <Text style={styles.username}>@{userData.userName}</Text>
                                </>
                            )}
                        </View>

                        {/* Favorites */}
                        <View style={styles.section}>
                            <TouchableOpacity style={styles.sectionHeader} onPress={() => navigation.navigate('FavoritesScreen')}>
                                <Image source={require('../../assets/images/heart.png')} style={styles.sectionIcon} />
                                <Text style={styles.sectionLabel}>favorites</Text>
                                {favorites.length > 3 && <Text style={styles.seeAll}>See all →</Text>}
                            </TouchableOpacity>
                            {favorites.length === 0 ? (
                                <Text style={styles.emptyText}>No favorites yet.</Text>
                            ) : (
                                <View style={styles.grid}>
                                    {favorites.slice(0, 3).map(renderRestaurantCard)}
                                </View>
                            )}
                        </View>

                        {/* Recents */}
                        <View style={styles.section}>
                            <TouchableOpacity style={styles.sectionHeader} onPress={() => navigation.navigate('RecentsScreen')}>
                                <Image source={require('../../assets/images/clock.png')} style={styles.sectionIcon} />
                                <Text style={styles.sectionLabel}>recent</Text>
                                {recents.length > 3 && <Text style={styles.seeAll}>See all →</Text>}
                            </TouchableOpacity>
                            {recents.length === 0 ? (
                                <Text style={styles.emptyText}>No recent restaurants yet.</Text>
                            ) : (
                                <View style={styles.grid}>
                                    {recents.slice(0, 3).map(renderRestaurantCard)}
                                </View>
                            )}
                        </View>

                        <TouchableOpacity style={styles.logoutButton} onPress={signout}>
                            <Text style={styles.logoutText}>Log Out</Text>
                        </TouchableOpacity>

                    </ScrollView>

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
    scrollContent: { paddingBottom: 16 },
    profileSection: {
        alignItems: 'center',
        marginVertical: 20,
    },
    profilepic: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'white',
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
    },
    section: {
        marginBottom: 20,
    },
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
    seeAll: {
        marginLeft: 'auto',
        color: 'rgba(255,255,255,0.75)',
        fontSize: 13,
        fontWeight: '600',
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
    emptyText: {
        color: 'rgba(255,255,255,0.6)',
        fontStyle: 'italic',
        fontSize: 13,
    },
    logoutButton: {
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 8,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
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

export default UserProfile;
