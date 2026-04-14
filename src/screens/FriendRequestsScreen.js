import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { acceptFriendRequest, declineFriendRequest, getFriendRequests } from '../services/api';

function FriendRequestsScreen() {
    const navigation = useNavigation();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setIsLoading(true);
        const result = await getFriendRequests();
        if (result.success) {
            setRequests(result.data);
        } else {
            Alert.alert('Error', result.error);
        }
        setIsLoading(false);
    };

    const handleAccept = async (friendshipId) => {
        const result = await acceptFriendRequest(friendshipId);
        if (result.success) {
            setRequests((prev) => prev.filter((r) => r.friendship_id !== friendshipId));
        } else {
            Alert.alert('Error', result.error);
        }
    };

    const handleDecline = async (friendshipId) => {
        const result = await declineFriendRequest(friendshipId);
        if (result.success) {
            setRequests((prev) => prev.filter((r) => r.friendship_id !== friendshipId));
        } else {
            Alert.alert('Error', result.error);
        }
    };

    const renderRequest = ({ item }) => (
        <View style={styles.requestRow}>
            <TouchableOpacity
                style={styles.userInfo}
                onPress={() => navigation.navigate('OtherUserProfileScreen', { userId: item.user_id })}
            >
                <Text style={styles.userName}>{item.first_name} {item.last_name}</Text>
                <Text style={styles.userUsername}>@{item.username}</Text>
            </TouchableOpacity>
            <View style={styles.buttonGroup}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() => handleAccept(item.friendship_id)}
                >
                    <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.declineButton]}
                    onPress={() => handleDecline(item.friendship_id)}
                >
                    <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
            </View>
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
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>

                    <Text style={styles.title}>Friend Requests</Text>

                    {isLoading ? (
                        <ActivityIndicator size="large" color="white" style={styles.loader} />
                    ) : requests.length === 0 ? (
                        <Text style={styles.emptyText}>No pending friend requests.</Text>
                    ) : (
                        <FlatList
                            data={requests}
                            keyExtractor={(item) => String(item.friendship_id)}
                            renderItem={renderRequest}
                            contentContainerStyle={styles.list}
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
        paddingTop: 20,
    },
    backButton: {
        marginBottom: 12,
    },
    backText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    loader: {
        marginTop: 40,
    },
    emptyText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        fontStyle: 'italic',
    },
    list: {
        paddingBottom: 20,
    },
    requestRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    userUsername: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        marginTop: 2,
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    acceptButton: {
        backgroundColor: 'white',
    },
    declineButton: {
        borderColor: 'white',
        borderWidth: 1,
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 13,
        color: '#c76d18ff',
    },
});

export default FriendRequestsScreen;
