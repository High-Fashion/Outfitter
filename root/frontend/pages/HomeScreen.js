import { Text, View, Button } from 'react-native';
import styles from '../Styles.js'

function HomeScreen({ navigation }) {
    return (
      <View style={styles.container}>
        <Text>Home Screen</Text>
        <Button
          title="Go to Wardrobe"
          onPress={() => navigation.navigate('Wardrobe')}
        />
      </View>
    );
}

export default HomeScreen;