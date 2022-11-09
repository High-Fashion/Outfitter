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
  HStack,
  Modal,
  Heading,
} from "native-base";
import { HeaderBackButton } from "@react-navigation/elements";
import { useAuth } from "../contexts/Auth";
import ClothingList from "../components/ClothingList";

const clothingSlots = require("../assets/clothing_slots.json");

function ItemSearchModal(props) {
  const [selected, setSelected] = useState([]);

  return (
    <Modal size="full" isOpen={props.open}>
      <Modal.Content>
        <Modal.CloseButton onPress={props.close} />
        <Modal.Header>Clothing</Modal.Header>
        <Modal.Body>
          <ScrollView>
            <ClothingList
              select
              hideButtons={true}
              selected={selected}
              setSelected={setSelected}
              value={props.clothing}
            />
          </ScrollView>
        </Modal.Body>
        <Modal.Footer>
          <HStack flex="1" justifyContent="space-between">
            <Button onPress={() => setSelected([])}>
              <Text>Clear</Text>
            </Button>
            <Button
              onPress={() => {
                selected.map((s) => {
                  props.addItem(s, props.slot);
                });
                setSelected([]);
                props.close();
              }}
            >
              <Text>Add Selected Items</Text>
            </Button>
          </HStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

function SlotModal(props) {
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  useEffect(() => {
    setOpen(props.slot != null);
  }, [props.slot]);

  const clear = () => {
    props.inSlot.map((i) => {
      props.removeItem(i, props.slot);
    });
  };

  return (
    <>
      <ItemSearchModal
        close={() => setOpenSearch(false)}
        open={openSearch}
        clothing={props.clothing}
        addItem={props.addItem}
        slot={props.slot}
      />
      <Modal size="full" isOpen={open}>
        <Modal.Content>
          <Modal.CloseButton onPress={() => props.setSlot(null)} />
          <Modal.Header alignItems="center">
            <Heading>
              {String(props.slot).charAt(0).toUpperCase() +
                String(props.slot).slice(1)}
            </Heading>
          </Modal.Header>
          <Modal.Body>
            <ClothingList
              hideButtons={true}
              value={props.inSlot}
              emptyComponent={<Text>No items on {props.slot}</Text>}
            />
          </Modal.Body>
          <Modal.Footer>
            <HStack flex={1} justifyContent="space-between">
              <Button onPress={clear}>
                <Text>Clear</Text>
              </Button>
              <Button onPress={() => setOpenSearch(true)}>
                <Text>{"Add item to " + props.slot}</Text>
              </Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}

function Model(props) {
  const [focus, setFocus] = useState("whole");

  useEffect(() => {
    if (focus != "whole") {
      props.navigation.setOptions({
        headerLeft: () => (
          <HeaderBackButton onPress={() => setFocus("whole")} />
        ),
        headerTitle: focus,
      });
    } else {
      props.navigation.setOptions({
        headerLeft: () => (
          <HeaderBackButton onPress={() => props.navigation.goBack()} />
        ),
        headerTitle: "New Outfit",
      });
    }
  }, [focus]);

  const { setSlot } = props;
  return (
    <Center>
      {focus == "whole" && (
        <VStack alignItems="center">
          <Image
            source={require("../assets/bodytypes/men_inverted_triangle.png")}
          />
          <Box
            height="100%"
            width="30%"
            zIndex={1}
            position="absolute"
            paddingTop="6"
            paddingBottom="6"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              width="40%"
              onPress={() => setFocus("head")}
              flex={1}
              borderRadius="full"
              variant="outline"
            ></Button>
            <HStack flex={3} justifyContent="space-between">
              <Button
                variant="outline"
                flex={1}
                onPress={() => setFocus("arms")}
              ></Button>
              <Button
                variant="outline"
                flex={5}
                onPress={() => setSlot("torso")}
              ></Button>
              <Button
                variant="outline"
                flex={1}
                onPress={() => setFocus("arms")}
              ></Button>
            </HStack>
            <Button
              width="50%"
              flex={4}
              onPress={() => setFocus("legs")}
              variant="outline"
            ></Button>
          </Box>
        </VStack>
      )}
      {focus == "head" && (
        <VStack alignItems="center">
          <Image
            resizeMode="cover"
            maxHeight="400"
            source={require("../assets/men_head.png")}
          />
          <VStack
            height="80%"
            zIndex={2}
            position="absolute"
            paddingTop="5"
            paddingBottom="3"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              variant="outline"
              width="60%"
              flex={8}
              onPress={() => setSlot("hat")}
            >
              <Text>Hat</Text>
            </Button>

            <HStack justifyContent="space-between" width="70%" flex={6}>
              <Button
                flex={1}
                variant="outline"
                onPress={() => setSlot("eyes")}
              >
                <Text>Eyes</Text>
              </Button>
            </HStack>
            <HStack justifyContent="space-between" width="65%" flex={8}>
              <Button
                flex={1}
                variant="outline"
                onPress={() => setSlot("left ear")}
              >
                <Text>LE</Text>
              </Button>
              <Button flex={1} variant="ghost"></Button>
              <Button
                flex={5}
                variant="outline"
                onPress={() => setSlot("nose")}
              >
                <Text>Nose</Text>
              </Button>
              <Button flex={1} variant="ghost"></Button>
              <Button
                flex={1}
                variant="outline"
                onPress={() => setSlot("right ear")}
              >
                <Text>RE</Text>
              </Button>
            </HStack>
            <Button
              width="55%"
              variant="outline"
              flex={4}
              onPress={() => setSlot("mouth")}
            >
              <Text>Mouth</Text>
            </Button>
            <Button
              width="50%"
              variant="outline"
              flex={8}
              onPress={() => setSlot("neck")}
            >
              <Text>Neck</Text>
            </Button>
          </VStack>
        </VStack>
      )}
      {focus == "legs" && (
        <VStack alignItems="center">
          <View
            borderColor="black"
            borderWidth="2"
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              height: 400,
              overflow: "hidden",
            }}
          >
            <Image
              style={{
                resizeMode: "stretch",
                height: 800,
                width: 400,
                bottom: 150,
              }}
              source={require("../assets/bodytypes/men_inverted_triangle.png")}
            />
          </View>
          <VStack
            height="100%"
            zIndex={2}
            position="absolute"
            paddingTop="2"
            paddingBottom="3"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              variant="outline"
              width="60%"
              flex={1}
              onPress={() => setSlot("waist")}
            >
              <Text>Waist</Text>
            </Button>
            <Button
              width="55%"
              variant="outline"
              flex={1}
              onPress={() => setSlot("hips")}
            >
              <Text>Hips</Text>
            </Button>
            <Button
              width="50%"
              variant="outline"
              flex={8}
              onPress={() => setSlot("pants")}
            >
              <Text>Pants</Text>
            </Button>
            <HStack justifyContent="space-between" width="50%" flex={1}>
              <Button
                flex={1}
                variant="outline"
                onPress={() => setSlot("left ankle")}
              >
                <Text>Left Ankle</Text>
              </Button>
              <Button
                flex={1}
                variant="outline"
                onPress={() => setSlot("right ankle")}
              >
                <Text>Right Ankle</Text>
              </Button>
            </HStack>
            <HStack flex={2}>
              <Button variant="outline" onPress={() => setSlot("left foot")}>
                <Text>Left Foot</Text>
              </Button>
              <Button variant="outline" onPress={() => setSlot("right foot")}>
                <Text>Right Foot</Text>
              </Button>
            </HStack>
          </VStack>
        </VStack>
      )}
    </Center>
  );
}

function NewOutfitScreen({ navigation, route }) {
  const { user } = useAuth();
  const [outfit, setOutfit] = useState({});
  const [slot, setSlot] = useState();

  const addItem = (item, slot) => {
    if (outfit[slot]) {
      setOutfit({ ...outfit, [slot]: [...outfit[slot], item] });
    } else {
      setOutfit({ ...outfit, [slot]: [item] });
    }
  };

  const removeItem = (item, slot) => {
    setOutfit({ ...outfit, [slot]: outfit[slot].filter((i) => i != item) });
  };

  const submit = async () => {};

  return (
    <ScrollView>
      <SlotModal
        slot={slot}
        setSlot={setSlot}
        addItem={addItem}
        removeItem={removeItem}
        clothing={user.wardrobe.items}
        inSlot={outfit[slot]}
      />
      <VStack mx="3" space={2} paddingTop={3} paddingBottom={7}>
        <Box borderColor="black" borderWidth={1}>
          <Model setSlot={setSlot} navigation={navigation} />
        </Box>
        <Button onPress={() => submit()}>
          <Text>Submit</Text>
        </Button>
      </VStack>
    </ScrollView>
  );
}

export default NewOutfitScreen;
