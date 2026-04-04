import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { castVote, fetchRestaurants } from '../services/api';
import SwipeCard from './SwipeCard';

function SwipeCardScreen({ route, navigation }) {
    const swiperRef = useRef(null);
    const [cardIndex, setCardIndex] = useState(0);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const { sessionId, userId, latitude, longitude, radius, dietary } = route.params || {};

    useEffect(() => {
        const loadRestaurants = async () => {
            setLoading(true);

            const result = await fetchRestaurants({
                latitude,
                longitude,
                radius,
                dietary,
            });

            if (result.success) {
                setRestaurants(result.restaurants);
            } else {
                setErrorMessage(result.error);
            }

            setLoading(false);
        };

        loadRestaurants();
    }, [latitude, longitude, radius, dietary]);

    const handleVote = async (index, voteValue) => {
    const restaurant = restaurants[index];
    if (!restaurant) return;

    const result = await castVote(sessionId, restaurant.restaurant_id, userId, voteValue);

    if (!result.success) {
        console.log('Vote endpoint not ready yet:', result.error);

        // TEMPORARY: still allow card progression for frontend testing
        setCardIndex(index + 1);
        return;
    }

    setCardIndex(index + 1);
};

    const handleSwipeLeft = async (index) => {
        await handleVote(index, -1);
    };

    const handleSwipeRight = async (index) => {
        await handleVote(index, 1);
    };

    const handleSwipedAll = () => {
        navigation.navigate('WaitingScreen', { sessionId });
    };

    if (loading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <ActivityIndicator size="large" color="black" />
                    <Text style={styles.message}>Loading restaurants...</Text>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    if (errorMessage) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <Text style={styles.message}>{errorMessage}</Text>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    if (restaurants.length === 0) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <Text style={styles.message}>No restaurants available</Text>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Swipe Restaurants</Text>

                <View style={styles.swiperContainer}>
                    <Swiper
                        ref={swiperRef}
                        cards={restaurants}
                        cardIndex={cardIndex}
                        renderCard={(restaurant) =>
                            restaurant ? <SwipeCard restaurant={restaurant} /> : <View />
                        }
                        onSwipedLeft={handleSwipeLeft}
                        onSwipedRight={handleSwipeRight}
                        onSwipedAll={handleSwipedAll}
                        backgroundColor="transparent"
                        cardsHorizontalMargin={20}
                        cardsVerticalMargin={80}
                        stackSize={3}
                        stackSeparation={15}
                        animateOverlayLabelsOpacity
                        animateCardOpacity
                        disableTopSwipe
                        disableBottomSwipe
                        overlayLabels={{
                            left: {
                                title: 'NO',
                                style: {
                                    label: styles.leftLabel,
                                    wrapper: styles.leftWrapper,
                                },
                            },
                            right: {
                                title: 'YES',
                                style: {
                                    label: styles.rightLabel,
                                    wrapper: styles.rightWrapper,
                                },
                            },
                        }}
                    />
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.noButton]}
                        onPress={() => swiperRef.current?.swipeLeft()}
                    >
                        <Text style={styles.actionButtonText}>✖ NO</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.yesButton]}
                        onPress={() => swiperRef.current?.swipeRight()}
                    >
                        <Text style={styles.actionButtonText}>✔ YES</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'pink',
        alignItems: 'center',
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    swiperContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginBottom: 24,
        marginTop: 8,
    },
    actionButton: {
        width: 120,
        height: 48,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noButton: {
        backgroundColor: '#ff8fa3',
    },
    yesButton: {
        backgroundColor: 'mediumspringgreen',
    },
    actionButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    leftLabel: {
        backgroundColor: 'red',
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    rightLabel: {
        backgroundColor: 'green',
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    leftWrapper: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        marginTop: 30,
        marginLeft: -30,
    },
    rightWrapper: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginTop: 30,
        marginLeft: 30,
    },
    message: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default SwipeCardScreen;