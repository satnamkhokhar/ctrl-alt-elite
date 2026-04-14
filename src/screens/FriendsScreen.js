import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
//import filter from 'lodash.filter';
//import { ActivityIndicator, FlatList, Image, View} from 'react-native';

//const API_ENDPOINT = 'url'

function FriendsScreen () {
    const[searchQuery, setSearchQuery] = useState("")
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [fullData, setFullData] = useState([]);

/* the search feature, when connected to backend
    const handleSearch = () => {
        setSearchQuery(query);
        const formattedQuery = query.toLowerCase();
        const filteredData = filter(fullData, (user) => {
            return contains(user, formattedQuery);
        });
        setData(filteredData);
    };

    const contains = ({name, username}, query) => {
        const {first, last} = name;

        if(
        first.includes(query) || 
        last.includes(query) || 
        username.includes(query)
    ) {
            return true;
        }
        return false;
    }
    
    useEffect(() => {
        setIsLoading(true);
        fetchData(API_ENDPOINT);
    }, []);

    const fetchData = async(url) => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            setData(json.results);

            console.log(json.results);
            setFullData(json.results);
            setIsLoading(false);
        } catch(error) {

            setError(error);
            console.log();
        }
    }

    if( isLoading ) {
        return (
            <SafeAreaView style={styles.loading}>
                <ActivityIndicator size={'large'} color='white'/>
            </SafeAreaView>
        );
    }

    if( error ) {
        return (
            <SafeAreaView style={styles.loading}>
                <Text>Error in fetching data ... Please check your internet connection!</Text>
            </SafeAreaView>
        )
    }
*/
    return (
        <SafeAreaProvider>    
           <LinearGradient
            colors={['#f00b0bff', '#c76d18ff']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            > 

            <SafeAreaView style={styles.searchBarContainer}>
                <SafeAreaView style={styles.barContainer}>
                    <TextInput style={styles.searchbar}
                    placeholder='Search'
                    placeholderTextColor="white"
                    clearButtonMode='always'
                    autoCapitalize='none'
                    autoCorrect={false}
                    //value={searchQuery}
                    //onChangeText={(query) => handleSearch(query)}
                />
                </SafeAreaView>
                <SafeAreaView style={styles.searchContainer}>
                    <TouchableOpacity>
                        <Image
                            source={require('../../assets/search.png')}
                            style={styles.mediumLogo}
                        />
                    </TouchableOpacity>
                </SafeAreaView>
            </SafeAreaView>

            <FlatList 
            /*
            data={data}
            keyExtractor={(item) => item.username.key}
            renderItem={({item}) => (
                <View style={styles.itemContainer}>
                    <Image source={{uri: item.profile.picture.key}} style={styles.image} />
                    <View>
                        <Text> style={styles.textName}{item.name.first} {item.name.last}</Text>
                        <Text> style={styles.textUsername}{item.username}</Text>
                    </View>

                </View>
            )} */
            />
                
            </LinearGradient>
        </SafeAreaProvider>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBarContainer: {
        marginHorizontal: 20,
        flexDirection: "row",
    },
    searchbar: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 8,
        color: "white",
        marginTop: 20,
    },
    searchContainer: {
        width: "10%",
        marginTop: 25,
        marginLeft: 15,
    },
    barContainer: {
        width: "90%",
    },
    loading: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
        marginTop: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    textName: {
        fontSize: 17,
        marginLeft: 10,
        fontWeight: "600",
    },
    textUsername: {
        fontSize: 14,
        marginLeft: 10,

    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 240,
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    mediumLogo: {
        height: 30,
        width: 30,
    },
});

export default FriendsScreen