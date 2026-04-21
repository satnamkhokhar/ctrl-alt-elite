import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const MEDALS = ['🥇', '🥈', '🥉'];

function MatchScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const topRestaurants = route.params?.topRestaurants || [];
    const [selectedId, setSelectedId] = useState(null);
    const [saving, setSaving] = useState(false);

    const handlePick = async (restaurant) => {
        if (saving) return;
        setSaving(true);
        setSelectedId(restaurant.restaurant_id);

        // Store as pending favorite for next login prompt
        await AsyncStorage.setItem('pending_favorite', JSON.stringify({
            restaurant_id: restaurant.restaurant_id,
            name: restaurant.name,
        }));

        // Append to recents
        const raw = await AsyncStorage.getItem('recent_restaurants');
        const existing = raw ? JSON.parse(raw) : [];
        const updated = [
            { restaurant_id: restaurant.restaurant_id, name: restaurant.name, cuisine: restaurant.cuisine, date: new Date().toISOString() },
            ...existing.filter(r => r.restaurant_id !== restaurant.restaurant_id),
        ].slice(0, 20);
        await AsyncStorage.setItem('recent_restaurants', JSON.stringify(updated));

        setSaving(false);
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
                    <Text style={styles.title}>DineSync</Text>
                    <Text style={styles.subtitle}>The results are in...</Text>
                    {topRestaurants.length > 0 && (
                        <Text style={styles.hint}>Tap a restaurant to select where you're going!</Text>
                    )}

                    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                        {topRestaurants.length > 0 ? (
                            topRestaurants.map((restaurant, index) => {
                                const isSelected = selectedId === restaurant.restaurant_id;
                                return (
                                    <TouchableOpacity
                                        key={restaurant.restaurant_id}
                                        style={[
                                            styles.card,
                                            index === 0 && styles.winnerCard,
                                            isSelected && styles.selectedCard,
                                        ]}
                                        onPress={() => handlePick(restaurant)}
                                        disabled={saving}
                                    >
                                        <Text style={styles.rank}>{MEDALS[index] ?? `#${index + 1}`}</Text>
                                        <Text style={styles.restaurantName}>{restaurant.name}</Text>
                                        {restaurant.cuisine ? (
                                            <Text style={styles.detail}>🍽  {restaurant.cuisine}</Text>
                                        ) : null}
                                        {restaurant.formatted_address ? (
                                            <Text style={styles.detail}>📍  {restaurant.formatted_address}</Text>
                                        ) : null}
                                        {restaurant.phone_number ? (
                                            <Text style={styles.detail}>📞  {restaurant.phone_number}</Text>
                                        ) : null}
                                        <Text style={styles.score}>{restaurant.score} vote{restaurant.score !== 1 ? 's' : ''}</Text>
                                        {isSelected && (
                                            <Text style={styles.selectedLabel}>✓ We're going here!</Text>
                                        )}
                                    </TouchableOpacity>
                                );
                            })
                        ) : (
                            <Text style={styles.noMatch}>No restaurants received positive votes.</Text>
                        )}
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('HomeScreen')}
                    >
                        <Text style={styles.buttonText}>Start A New Session</Text>
                    </TouchableOpacity>
                </SafeAreaView>

                <SafeAreaView style={styles.footer}>
                    <TouchableOpacity onPress={() => navigation.navigate('FriendsScreen')}>
                        <Image
                            source={require('../../assets/images/star.png')}
                            style={styles.mediumLogo}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                        <Image
                            source={require('../../assets/images/house.png')}
                            style={styles.mediumLogo}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
                        <Image
                            source={require('../../assets/images/profile.png')}
                            style={styles.mediumLogo}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('GroupScreen')}>
                        <Image
                            source={require('../../assets/images/group.png')}
                            style={styles.groupLogo}
                        />
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
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'white',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    hint: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontStyle: 'italic',
        marginBottom: 16,
        textAlign: 'center',
    },
    scroll: {
        width: '100%',
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 16,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    winnerCard: {
        backgroundColor: 'rgba(255,255,255,0.35)',
        borderColor: 'white',
        borderWidth: 2,
    },
    selectedCard: {
        backgroundColor: 'rgba(255,255,255,0.55)',
        borderColor: 'white',
        borderWidth: 3,
    },
    rank: {
        fontSize: 28,
        marginBottom: 6,
        textAlign: 'center',
    },
    restaurantName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
    },
    detail: {
        fontSize: 15,
        color: 'white',
        marginBottom: 6,
        textAlign: 'center',
    },
    score: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: 6,
        fontStyle: 'italic',
    },
    selectedLabel: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    noMatch: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginTop: 40,
    },
    button: {
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2,
        height: 50,
        width: 300,
        borderRadius: 8,
        marginVertical: 20,
        justifyContent: 'center',
        backgroundColor: 'white',
        opacity: .45,
    },
    buttonText: {
        color: '#f00b0bff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    mediumLogo: {
        width: 50,
        height: 50,
    },
    groupLogo: {
        width: 90,
        height: 90,
    },
});

export default MatchScreen;
