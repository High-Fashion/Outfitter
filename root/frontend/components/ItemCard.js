import { HStack, Image, Text, View, VStack, Button } from "native-base";

import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 200;
const CARD_WIDTH = width - 50;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

export default function ItemCard(props) {
  const navigation = useNavigation()
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

  return (
    <View>
      <VStack alignItems="center">
        {props.item.image && <View style={styles.card}>
          <Image
            source={{ uri: props.item.image }}
            style={styles.cardImage}
            resizeMode="cover"
            alt="No image..."
          ></Image>
        </View>}
        <View style={styles.cardDescription(props)}>
          <HStack justifyContent={"flex-start"}>
          {/* <View flexDirection={"row"} alignItems={"flex-end"} backgroundColor={"gray"}> */}
            <Button size="md" variant="ghost" onPress={() => 
              // {console.log("PRESSED", props.item)}}>
              // {console.log(props.item["material"])}}>
              {navigation.navigate("EditItem", {type: "clothing", item: props.item})}}>
              ...
            </Button>
          {/* </View> */}
          </HStack>
          <VStack space={2} alignItems="center">
            <Text numberOfLines={1} style={styles.cardtitle}>
              {getText(props.item)}
            </Text>
            {(!props.hideButtons || props.hideButtons == false) && (
              <HStack space={2}>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.button1, {}]}
                >
                  <Text textAlign="center" lineHeight={30}>
                    Item Details
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.button2, {}]}
                >
                  <Text textAlign="center" lineHeight={30} fontSize={12}>
                    Delete Item
                  </Text>
                </TouchableOpacity>
              </HStack>
            )}
          </VStack>
        </View>
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderColor: "#102f42",
    borderWidth: 2,
    height: 220,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    borderTopRightRadius: 13,
    borderTopLeftRadius: 13,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  cardtitle: {
    fontSize: 20,
    marginTop: 10,
    //fontWeight: "bold",
  },
  cardDescription: props => ({
    height: 80,
    alignItems: "center",
    fontSize: 20,
    color: "#478bb5",
    width: CARD_WIDTH,
    borderTopLeftRadius: props.item.image ? 0 : 15,
    borderTopRightRadius: props.item.image ? 0 : 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: "#aed0e6",
    borderWidth: 2,
    borderColor: "#102f42",
    marginLeft: 20,
    marginRight: 20,
  }),

  button1: {
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    width: 250,
    height: 33,
    borderColor: "#102f42",
    backgroundColor: "#478bb5",
    borderRadius: 40,
  },

  button2: {
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    width: 75,
    height: 33,
    borderColor: "#102f42",
    backgroundColor: "#478bb5",
    borderRadius: 40,
  },
  // editButton: {
  //   top: 0,
  //   right: 0,
  // },
});
