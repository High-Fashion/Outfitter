import React, { useState, useEffect } from "react";
import {
  Button,
  VStack,
  Text,
  ScrollView,
  Box,
  HStack,
  Modal,
  Heading,
  View,
} from "native-base";
import { useAuth } from "../contexts/Auth";
import ClothingList from "../components/ClothingList";
import Model from "../components/Model";
import capitalize from "../utils/capitalize";
import { addOutfit } from "../services/wardrobeService";
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
            <Heading>{capitalize(props.slot, true)}</Heading>
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

function depopulate(outfit) {
  var newOutfit = {}
  Object.keys(outfit).map(slot => {
    var newSlot = outfit[slot].map(item => item._id)
    newOutfit[slot] = newSlot;
  })
  return newOutfit
}

function NewOutfitScreen({ navigation, route }) {
  const { user, refreshUser } = useAuth();
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

  const submit = async () => {
    var res = await addOutfit(depopulate(outfit));
    if (res == true) {
      navigation.navigate("Outfits");
      refreshUser();
    };
  };

  return (
    <ScrollView>
      {slot && (
        <SlotModal
          slot={slot}
          setSlot={setSlot}
          addItem={addItem}
          removeItem={removeItem}
          clothing={user.wardrobe.items}
          inSlot={outfit[slot]}
        />
      )}
      <View>
        <Model setSlot={setSlot} navigation={navigation} />
        <Button onPress={() => submit()}>
          <Text>Submit</Text>
        </Button>
      </View>
    </ScrollView>
  );
}

export default NewOutfitScreen;
