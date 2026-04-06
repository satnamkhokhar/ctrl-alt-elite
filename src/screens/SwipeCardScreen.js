import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { castVote, fetchRestaurants } from '../services/api';
import SwipeCard from '../components/SwipeCard';

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

    const gradientWrapper = (children) => (
        <SafeAreaProvider>
            <LinearGradient
                colors={['#f00b0bff', '#c76d18ff']}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <SafeAreaView style={styles.container}>
                    {children}
                </SafeAreaView>
            </LinearGradient>
        </SafeAreaProvider>
    );

    if (loading) {
        return gradientWrapper(
            <>
                <ActivityIndicator size="large" color="white" />
                <Text style={styles.message}>Loading restaurants...</Text>
            </>
        );
    }

    if (errorMessage) {
        return gradientWrapper(<Text style={styles.message}>{errorMessage}</Text>);
    }

    if (restaurants.length === 0) {
        return gradientWrapper(<Text style={styles.message}>No restaurants available</Text>);
    }

    return (
        <SafeAreaProvider>
            <LinearGradient
                colors={['#f00b0bff', '#c76d18ff']}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
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
                        cardVerticalMargin={10}
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
            </LinearGradient>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 10,
        marginBottom: 5,
        textAlign: 'center',
        alignSelf: 'center',
    },
    swiperContainer: {
        height: Dimensions.get('window').height * 0.72,
        width: '100%',
    },
    buttonRow: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        zIndex: 10,
    },
    actionButton: {
        width: 130,
        height: 50,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: .85,
    },
    noButton: {
        backgroundColor: '#ff8fa3',
    },
    yesButton: {
        backgroundColor: 'mediumspringgreen',
    },
    actionButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f00b0bff',
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
        color: 'white',
        textAlign: 'center',
    },
});

export default SwipeCardScreen;