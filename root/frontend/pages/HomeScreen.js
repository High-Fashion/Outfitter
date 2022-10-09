import { Text, View, Button, VStack } from "native-base";

function HomeScreen({ navigation }) {
  return (
    <View>
      <VStack space={2}>
        <Text>Home Screen</Text>
        <Button
          title="Go to Wardrobe"
          onPress={() => navigation.navigate("Wardrobe")}
        >
          <Text>Wardrobe</Text>
        </Button>
        <Button
          onPress={() => navigation.navigate("NewItem")}
        >
          New Item
        </Button>
      </VStack>
    </View>
  );
}

export default HomeScreen;
