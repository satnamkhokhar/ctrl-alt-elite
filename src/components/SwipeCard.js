import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const getCategoryLabel = (restaurant) => {
    const raw = restaurant.cuisine || restaurant.category;
    if (raw) {
        // Clean up raw Geoapify tags like "building, building.catering, catering.restaurant.italian"
        const parts = raw.split(',').map(s => s.trim());
        for (const part of parts.reverse()) {
            const segments = part.split('.');
            if (segments.length >= 3 && segments[0] === 'catering') {
                return segments[segments.length - 1].replace(/_/g, ' ')
                    .replace(/\b\w/g, c => c.toUpperCase());
            }
        }
        // If it's already a clean label (no dots), return it
        if (!raw.includes('.')) return raw;
    }
    return 'Restaurant';
};

const getCategoryEmoji = (categoryText = '') => {
    const category = categoryText.toLowerCase();

    if (category.includes('italian') || category.includes('pizza')) return '🍕';
    if (category.includes('chinese') || category.includes('asian')) return '🥡';
    if (category.includes('mexican') || category.includes('taco')) return '🌮';
    if (category.includes('japanese') || category.includes('sushi')) return '🍣';
    if (category.includes('american')) return '🍔';
    if (category.includes('indian')) return '🍛';
    if (category.includes('vegan') || category.includes('vegetarian')) return '🥗';
    if (category.includes('mediterranean')) return '🥙';
    if (category.includes('cafe') || category.includes('coffee')) return '☕';

    return '🍽️';
};

const formatDistance = (distance) => {
    if (distance === null || distance === undefined || distance === '') {
        return 'Distance unavailable';
    }

    const numericDistance = Number(distance);

    if (Number.isNaN(numericDistance)) {
        return `${distance} mi away`;
    }

    return `${numericDistance.toFixed(1)} mi away`;
};

function SwipeCard({ restaurant }) {
    const categoryLabel = getCategoryLabel(restaurant);
    const emoji = getCategoryEmoji(restaurant.cuisine || categoryLabel);

    return (
        <View style={styles.card}>
            <Text style={styles.emoji}>{emoji}</Text>

            <Text style={styles.name}>
                {restaurant.name || 'Unknown Restaurant'}
            </Text>

            <Text style={styles.category}>{categoryLabel}</Text>

            <Text style={styles.distance}>
                {formatDistance(restaurant.distance)}
            </Text>

            <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoText}>
                    {restaurant.formatted_address
                        ? restaurant.formatted_address.split(', ').slice(1).join(', ')
                        : 'Address unavailable'}
                </Text>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoText}>
                    {restaurant.phone || restaurant.phone_number || 'Phone unavailable'}
                </Text>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Website</Text>
                {restaurant.website ? (
                    <TouchableOpacity onPress={() => Linking.openURL(restaurant.website)}>
                        <Text style={[styles.infoText, styles.link]}>
                            {restaurant.website}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.infoText}>Website unavailable</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'black',
        paddingVertical: 20,
        paddingHorizontal: 18,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    emoji: {
    fontSize: 52,
    marginBottom: 12,
    },
    name: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    },
    category: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    },
    distance: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    infoBox: {
        width: '100%',
        marginBottom: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: '#fff7fa',
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
    },
    infoText: {
        fontSize: 14,
        textAlign: 'center',
    },
    link: {
        color: '#f00b0bff',
        textDecorationLine: 'underline',
    },
});

export default SwipeCard;
