import {
  AddIcon,
  Box,
  Button,
  Checkbox,
  CloseIcon,
  Fab,
  FormControl,
  HStack,
  Modal,
  ScrollView,
  Text,
  View,
  VStack,
} from "native-base";
import SearchBar from "../components/SearchBar";

import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import OutfitCard from "../components/OutfitCard";
import { useAuth } from "../contexts/Auth";

function FilterOptionsModal(props) {
  function updateFilterOptions() {
    props.close();
  }

  return (
    <Modal size="full" isOpen={props.show} onClose={props.close}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Filters</Modal.Header>
        <Modal.Body>
          <FormControl>
            <HStack justifyContent="space-between" alignItems="center">
              <FormControl.Label>Brand</FormControl.Label>
              <Checkbox />
            </HStack>
          </FormControl>
          <FormControl>
            <HStack justifyContent="space-between" alignItems="center">
              <FormControl.Label>Color</FormControl.Label>
              <Checkbox />
            </HStack>
          </FormControl>
          <FormControl>
            <HStack justifyContent="space-between" alignItems="center">
              <FormControl.Label>Pattern</FormControl.Label>
              <Checkbox />
            </HStack>
          </FormControl>
          <FormControl>
            <HStack justifyContent="space-between" alignItems="center">
              <FormControl.Label>Material</FormControl.Label>
              <Checkbox />
            </HStack>
          </FormControl>
          <FormControl>
            <HStack justifyContent="space-between" alignItems="center">
              <FormControl.Label>Fit</FormControl.Label>
              <Checkbox />
            </HStack>
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button onPress={updateFilterOptions}>Apply</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

function SortOptionsModal(props) {
  function updateSortOptions() {
    props.close();
  }

  return (
    <Modal size="full" isOpen={props.show} onClose={props.close}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Sort By</Modal.Header>
        <Modal.Body>
          <FormControl>
            <HStack justifyContent="space-between" alignItems="center">
              <FormControl.Label>Brand</FormControl.Label>
              <Checkbox />
            </HStack>
          </FormControl>
          <FormControl>
            <HStack justifyContent="space-between" alignItems="center">
              <FormControl.Label>Color</FormControl.Label>
              <Checkbox />
            </HStack>
          </FormControl>
          <FormControl>
            <HStack justifyContent="space-between" alignItems="center">
              <FormControl.Label>Pattern</FormControl.Label>
              <Checkbox />
            </HStack>
          </FormControl>
          <FormControl>
            <HStack justifyContent="space-between" alignItems="center">
              <FormControl.Label>Material</FormControl.Label>
              <Checkbox />
            </HStack>
          </FormControl>
          <FormControl>
            <HStack justifyContent="space-between" alignItems="center">
              <FormControl.Label>Fit</FormControl.Label>
              <Checkbox />
            </HStack>
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button onPress={updateSortOptions}>Apply</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

function SortBar(props) {
  const [filters, setFilters] = useState(["Filter", "Tag", "List"]);

  function removeFilter(name) {
    const newFilters = filters.filter((filter) => filter != name);
    setFilters(newFilters);
  }

  return (
    <HStack padding={1} space={3} justifyContent="space-between">
      <HStack alignItems="center">
        {filters.map((filter) => {
          const remove = () => {
            removeFilter(filter);
          };
          return (
            <Box key={filter} mx="1" px="1" bg="blueGray.300" borderRadius="lg">
              <HStack space={1} alignItems="center">
                <Text paddingBottom={1}>{filter}</Text>
                <Button
                  onPress={remove}
                  variant="ghost"
                  borderRadius="full"
                  padding={0}
                >
                  <CloseIcon size="sm" />
                </Button>
              </HStack>
            </Box>
          );
        })}
      </HStack>
      <Button borderRadius="lg" onPress={props.open}>
        Sort
      </Button>
    </HStack>
  );
}

function getOutfitString(outfit) {
  let result = "";

  Object.keys(outfit).forEach((slot) => {
    let item = outfit[slot];
    Object.keys(item).forEach((key) => {
      if (!["category", "material", "pattern", "brand"].includes(key)) return;
      if (item[key]) {
        result += item[key];
      }
    });
    if (item.colors) {
      Object.keys(item.colors).forEach((color) => {
        if (item.colors[color]) {
          result += item.colors[color];
        }
      });
    }
  });

  return result.toUpperCase();
}

function OutfitList(props) {
  return (
    <VStack space={3} mt={3}>
      {props.outfits.map((outfit) => {
        return <OutfitCard key={outfit._id} outfit={outfit} />;
      })}
    </VStack>
  );
}

function OutfitScreen({ navigation }) {
  const { user, refreshUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [outfits, setOutfits] = useState(user.wardrobe.outfits);
  const [filteredOutfitList, setFilteredOutfitList] = useState(outfits);

  const isFocused = useIsFocused();
  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      refreshUser();
    }
  }, [isFocused]);

  useEffect(() => {
    setOutfits(user.wardrobe.outfits);
  }, [user]);

  useEffect(() => {
    if (!searchQuery || searchQuery == "") {
      setFilteredOutfitList(outfits);
      return;
    }
    const newItems = outfits.filter((outfit) => {
      const outfit_data = getOutfitString(outfit);
      console.log("Outfit", outfit);
      console.log("String", outfit_data);
      const input_data = searchQuery.toUpperCase();
      return outfit_data.includes(input_data);
    });
    setFilteredOutfitList(newItems);
  }, [outfits, searchQuery]);

  function newOutfit() {
    navigation.navigate("NewOutfit");
  }

  return (
    <SafeAreaView flex={1}>
      <ScrollView>
        <VStack space={1} paddingTop={1} pb={10} w="100%">
          <View mx={2} pt={1}>
            <SearchBar
              hideFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              itemList={filteredOutfitList}
              setFilteredItemList={setFilteredOutfitList}
            />
          </View>
          <View mx="2">
            <OutfitList outfits={filteredOutfitList} />
          </View>
        </VStack>
      </ScrollView>
      <Fab
        colorScheme={"indigo"}
        renderInPortal={false}
        shadow={2}
        size="lg"
        onPress={newOutfit}
        icon={<AddIcon color="white" size="xl" />}
      />
    </SafeAreaView>
  );
}

export default OutfitScreen;
