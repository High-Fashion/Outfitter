import {
  Button,
  FlatList,
  HStack,
  Image,
  Text,
  View,
  VStack,
} from "native-base";

import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/Auth";
import { deleteOutfit } from "../services/wardrobeService";
import capitalize from "../utils/capitalize";
import ItemCard from "./ItemCard";
const { width, height } = Dimensions.get("window");

//https://www.geeksforgeeks.org/flatten-javascript-objects-into-a-single-depth-object/
const flattenObj = (ob) => {
  let result = {};
  for (const i in ob) {
    if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
      const temp = flattenObj(ob[i]);
      for (const j in temp) {
        result[i + "." + j] = temp[j];
      }
    } else {
      result[i] = ob[i];
    }
  }
  return result;
};

const getText = (item) => {
  var text = "";
  if (item.colors) {
    if (item.colors.primary) text += item.colors.primary;
    if (item.colors.tertiary) {
      text += ", " + item.colors.secondary + ", and " + item.colors.tertiary;
    } else if (item.colors.secondary) {
      text += " and " + item.colors.secondary;
    }
  }
  if (item.brand) text += " " + item.brand;
  if (item.material) text += " " + item.material;
  if (item.category)
    text +=
      " " + item.category.charAt(0).toUpperCase() + item.category.slice(1);
  return text;
};

export default function OutfitCard(props) {
  const outfit = flattenObj(props.outfit);
  const { refreshUser } = useAuth();
  const remove = async (id) => {
    const response = await deleteOutfit(id);
    if (response) {
      refreshUser();
    }
  };

  return (
    <VStack p={3} space="1" borderRadius="xl" style={styles.card}>
      {Object.keys(outfit).map((slot) => {
        if (
          slot == "user" ||
          slot == "_id" ||
          slot == "id" ||
          outfit[slot].length == 0
        )
          return;
        return (
          <HStack p={1} alignItems="center" justifyContent="space-between">
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text>{capitalize(slot)}</Text>
            </View>
            {outfit[slot].map((item) => {
              return (
                <View
                  style={{ flex: 5, flexDirection: "row" }}
                  bgColor={"blueGray.400"}
                  borderRadius="lg"
                >
                  <Text p={1} style={{ flexShrink: 1 }}>
                    {getText(item)}
                  </Text>
                </View>
              );
            })}
          </HStack>
        );
      })}
      <HStack space="0">
        <Button
          borderRightRadius={0}
          bgColor="blueGray.600"
          borderWidth="2"
          borderColor="blueGray.900"
          borderRightWidth={1}
          flex={1}
          onPress={() => remove(outfit._id)}
        >
          <Text>Edit</Text>
        </Button>
        <Button
          bgColor="blueGray.600"
          borderWidth="2"
          borderLeftWidth={1}
          borderColor="blueGray.900"
          flex={1}
          borderLeftRadius={0}
          onPress={() => remove(outfit._id)}
        >
          <Text>Delete</Text>
        </Button>
      </HStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "black",
  },
});
