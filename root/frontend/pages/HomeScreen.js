import { Text, View, Button } from "native-base";

function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="Go to Wardrobe"
        onPress={() => navigation.navigate("Wardrobe")}
      >
        <Text>Wardrobe</Text>
      </Button>
    </View>
  );
}

export default HomeScreen;
