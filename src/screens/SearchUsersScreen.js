import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { searchUsers, sendFriendRequest, getFriendshipStatus } from '../services/api';

function SearchUsersScreen() {
    const navigation = useNavigation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [statuses, setStatuses] = useState({});
    const [sendingTo, setSendingTo] = useState(null);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        setResults([]);

        const currentUserIdStr = await AsyncStorage.getItem('userId');
        const currentUserId = currentUserIdStr ? parseInt(currentUserIdStr) : null;

        const result = await searchUsers(query.trim());
        if (result.success) {
            const filtered = currentUserId
                ? result.data.filter((u) => u.user_id !== currentUserId)
                : result.data;
            setResults(filtered);

            const statusMap = {};
            await Promise.all(
                filtered.map(async (user) => {
                    const statusResult = await getFriendshipStatus(user.user_id);
                    if (statusResult.success) {
                        statusMap[user.user_id] = statusResult.data;
                    }
                })
            );
            setStatuses(statusMap);
        }
        setIsLoading(false);
    };

    const handleSendRequest = async (userId) => {
        setSendingTo(userId);
        const result = await sendFriendRequest(userId);
        if (result.success) {
            setStatuses((prev) => ({
                ...prev,
                [userId]: { status: 'request_sent', friendship_id: result.data.friendship_id },
            }));
        }
        setSendingTo(null);
    };

    const getFriendLabel = (userId) => {
        const info = statuses[userId];
        if (!info) return 'Add Friend';
        if (info.status === 'friends') return 'Friends';
        if (info.status === 'request_sent') return 'Request Sent';
        if (info.status === 'request_received') return 'Accept Request';
        return 'Add Friend';
    };

    const renderUser = ({ item }) => {
        const label = getFriendLabel(item.user_id);
        const isFriend = label === 'Friends';
        const isSent = label === 'Request Sent';
        const isSending = sendingTo === item.user_id;

        return (
            <View style={styles.userRow}>
                <TouchableOpacity
                    style={styles.userInfo}
                    onPress={() => navigation.navigate('OtherUserProfileScreen', { userId: item.user_id })}
                >
                    <Text style={styles.userName}>{item.first_name} {item.last_name}</Text>
                    <Text style={styles.userUsername}>@{item.username}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.statusButton,
                        isFriend && styles.statusFriend,
                        isSent && styles.statusSent,
                    ]}
                    disabled={isFriend || isSent || isSending}
                    onPress={() => handleSendRequest(item.user_id)}
                >
                    <Text style={styles.statusText}>
                        {isSending ? '...' : label}
                    </Text>
                </TouchableOpacity>
            </View>
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
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>

                    <Text style={styles.title}>Find Friends</Text>

                    <View style={styles.searchRow}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by name or username"
                            placeholderTextColor="rgba(255,255,255,0.6)"
                            value={query}
                            onChangeText={setQuery}
                            onSubmitEditing={handleSearch}
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="search"
                        />
                        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                            <Text style={styles.searchButtonText}>Search</Text>
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <ActivityIndicator size="large" color="white" style={styles.loader} />
                    ) : results.length === 0 && query.trim() ? (
                        <Text style={styles.emptyText}>No users found.</Text>
                    ) : (
                        <FlatList
                            data={results}
                            keyExtractor={(item) => String(item.user_id)}
                            renderItem={renderUser}
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
        marginBottom: 16,
    },
    searchRow: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        color: 'white',
        fontSize: 15,
    },
    searchButton: {
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        justifyContent: 'center',
    },
    searchButtonText: {
        color: '#f00b0bff',
        fontWeight: 'bold',
        fontSize: 15,
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
    userRow: {
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
    statusButton: {
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    statusFriend: {
        backgroundColor: 'white',
    },
    statusSent: {
        opacity: 0.6,
    },
    statusText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 13,
    },
});

export default SearchUsersScreen;
