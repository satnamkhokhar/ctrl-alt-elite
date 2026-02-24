import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

const App = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>DineSync</Text>
        </View>
    )
}
export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    text: {
        color: 'green',
        fontSize: 42,
        fontWeight: 'bold',
        textAlign: 'center',
    }
})
