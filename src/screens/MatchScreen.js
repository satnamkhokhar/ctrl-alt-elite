import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

function MatchScreen () {

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
            
                <Text style={styles.DineSync}>{'\n'}DineSync</Text> 
            
                <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
                    <Image
                        source={require('../../assets/profile.png')}
                        style={styles.mediumLogo}
                    />
                </TouchableOpacity>
            </SafeAreaView>

            <SafeAreaView style={styles.messageContainer}>
                <Text style={styles.message}>the results are in...</Text>
            </SafeAreaView>

            <SafeAreaView style={styles.columnsContainer}>
                <SafeAreaView style={styles.ranking}><Text style={styles.rankingFont}>#1{'\n'}#2{'\n'}#3</Text></SafeAreaView>

                <SafeAreaView style={styles.resturantInfo}>
                <TouchableOpacity>
                       <Image
                            source={require('../../assets/phone.png')}
                            style={styles.smallLogo}
                        />
                </TouchableOpacity>
        
                <TouchableOpacity>
                    <Image
                    source={require('../../assets/map.png')}
                    style={styles.smallLogo}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image
                    source={require('../../assets/heart.png')}
                    style={styles.smallLogo}
                    />
                </TouchableOpacity>
                </SafeAreaView>
            </SafeAreaView>

            <SafeAreaView style={styles.columnsContainer}>
                <SafeAreaView style={styles.newSessionButton}>
                <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Start A New Session</Text>
                </TouchableOpacity>
                </SafeAreaView>
                
                <SafeAreaView>
                    <TouchableOpacity style={styles.saveGroup}>
                        <Image 
                            source={require('../../assets/group.png')}
                            style={styles.mediumLogo}
                        />
                    </TouchableOpacity>
                    
                </SafeAreaView>
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
        
    }, 
    DineSync: {
        fontSize: 35,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'white',
    },
    messageContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    message: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
    },
    columnsContainer: {
        flexDirection: "row"
    },
    rankingFont: {
        fontSize: 100,
        fontWeight: 'bold',
        color: 'white',
        
    }, 
    ranking: {
        width: "50%",
        paddingHorizontal: 20,
    },
    resturantInfo: {
        width: "50%",
        paddingVertical: 30,
        paddingHorizontal: 150,
    },
    smallLogo: {
        height: 25,
        width: 25,
        marginBottom: 15,
    },
    mediumLogo: {
        height: 50,
        width: 50,
    },
    button: {
        alignItems: 'center',
        borderColor:'white',
        borderWidth: 2,
        height: 50,
        width: 250,
        borderRadius: 8,
        marginTop: 15,
        justifyContent: 'center',
        backgroundColor: 'white',
        opacity: .45,
    },
    buttonText: {
        color:'#f00b0bff',
        fontSize: 22,
        fontWeight:'bold',
        textAlign:'center',
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    saveGroup: {
        justifyContent: "center",
        alignItems: "center",
        width: "38%",
        borderColor:'white',
        borderWidth: 2,
        height: 50,
        width: 150,
        borderRadius: 8,
        marginTop: -15,
    },
    newSessionButton: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: -30,
        width: "62%",
    },
});

export default MatchScreen