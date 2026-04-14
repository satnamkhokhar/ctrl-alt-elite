import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

function GroupScreen () {
    const navigation = useNavigation()

    return (
        <SafeAreaProvider>    
           <LinearGradient
            colors={['#f00b0bff', '#c76d18ff']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            > 
           
            <SafeAreaView style={styles.header}>
                <TouchableOpacity>
                <Image
                    source={require('../../assets/share.png')}
                    style={styles.mediumLogo}
                    />
                </TouchableOpacity>

                <Text style={styles.DineSync}>{'\n'}DineSync</Text> 

                <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
                    <Image
                    source={require('../../assets/profile.png')}
                    style={styles.mediumLogo}
                    />
                </TouchableOpacity>
            </SafeAreaView>

            
            <SafeAreaView style={styles.footer}>
                 <TouchableOpacity onPress={() => navigation.navigate('FriendsScreen')}>
                    <Image
                    source={require('../../assets/star.png')}
                    style={styles.mediumLogo}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                    <Image
                    source={require('../../assets/house.png')}
                    style={styles.mediumLogo}
                    />
                </TouchableOpacity>

                <TouchableOpacity>
                    <Image
                    source={require('../../assets/messages.png')}
                    style={styles.mediumLogo}
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
    header: {
        flexDirection: "row",
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: "space-between",
        
    }, 
    DineSync: {
        fontSize: 35,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'white',
    }, 
    profilecontainer: {
        alignItems: 'center',
        justifyContent: 'center',

    },
    profifleAspects: {
        flexDirection: "row",
        paddingHorizontal: 10,
    },
    profifleAspectsContainer: {
        marginTop: -20,
        marginBottom: 150,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 45,
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: 'white',
        marginTop: 0,
    },
    Text: {
        fontSize: 20,
        color: 'white',
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
    Name: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    smallLogo: {
        width: 20,
        height: 20,
    },
    mediumLogo: {
        width: 50,
        height: 50,
    },
    profilepic: {
        width: 100,
        height: 100,
    },
    group: {
        width: 50,
        height: 50,
    },
});

export default GroupScreen