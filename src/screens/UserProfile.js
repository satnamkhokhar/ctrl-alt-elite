import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from '../components/UserContext';
import { useUser } from '../components/useUser';

function UserProfile () {
    const Separator = () => <View style={styles.separator} />;
    const { userData } = useContext(UserContext);
    const { logout } = useUser();
    const navigation = useNavigation()

    const signout = () => {
        logout();
        navigation.navigate('LoginScreen');
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
                <Text style={styles.DineSync}>{'\n'}DineSync</Text>

                <TouchableOpacity style={styles.DineSync}>
                    <Image
                    source={require('../../assets/images/share.png')}
                    style={styles.share}
                    />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.DineSync}>
                    <Image
                    source={require('../../assets/images/profile.png')}
                    style={styles.profile}
                    />
                </TouchableOpacity>

                <Image
                source={require('../../assets/images/profilepic.png')}
                style={styles.profilepic}
                />

                <Text style={styles.Name}>                                           First Last{'\n'}                                           username </Text>

                <Text style={styles.atSymbol}>@</Text>


                <TouchableOpacity style={styles.logoButton}>
                    <Image
                    source={require('../../assets/images/heart.png')}
                    style={styles.heart}
                    />
                </TouchableOpacity>
                <Text style={styles.Text}>             favorites</Text>
                
                <Separator/>

                <TouchableOpacity style={styles.logoButton}>
                    <Image
                    source={require('../../assets/images/clock.png')}
                    style={styles.clock}
                    />
                </TouchableOpacity>

                <Text style={styles.Text}>{'\n\n\n\n\n'}             recents</Text>

                <Separator/>

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
        justifyContent: 'center',
        //alignItems: 'center',
    },
    DineSync: {
        fontSize: 35,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'white',
        position: 'absolute',
        top: -10,
        left: 140,
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
    heart: {
        top: 35,
        left: -40,
        width: 20,
        height: 20,
    },
    clock: {
        top: 155,
        left: -40,
        width: 20,
        height: 20, 
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
    share: {
        position: 'absolute',
        top: 35,
        left: -120,
        width: 55,
        height: 55,
    },
    profile: {
        position: 'absolute',
        top: 40,
        left: 210,
        width: 50,
        height: 50,
    },
    profilepic: {
        position: 'absolute',
        top: 110,
        left: 165,
        width: 100,
        height: 100,
    },
    atSymbol: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        position: 'absolute',
        top: 220,
        left: 150,
    },
    star: {
        position: 'absolute',
        top: 300,
        left: 60,
        width: 50,
        height: 50,
    },
    search: {
        position: 'absolute',
        top: 265,
        left: 185,
        width: 45,
        height: 45,
    },
    group: {
        position: 'absolute',
        top: 200,
        left: 290,
        width: 100,
        height: 100,
    },
});

export default UserProfile