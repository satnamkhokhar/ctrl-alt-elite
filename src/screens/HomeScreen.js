import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

function HomeScreen () {

    const navigation = useNavigation();
    
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
            
                <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
                    <Image
                        source={require('../../assets/profile.png')}
                        style={styles.mediumLogo}
                    />
                </TouchableOpacity>
            </SafeAreaView>

            <SafeAreaView style={styles.DineSyncContainer}>
                <Text style={styles.DineSync}>DineSync</Text>
            </SafeAreaView>

            <SafeAreaView style={styles.swipingContainer}>
                 <TouchableOpacity>
                       <Image
                            source={require('../../assets/dollar-sign.png')}
                            style={styles.dollarsign}
                        />
                </TouchableOpacity>
    
                <TouchableOpacity>
                    <Image
                    source={require('../../assets/globe.png')}
                    style={styles.globe}
                    />
                </TouchableOpacity>
            </SafeAreaView>

            <SafeAreaView style={styles.swipingContainer}>
                <Text style={styles.specificationsLabel}>Price Range                               Location</Text>
            </SafeAreaView>

            <SafeAreaView style={styles.swipingContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MatchScreen')}>
                    <Text style={styles.buttonText}>Start Swiping</Text>
                </TouchableOpacity>
            </SafeAreaView>


            <SafeAreaView style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('FriendsScreen')}>
                    <Image
                        source={require('../../assets/star.png')}
                        style={styles.mediumLogo}
                    />
                </TouchableOpacity>
            
                <TouchableOpacity>
                    <Image
                        source={require('../../assets/house.png')}
                        style={styles.mediumLogo}
                    />
                </TouchableOpacity>
            
                <TouchableOpacity onPress={() => navigation.navigate('GroupScreen')}>
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
        marginBottom: 100,
    },
    DineSyncContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    DineSync: {
        fontSize: 75,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'white',
    },
    swipingContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

    },
    specificationsLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white',
    }, 
    dollarsign: {
        height: 50,
        width: 50,
        marginRight: 100,
    },
    globe: {
        height: 45,
        width: 45,
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
    },
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
     footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 240,
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
});

export default HomeScreen