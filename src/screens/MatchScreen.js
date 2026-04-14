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
            <SafeAreaView style={styles.container}>
                <Text style={styles.DineSync}>{'\n'}DineSync</Text>
                
                <Text style={styles.rowTwo}>{'\n\n'}the results are in...</Text>

                <Text style={styles.rowThree}>#1{'\n'}#2{'\n'}#3</Text>

                <TouchableOpacity style={styles.logoButton}>
                       <Image
                            source={require('../../assets/images/phone.png')}
                            style={styles.phone}
                        />
                </TouchableOpacity>
        
                <TouchableOpacity style={styles.logoButton}>
                    <Image
                    source={require('../../assets/images/map.png')}
                    style={styles.map}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.DineSync}>
                    <Image
                    source={require('../../assets/images/share.png')}
                    style={styles.share}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.DineSync} onPress={() => navigation.navigate('UserProfile')}>
                    <Image
                    source={require('../../assets/images/profile.png')}
                    style={styles.profile}
                    />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Start A New Session</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Save This Group</Text>
                </TouchableOpacity>
            
                <TouchableOpacity style={styles.logoButton}>
                    <Image
                    source={require('../../assets/images/star.png')}
                    style={styles.star}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoButton}>
                    <Image
                    source={require('../../assets/images/search.png')}
                    style={styles.search}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoButton}>
                    <Image
                    source={require('../../assets/images/group.png')}
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
        fontSize: 35,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'white',
        flex: 1,
        justifyContent: 'flex-start'
    },
    rowTwo: {
        position: 'absolute',
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
        top:  30,
        left: -45
    },
    rowThree: {
        position: 'absolute',
        fontSize: 100,
        fontWeight: 'bold',
        color: 'white',
        top:  175,
        left: -15

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
        ccolor:'#f00b0bff',
        fontSize: 25,
        fontWeight:'bold',
        textAlign:'center',
    },
    phone: {
        position: 'absolute',
        top:  50,
        left: 200,
        width: 25,
        height: 25,
    },
    map: {
        position: 'absolute',
        top: 50,
        left: 200,
        width: 25,
        height: 25,
    },
    share: {
        position: 'absolute',
        top: -210,
        left: -175,
        width: 55,
        height: 55,
    },
    profile: {
        position: 'absolute',
        top: -373,
        left: 125,
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

export default MatchScreen