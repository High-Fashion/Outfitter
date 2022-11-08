import React, { Component, useState, useEffect } from "react";
import {
  Button,
  VStack,
  Text,
  FormControl,
  Input,
  Checkbox,
  ScrollView,
  Select,
  Fab,
  Image,
  Center,
  View,
  Box,
} from "native-base";
import { useAuth } from "../contexts/Auth";

const clothingSlots = require("../assets/clothing_slots.json");

function Model(props) {
  return (
    <Center>
      <VStack alignItems="center">
        <Image
          source={require("../assets/bodytypes/men_inverted_triangle.png")}
        />
        <Box
          height="100%"
          width="20%"
          borderColor="black"
          borderWidth={1}
          zIndex={1}
          position="absolute"
          paddingTop="5"
          paddingBottom="3"
          justifyContent="space-between"
        >
          <Button flex="1" variant="ghost" borderRadius="full">
            <Text>Head</Text>
          </Button>
          <Button flex="2" variant="ghost">
            <Text>Torso</Text>
          </Button>
          <Button flex="2" variant="ghost">
            <Text>Legs</Text>
          </Button>
          <Button flex="1" variant="ghost">
            <Text>Feet</Text>
          </Button>
        </Box>
      </VStack>
    </Center>
  );
}

function NewOutfitScreen({ navigation }) {
  const { user } = useAuth();
  const [formData, setData] = useState({});

  const submit = async () => {};

  return (
    <ScrollView>
      <VStack mx="3" space={2} paddingTop={3} paddingBottom={7}>
        <Box borderColor="black" borderWidth={1}>
          <Model />
        </Box>
        <Button onPress={() => submit()}>
          <Text>Submit</Text>
        </Button>
      </VStack>
    </ScrollView>
  );
}

export default NewOutfitScreen;
