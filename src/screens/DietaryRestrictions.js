import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import * as validator from 'email-validator';
import { MaterialIcons } from '@expo/vector-icons';
//import CheckBox from '../CheckBox';
import { CheckBox } from 'react-native-web';

function DietaryRestrictions () { 
 const [dietaryRestrictions, setDietaryRestrictions] = useState([]);

    return( 
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <CheckBox
                value={checked}
                onValueChange={setChecked}
            />
            <Text style={{ marginLeft: 8 }}> My Checkbox Label</Text>
            </View>
    )}
   
   /* 

    let updateCheckedValues = [...checkedValues];
    return (<View>style={[styles.container, style]};
    {options.map((option) => {
        let active = updateCheckedValues.includes(option.value);

        return (
            <Text> style={styles.text} Choose all that apply: </Text>
            checkedValues={dietaryRestrictions}
            onChange={setDietaryRestrictions}
            style={{ marginBottom: 15 }}
            />
            <TouchableOpacity
            style={active ? [styles.checkBoxes,
                style.activeCheckBox] : styles.checkBoxes}
            onPress={() => {
                if (active) {
                    updateCheckedValues = updateCheckedValues.filter((checkedValue) => checkedValue !== option.value)
                    return onChange(updatedCheckedValues);
                }

                updateCheckedValues.push(option.value);
                onChange(updateCheckedValues);
                }}
                key={option.value}
                >
                <MaterialIcons 
                name={active ? 'check-box': 'check-box-outline-blank'}
                size={24}
                color={active ? '#06b6d4' : '#64748b'}/>
                <Text
                    style={active ? [styles.text, styles.activeText] : styles.text}>
                    {option.label}
                </Text>
            </TouchableOpacity>
        )
    })}
    </View>)

        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
            <Text> style={styles.text} Choose all that apply: </Text>

            <checkBox options={[
                {label: 'dairy free', value: 'dairy free'},
                {label: 'vegan', value: 'vegan'},
                {label: 'gluten free', value: 'gluten free'},
            ]} 
            checkedValues={dietaryRestrictions}
            onChange={setDietaryRestrictions}
            style={{ marginBottom: 15 }}
            />
            </SafeAreaView>
        </SafeAreaProvider>
);
*/

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'pink',
        justifyContent:'center'
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black'
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        height: 30,
        width: 175,
        fontSize: 16,
        marginBottom: 16,
        borderRadius: 8,
        textAlign: 'center'
    },
    button: {
        alignItems: 'center',
        backgroundColor: 'mediumspringgreen',
        borderColor:'black',
        borderWidth: 2,
        height: 30,
        width: 75,
        borderRadius: 8
    },
    checkBoxes: {
        height: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 15,
        borderRadius: 15,
    },
    activeCheckBox: {
        backgroundColor: '#06b6d4' + '11',
    },
    buttonText: {
        color:'black',
        fontSize: 16,
        fontWeight:'bold',
        textAlign:'center',
    },
    text: {
        fontSize: 16,
        marginLeft: 15,
        color: '#6b7280',
    },
    activeText: {
        color: '#374151'
    },
    errorText: {
        color: 'red',
    },
});
export default DietaryRestrictions;