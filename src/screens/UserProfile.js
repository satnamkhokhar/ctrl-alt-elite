import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from '../components/UserContext';
import { useUser } from '../components/useUser';
import { getUserDetails } from '../services/api';

function UserProfile () {
    const { userData, setUserData } = useContext(UserContext);
    const { logout } = useUser();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(!userData.firstName);

    useEffect(() => {
        if (userData.firstName) return;
        const fetchUser = async () => {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) return;
            const result = await getUserDetails(userId);
            if (result.success) {
                setUserData({
                    firstName: result.data.first_name,
                    lastName: result.data.last_name,
                    userName: result.data.username,
                });
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const signout = () => {
        logout();
        navigation.navigate('loginScreen');
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

                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image
                                source={require('../../assets/images/house.png')}
                                style={styles.headerIcon}
                            />
                        </TouchableOpacity>
                        <Text style={styles.title}>DineSync</Text>
                        <View style={styles.headerIcon} />
                    </View>

                    {/* Profile section */}
                    <View style={styles.profileSection}>
                        <Image
                            source={require('../../assets/images/profilepic.png')}
                            style={styles.profilepic}
                        />
                        {loading ? (
                            <ActivityIndicator color="white" style={{ marginTop: 8 }} />
                        ) : (
                            <>
                                <Text style={styles.name}>
                                    {userData.firstName} {userData.lastName}
                                </Text>
                                <Text style={styles.username}>@{userData.userName}</Text>
                            </>
                        )}
                    </View>

                    {/* Menu items */}
                    <View style={styles.menu}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('FavoritesScreen')}>
                            <Image
                                source={require('../../assets/images/heart.png')}
                                style={styles.menuIcon}
                            />
                            <Text style={styles.menuLabel}>Favorites</Text>
                        </TouchableOpacity>
                        <View style={styles.separator} />

                        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('RecentsScreen')}>
                            <Image
                                source={require('../../assets/images/clock.png')}
                                style={styles.menuIcon}
                            />
                            <Text style={styles.menuLabel}>Recents</Text>
                        </TouchableOpacity>
                        <View style={styles.separator} />

                        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('FriendsScreen')}>
                            <Image
                                source={require('../../assets/images/star.png')}
                                style={styles.menuIcon}
                            />
                            <Text style={styles.menuLabel}>Friends</Text>
                        </TouchableOpacity>
                        <View style={styles.separator} />
                    </View>

                    {/* Logout button */}
                    <TouchableOpacity style={styles.logoutButton} onPress={signout}>
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>

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
    },
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
    headerIcon: {
        width: 36,
        height: 36,
    },
    profileSection: {
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 32,
    },
    profilepic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    username: {
        fontSize: 16,
        color: 'white',
        opacity: 0.85,
    },
    menu: {
        flex: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 8,
    },
    menuIcon: {
        width: 24,
        height: 24,
        marginRight: 16,
    },
    menuLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'white',
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    logoutButton: {
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    logoutText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default UserProfile;
