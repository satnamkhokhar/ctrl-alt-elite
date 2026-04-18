import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getFriendRequests, getFriends, unfriend } from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

function FriendsScreen() {
    const navigation = useNavigation();
    const [friends, setFriends] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        setIsLoading(true);
        const [friendsRes, requestsRes] = await Promise.all([getFriends(), getFriendRequests()]);
        if (friendsRes.success) setFriends(friendsRes.data);
        if (requestsRes.success) setPendingCount(requestsRes.data.length);
        setIsLoading(false);
    };

    const handleUnfriend = (friend) => {
        Alert.alert(
            'Unfriend',
            `Remove ${friend.first_name} ${friend.last_name} from your friends?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Unfriend',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await unfriend(friend.user_id);
                        if (result.success) {
                            setFriends((prev) => prev.filter((f) => f.user_id !== friend.user_id));
                        } else {
                            Alert.alert('Error', result.error);
                        }
                    },
                },
            ]
        );
    };

    const renderFriend = ({ item }) => (
        <TouchableOpacity
            style={styles.friendRow}
            onPress={() => navigation.navigate('OtherUserProfileScreen', { userId: item.user_id })}
        >
            <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{item.first_name} {item.last_name}</Text>
                <Text style={styles.friendUsername}>@{item.username}</Text>
            </View>
            <TouchableOpacity style={styles.unfriendButton} onPress={() => handleUnfriend(item)}>
                <Text style={styles.unfriendText}>Unfriend</Text>
            </TouchableOpacity>
        </TouchableOpacity>
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
                    <Text style={styles.title}>Friends</Text>

                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('FriendRequestsScreen')}
                        >
                            <Text style={styles.actionButtonText}>
                                Requests{pendingCount > 0 ? ` (${pendingCount})` : ''}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('SearchUsersScreen')}
                        >
                            <Text style={styles.actionButtonText}>Find Friends</Text>
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <ActivityIndicator size="large" color="white" style={styles.loader} />
                    ) : friends.length === 0 ? (
                        <Text style={styles.emptyText}>No friends yet. Search to add some!</Text>
                    ) : (
                        <FlatList
                            data={friends}
                            keyExtractor={(item) => String(item.user_id)}
                            renderItem={renderFriend}
                            contentContainerStyle={styles.list}
                        />
                    )}
                </SafeAreaView>

                <SafeAreaView style={styles.footer}>
                    <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
                        <Image source={require('../../assets/images/profile.png')} style={styles.footerIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                        <Image source={require('../../assets/images/house.png')} style={styles.footerIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('GroupScreen')}>
                        <Image source={require('../../assets/images/group.png')} style={styles.groupIcon} />
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
        paddingTop: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 12,
    },
    actionButton: {
        flex: 1,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    actionButtonText: {
        color: 'white',
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
    friendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    friendInfo: {
        flex: 1,
    },
    friendName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    friendUsername: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        marginTop: 2,
    },
    unfriendButton: {
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    unfriendText: {
        color: 'white',
        fontSize: 13,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    footerIcon: {
        width: 50,
        height: 50,
    },
    groupIcon: {
        width: 90,
        height: 90,
    },
});

export default FriendsScreen;
