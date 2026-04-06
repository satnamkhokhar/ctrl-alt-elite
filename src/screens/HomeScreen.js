import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

function HomeScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaProvider>    
           <LinearGradient
            colors={['#f00b0bff', '#c76d18ff']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            > 
            <SafeAreaView style={styles.container}>
                <Text style={styles.DineSync}>{'\n'}DineSync</Text>
                <Text style={styles.rowTwo}>{'\n\n\n\n'}Price Range            Cuisine              Location</Text> 
                
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => navigation.navigate('SessionScreen')}
                > 
                    <Text style={styles.buttonText}>Start Session</Text>
                </TouchableOpacity> 
            
                <TouchableOpacity style={styles.logoButton}>
                    <Image
                        source={require('../../assets/dollar-sign.png')}
                        style={styles.dollarSign}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoButton}>
                    <Image
                        source={require('../../assets/cuisine.png')}
                        style={styles.cuisine}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoButton}>
                    <Image
                        source={require('../../assets/map.png')}
                        style={styles.map}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoButton}>
                    <Image
                        source={require('../../assets/share.png')}
                        style={styles.share}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoButton}>
                    <Image
                        source={require('../../assets/profile.png')}
                        style={styles.profile}
                    />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.logoButton}>
                    <Image
                        source={require('../../assets/star.png')}
                        style={styles.star}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoButton}>
                    <Image
                        source={require('../../assets/search.png')}
                        style={styles.search}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoButton}>
                    <Image
                        source={require('../../assets/group.png')}
                        style={styles.group}
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    DineSync: {
        fontSize: 75,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'white',
    },
    rowTwo: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white',

    }, 
    button: {
        alignItems: 'center',
        borderColor:'white',
        borderWidth: 2,
        height: 50,
        width: 300,
        borderRadius: 8,
        marginTop: 15,
        justifyContent: 'center',
        backgroundColor: 'white',
        opacity: .45,
    },
    logoButton: {
        alignItems: 'center',
        height: 30,
        width: 150,
        marginBottom: 8,
        justifyContent: 'center',
    },
    buttonText: {
        color:'#f00b0bff',
        fontSize: 25,
        fontWeight:'bold',
        textAlign:'center',
    },
    dollarSign: {
        position: 'absolute',
        top:  -140,
        left: -40,
        width: 50,
        height: 50,
    },
    cuisine: {
        position: 'absolute',
        top: -180,
        left: 55,
        width: 60,
        height: 60,
    },
    map: {
        position: 'absolute',
        top: -210,
        left: 150,
        width: 45,
        height: 45,
    },
    share: {
        position: 'absolute',
        top: -440,
        left: -100,
        width: 55,
        height: 55,
    },
    profile: {
        position: 'absolute',
        top: -475,
        left: 200,
        width: 50,
        height: 50,
    },
    star: {
        position: 'absolute',
        top: 60,
        left: -75,
        width: 50,
        height: 50,
    },
    search: {
        position: 'absolute',
        top: 25,
        left: 60,
        width: 45,
        height: 45,
    },
    group: {
        position: 'absolute',
        top: -40,
        left: 155,
        width: 100,
        height: 100,
    },
});

export default HomeScreen;
