import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { addFavorite } from '../services/api';

function HomeScreen () {
    const navigation = useNavigation();
    const [pendingRestaurant, setPendingRestaurant] = useState(null);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    useEffect(() => {
        const checkPending = async () => {
            const raw = await AsyncStorage.getItem('pending_favorite');
            if (raw) {
                setPendingRestaurant(JSON.parse(raw));
            }
        };
        checkPending();
    }, []);

    const handleFavoriteResponse = async (addToFavorites) => {
        if (favoriteLoading) return;
        setFavoriteLoading(true);
        if (addToFavorites) {
            await addFavorite(pendingRestaurant.restaurant_id);
        }
        await AsyncStorage.removeItem('pending_favorite');
        setPendingRestaurant(null);
        setFavoriteLoading(false);
    };

    return (
        <SafeAreaProvider>
           <LinearGradient
            colors={['#f00b0bff', '#c76d18ff']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            >

            <View style={styles.content}>
                <Text style={styles.DineSync}>DineSync</Text>


                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SessionScreen')}>
                    <Text style={styles.buttonText}>Start Swiping</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.joinButton]} onPress={() => navigation.navigate('JoinSessionScreen')}>
                    <Text style={styles.buttonText}>Join Session</Text>
                </TouchableOpacity>
            </View>

            <SafeAreaView style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('FriendsScreen')}>
                    <Image
                        source={require('../../assets/images/star.png')}
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

            {/* Pending favorite prompt */}
            <Modal
                visible={!!pendingRestaurant}
                transparent
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>How was it?</Text>
                        <Text style={styles.modalBody}>
                            Did you enjoy{'\n'}
                            <Text style={styles.modalRestaurantName}>{pendingRestaurant?.name}</Text>?
                        </Text>
                        <Text style={styles.modalSubText}>Would you like to add it to your favorites?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonNo, favoriteLoading && { opacity: 0.6 }]}
                                onPress={() => handleFavoriteResponse(false)}
                                disabled={favoriteLoading}
                            >
                                <Text style={styles.modalButtonText}>No thanks</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonYes, favoriteLoading && { opacity: 0.6 }]}
                                onPress={() => handleFavoriteResponse(true)}
                                disabled={favoriteLoading}
                            >
                                <Text style={[styles.modalButtonText, styles.modalButtonYesText]}>{favoriteLoading ? 'Saving...' : 'Add to Favorites'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            </LinearGradient>
        </SafeAreaProvider>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    DineSync: {
        fontSize: 75,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'white',
    },
    button: {
        borderColor:'white',
        borderWidth: 2,
        height: 50,
        width: 300,
        borderRadius: 8,
        marginTop: 15,
        backgroundColor: 'white',
        opacity: .45,
        justifyContent: 'center',
    },
    joinButton: {},
    buttonText: {
        color:'#f00b0bff',
        fontSize: 25,
        fontWeight:'bold',
        textAlign:'center',
    },
    mediumLogo: {
        width: 50,
        height: 50,
    },
    groupLogo: {
        width: 90,
        height: 90,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    modalCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 28,
        width: '100%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f00b0bff',
        marginBottom: 12,
    },
    modalBody: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 4,
    },
    modalRestaurantName: {
        fontWeight: 'bold',
        color: '#f00b0bff',
    },
    modalSubText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalButtonNo: {
        backgroundColor: '#eee',
    },
    modalButtonYes: {
        backgroundColor: '#f00b0bff',
    },
    modalButtonText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#333',
    },
    modalButtonYesText: {
        color: 'white',
    },
});

export default HomeScreen;
