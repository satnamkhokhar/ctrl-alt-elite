import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const ALL_RESTRICTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut Allergy',
  'Shellfish Allergy',
  'Kosher',
  'Halal',
  'Pescatarian',
  'Low Sodium',
];

export default function DietaryRestrictionsSelector({ selected = [], onToggle }) {
  return (
    <View>
      {ALL_RESTRICTIONS.map((item) => {
        const isEnabled = selected.includes(item);

        return (
          <View key={item} style={styles.row}>
            <Text style={styles.label}>{item}</Text>

            <Switch
              value={isEnabled}
              onValueChange={() => onToggle(item)}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
  },
});
