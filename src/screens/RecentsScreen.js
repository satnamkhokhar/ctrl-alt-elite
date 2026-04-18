import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

function RecentsScreen() {
    const navigation = useNavigation();
    const [recents, setRecents] = useState([]);

    useEffect(() => {
        const load = async () => {
            const raw = await AsyncStorage.getItem('recent_restaurants');
            if (raw) setRecents(JSON.parse(raw));
        };
        load();
    }, []);

    const handleClear = () => {
        Alert.alert(
            'Clear Recents',
            'Remove all recent restaurants?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem('recent_restaurants');
                        setRecents([]);
                    },
                },
            ]
        );
    };

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
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
                            <Image source={require('../../assets/images/house.png')} style={styles.homeIcon} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Recents</Text>
                        {recents.length > 0 ? (
                            <TouchableOpacity onPress={handleClear}>
                                <Text style={styles.clearText}>Clear</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.homeIcon} />
                        )}
                    </View>

                    {recents.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No recent sessions yet.</Text>
                            <Text style={styles.emptySubText}>Winning restaurants from your sessions will appear here.</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={recents}
                            keyExtractor={(item, index) => `${item.restaurant_id}-${index}`}
                            contentContainerStyle={styles.list}
                            renderItem={({ item }) => (
                                <View style={styles.card}>
                                    <View style={styles.cardInfo}>
                                        <Text style={styles.name}>{item.name}</Text>
                                        {item.cuisine ? <Text style={styles.detail}>🍽  {item.cuisine}</Text> : null}
                                    </View>
                                    <Text style={styles.date}>{formatDate(item.date)}</Text>
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
    container: { flex: 1 },
    inner: { flex: 1, paddingHorizontal: 20 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    homeIcon: { width: 36, height: 36 },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'white',
    },
    clearText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyText: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 8 },
    emptySubText: { fontSize: 14, color: 'rgba(255,255,255,0.75)', textAlign: 'center' },
    list: { paddingTop: 8, paddingBottom: 24 },
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
    cardInfo: { flex: 1 },
    name: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 4 },
    detail: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
    date: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginLeft: 8 },
});

export default RecentsScreen;
