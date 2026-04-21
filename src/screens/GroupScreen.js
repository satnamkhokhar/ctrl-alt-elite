import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator, Alert, FlatList, Image, Modal,
    ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createGroup, createSessionWithGroup, deleteGroup, getFriends, getGroups } from '../services/api';

function GroupScreen() {
    const navigation = useNavigation();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [friends, setFriends] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [creating, setCreating] = useState(false);

    const [sessionModalVisible, setSessionModalVisible] = useState(false);
    const [sessionGroup, setSessionGroup] = useState(null);
    const [budget, setBudget] = useState('');
    const [maxDistance, setMaxDistance] = useState('');
    const [startingSession, setStartingSession] = useState(false);

    useEffect(() => {
        const init = async () => {
            const id = await AsyncStorage.getItem('userId');
            setCurrentUserId(Number(id));
            await loadGroups();
        };
        init();
    }, []);

    const loadGroups = async () => {
        setLoading(true);
        const result = await getGroups();
        if (result.success) setGroups(result.groups);
        setLoading(false);
    };

    const openCreateModal = async () => {
        const result = await getFriends();
        if (result.success) setFriends(result.data);
        setGroupName('');
        setSelectedIds([]);
        setModalVisible(true);
    };

    const toggleFriend = (userId) => {
        setSelectedIds(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleCreate = async () => {
        if (!groupName.trim()) {
            Alert.alert('Name required', 'Please enter a group name.');
            return;
        }
        setCreating(true);
        const result = await createGroup(groupName.trim(), selectedIds);
        setCreating(false);
        if (result.success) {
            setModalVisible(false);
            await loadGroups();
        } else {
            Alert.alert('Error', result.error);
        }
    };

    const openSessionModal = (group) => {
        setSessionGroup(group);
        setBudget('');
        setMaxDistance('');
        setSessionModalVisible(true);
    };

    const handleStartSession = async () => {
        if (!budget || !maxDistance) {
            Alert.alert('Required', 'Please enter budget and max distance.');
            return;
        }
        setStartingSession(true);
        const result = await createSessionWithGroup(sessionGroup.group_id, parseFloat(budget), parseFloat(maxDistance));
        setStartingSession(false);
        if (result.success) {
            setSessionModalVisible(false);
            navigation.navigate('SessionLobbyScreen', { sessionId: result.data.session_id });
        } else {
            Alert.alert('Error', result.error);
        }
    };

    const handleDelete = (group) => {
        Alert.alert(
            'Delete Group',
            `Delete "${group.group_name}"? This cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await deleteGroup(group.group_id);
                        if (result.success) {
                            setGroups(prev => prev.filter(g => g.group_id !== group.group_id));
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

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Groups</Text>
                        <TouchableOpacity onPress={openCreateModal} style={styles.addButton}>
                            <Text style={styles.addButtonText}>+ New</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color="white" style={styles.loader} />
                    ) : groups.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No groups yet.</Text>
                            <Text style={styles.emptySubText}>Create a group to quickly start sessions with your usual crew.</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={groups}
                            keyExtractor={(item) => String(item.group_id)}
                            contentContainerStyle={styles.list}
                            renderItem={({ item }) => (
                                <View style={styles.card}>
                                    <View style={styles.cardTop}>
                                        <Text style={styles.groupName}>{item.group_name}</Text>
                                        {Number(item.created_by) === currentUserId && (
                                            <TouchableOpacity onPress={() => handleDelete(item)}>
                                                <Text style={styles.deleteText}>✕</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    <Text style={styles.memberCount}>{item.members.length} member{item.members.length !== 1 ? 's' : ''}</Text>
                                    {item.members.map(m => (
                                        <Text key={m.user_id} style={styles.memberName}>• {m.name}</Text>
                                    ))}
                                    <TouchableOpacity style={styles.startSessionButton} onPress={() => openSessionModal(item)}>
                                        <Text style={styles.startSessionText}>Start Session</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    )}

                    {/* Footer nav */}
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={() => navigation.navigate('FriendsScreen')}>
                            <Image source={require('../../assets/images/star.png')} style={styles.footerIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                            <Image source={require('../../assets/images/house.png')} style={styles.footerIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
                            <Image source={require('../../assets/images/profile.png')} style={styles.footerIcon} />
                        </TouchableOpacity>
                    </View>

                </SafeAreaView>
            </LinearGradient>

            {/* Create Group Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>New Group</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Group name"
                            placeholderTextColor="#aaa"
                            value={groupName}
                            onChangeText={setGroupName}
                        />

                        {friends.length > 0 && (
                            <>
                                <Text style={styles.modalSubLabel}>Add friends (optional)</Text>
                                <ScrollView style={styles.friendsList}>
                                    {friends.map(f => {
                                        const selected = selectedIds.includes(f.user_id);
                                        return (
                                            <TouchableOpacity
                                                key={f.user_id}
                                                style={[styles.friendRow, selected && styles.friendRowSelected]}
                                                onPress={() => toggleFriend(f.user_id)}
                                            >
                                                <Text style={[styles.friendName, selected && styles.friendNameSelected]}>
                                                    {f.first_name} {f.last_name}
                                                </Text>
                                                {selected && <Text style={styles.checkmark}>✓</Text>}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>
                            </>
                        )}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.createButton]}
                                onPress={handleCreate}
                                disabled={creating}
                            >
                                <Text style={styles.createButtonText}>{creating ? 'Creating...' : 'Create'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Start Session Modal */}
            <Modal visible={sessionModalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Start Session</Text>
                        {sessionGroup && (
                            <Text style={styles.modalSubLabel}>with {sessionGroup.group_name}</Text>
                        )}

                        <TextInput
                            style={styles.input}
                            placeholder="Budget ($)"
                            placeholderTextColor="#aaa"
                            value={budget}
                            onChangeText={setBudget}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Max distance (miles)"
                            placeholderTextColor="#aaa"
                            value={maxDistance}
                            onChangeText={setMaxDistance}
                            keyboardType="numeric"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setSessionModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.createButton]}
                                onPress={handleStartSession}
                                disabled={startingSession}
                            >
                                <Text style={styles.createButtonText}>{startingSession ? 'Starting...' : 'Start'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    headerIcon: { width: 36, height: 36 },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'white',
    },
    addButton: {
        borderColor: 'white',
        borderWidth: 1.5,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    addButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
    loader: { marginTop: 60 },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyText: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 8 },
    emptySubText: { fontSize: 14, color: 'rgba(255,255,255,0.75)', textAlign: 'center' },
    list: { paddingTop: 8, paddingBottom: 16 },
    card: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    groupName: { fontSize: 18, fontWeight: 'bold', color: 'white' },
    deleteText: { color: 'white', fontSize: 18, fontWeight: 'bold', paddingHorizontal: 4 },
    memberCount: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 6 },
    memberName: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 2 },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    footerIcon: { width: 50, height: 50 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    modalCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#f00b0bff',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        height: 44,
        paddingHorizontal: 12,
        fontSize: 16,
        marginBottom: 16,
        color: '#333',
    },
    modalSubLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 8,
    },
    friendsList: { maxHeight: 200, marginBottom: 16 },
    friendRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 4,
        backgroundColor: '#f5f5f5',
    },
    friendRowSelected: { backgroundColor: '#ffe0e0' },
    friendName: { fontSize: 15, color: '#333' },
    friendNameSelected: { color: '#f00b0bff', fontWeight: 'bold' },
    checkmark: { color: '#f00b0bff', fontWeight: 'bold', fontSize: 16 },
    modalButtons: { flexDirection: 'row', gap: 12 },
    modalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    cancelButton: { backgroundColor: '#eee' },
    cancelButtonText: { color: '#555', fontWeight: 'bold' },
    createButton: { backgroundColor: '#f00b0bff' },
    createButtonText: { color: 'white', fontWeight: 'bold' },
    startSessionButton: {
        marginTop: 12,
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 8,
        paddingVertical: 8,
        alignItems: 'center',
    },
    startSessionText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
});

export default GroupScreen;
