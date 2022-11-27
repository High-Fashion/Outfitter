import {useState, useEffect} from "react"
import {
  Button,
  FlatList,
  HStack,
  Image,
  Text,
  View,
  VStack,
  Modal,
  IconButton,
  Icon
} from "native-base";
import { AntDesign } from '@expo/vector-icons'; 
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/Auth";
import { deleteOutfit } from "../services/wardrobeService";
import { editOutfit } from "../services/wardrobeService";
import { updateUser } from "../services/userService"
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

function RatingModal(props){
  return(
    <Modal  size="full" isOpen={props.showRatingModal} onClose={() => props.setShowRatingModal(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton/>
        <Modal.Header>Outfit rating</Modal.Header>
          <Modal.Body>
            <HStack p={1} alignItems="center" justifyContent="space-between">
              <View style={{ flex: 1, alignItems: "center" }}>
                <View style={{ flex: 5, flexDirection: "row" }}>
                  <IconButton
                    p={1}
                    icon={props.rating >= 1? <AntDesign name="star" size={24} color="black" /> :
                    <AntDesign name="staro" size={24} color="black" />}
                    onPress={() => props.setRating(1)}
                  />
                  <IconButton
                    p={1}
                    icon={props.rating >= 2? <AntDesign name="star" size={24} color="black" /> :
                    <AntDesign name="staro" size={24} color="black" />}
                    onPress={() => props.setRating(2)}
                  />
                  <IconButton
                    p={1}
                    icon={props.rating >= 3? <AntDesign name="star" size={24} color="black" /> :
                    <AntDesign name="staro" size={24} color="black" />}
                    onPress={() => props.setRating(3)}
                  />
                  <IconButton
                    p={1}
                    icon={props.rating >= 4? <AntDesign name="star" size={24} color="black" /> :
                    <AntDesign name="staro" size={24} color="black" />}
                    onPress={() => props.setRating(4)}
                  />
                  <IconButton
                    p={1}
                    icon={props.rating >= 5? <AntDesign name="star" size={24} color="black" /> :
                    <AntDesign name="staro" size={24} color="black" />}
                    onPress={() => props.setRating(5)}
                  />
                    <Button
                  bgColor="blueGray.600"
                  borderWidth="2"
                  borderLeftWidth={2}
                  borderColor="blueGray.900"
                  flex={1}
                  borderLeftRadius={0}
                  onPress = {() => props.setShowRatingModal(false)}
                >
                  Rate
                </Button>
                </View>
              </View>
            </HStack>
          </Modal.Body>
       </Modal.Content>
    </Modal>
  );
}

const StarRating = (props) => {
  return(
    <HStack p={1} alignItems="center" justifyContent="space-between">
        <View style={{ flex: 1, alignItems: "center" }}>
          <View style={{ flex: 5, flexDirection: "row" }}>
            <IconButton
              p={1}
              icon={props.rating >= 1? <AntDesign name="star" size={24} color="black" /> :
               <AntDesign name="staro" size={24} color="black" />}
               disabled={true}
            />
            <IconButton
              p={1}
              icon={props.rating >= 2? <AntDesign name="star" size={24} color="black" /> :
               <AntDesign name="staro" size={24} color="black" />}
               disabled={true}
            />
            <IconButton
              p={1}
              icon={props.rating >= 3? <AntDesign name="star" size={24} color="black" /> :
               <AntDesign name="staro" size={24} color="black" />}
               disabled={true}
            />
            <IconButton
              p={1}
              icon={props.rating >= 4? <AntDesign name="star" size={24} color="black" /> :
               <AntDesign name="staro" size={24} color="black" />}
               disabled={true}
            />
            <IconButton
              p={1}
              icon={props.rating >= 5? <AntDesign name="star" size={24} color="black" /> :
               <AntDesign name="staro" size={24} color="black" />}
               disabled={true}
            />
              <Button
            bgColor="blueGray.600"
            borderWidth="2"
            borderLeftWidth={2}
            borderColor="blueGray.900"
            flex={1}
            borderLeftRadius={0}
            onPress={() => props.setShowRatingModal(true)}
          >
            Rate
          </Button>
          </View>
        </View>
      </HStack>
  );
}

export default function OutfitCard(props) {
  const [rating, setRating] = useState(0);
  const outfit = flattenObj(props.outfit);
  const { refreshUser } = useAuth();
  const [showRatingModal, setShowRatingModal] = useState(false)
  
  
  const remove = async (id) => {
    const response = await deleteOutfit(id);
    if (response) {
      refreshUser();
    }
  };

  const edit = async (id, outfit) => {
    const response = await editOutfit(id, outfit);
    if (response) {
      refreshUser();
    }
  }

  

  return (
    <VStack>
      <RatingModal
      rating={rating} 
      setRating={setRating}
      showRatingModal={showRatingModal}
      setShowRatingModal={setShowRatingModal}
      />
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
      <StarRating 
      rating={rating} 
      setRating={setRating}
      showRatingModal={showRatingModal}
      setShowRatingModal={setShowRatingModal}
      />
      <HStack space="0">
        <Button
          borderRightRadius={0}
          bgColor="blueGray.600"
          borderWidth="2"
          borderColor="blueGray.900"
          borderRightWidth={1}
          flex={1}
        >
          Edit
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
          Delete
        </Button>
      </HStack>
    </VStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
  star: {
    height: 40,
    width: 40,
  },
  card: {
    borderWidth: 1,
    borderColor: "black",
  },
});
