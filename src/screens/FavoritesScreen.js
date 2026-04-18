import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getFavorites, removeFavorite } from '../services/api';

function FavoritesScreen() {
    const navigation = useNavigation();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        setLoading(true);
        const result = await getFavorites();
        if (result.success) {
            setFavorites(result.favorites);
        }
        setLoading(false);
    };

    const handleRemove = (restaurant) => {
        Alert.alert(
            'Remove Favorite',
            `Remove ${restaurant.name} from your favorites?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await removeFavorite(restaurant.restaurant_id);
                        if (result.success) {
                            setFavorites(prev => prev.filter(r => r.restaurant_id !== restaurant.restaurant_id));
                        } else {
                            Alert.alert('Error', result.error);
                        }
                    },
                },
            ]
        );
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
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image
                                source={require('../../assets/images/house.png')}
                                style={styles.homeIcon}
                            />
                        </TouchableOpacity>
                        <Text style={styles.title}>Favorites</Text>
                        <View style={styles.homeIcon} />
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color="white" style={styles.loader} />
                    ) : favorites.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No favorites yet.</Text>
                            <Text style={styles.emptySubText}>Restaurants from your sessions will appear here.</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={favorites}
                            keyExtractor={(item) => String(item.restaurant_id)}
                            contentContainerStyle={styles.list}
                            renderItem={({ item }) => (
                                <View style={styles.card}>
                                    <View style={styles.cardInfo}>
                                        <Text style={styles.name}>{item.name}</Text>
                                        {item.cuisine ? <Text style={styles.detail}>🍽  {item.cuisine}</Text> : null}
                                        {item.address ? <Text style={styles.detail}>📍  {item.address}</Text> : null}
                                    </View>
                                    <TouchableOpacity onPress={() => handleRemove(item)} style={styles.removeButton}>
                                        <Text style={styles.removeText}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    homeIcon: {
        width: 36,
        height: 36,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'white',
    },
    loader: {
        marginTop: 60,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.75)',
        textAlign: 'center',
    },
    list: {
        paddingTop: 8,
        paddingBottom: 24,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    cardInfo: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    detail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        marginBottom: 2,
    },
    removeButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    removeText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default FavoritesScreen;
