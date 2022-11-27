import {
  Text,
  View,
  Button,
  VStack,
  AddIcon,
  Fab,
  ScrollView,
  HStack,
  Input,
  SearchIcon,
  Modal,
  FormControl,
  Checkbox,
  CloseIcon,
  Center,
  Box,
} from "native-base";
import SearchBar from "../components/SearchBar";

import { React, useState, useEffect } from "react";
import OutfitCard from "../components/OutfitCard";
import { useAuth } from "../contexts/Auth";
import { SafeAreaView } from "react-native-safe-area-context";

function FilterOptionsModal(props) {
  function updateFilterOptions() {
    props.close();
  }

  return (
    <Modal size="full" isOpen={props.show} onClose={() => props.close()}>
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
            <Button onPress={() => updateFilterOptions()}>Apply</Button>
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
    <Modal size="full" isOpen={props.show} onClose={() => props.close()}>
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
            <Button onPress={() => updateSortOptions()}>Apply</Button>
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
                  onPress={() => remove()}
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
      <Button borderRadius="lg" onPress={() => props.open()}>
        Sort
      </Button>
    </HStack>
  );
}

function getOutfitString(outfit) {
  var result = "";

  Object.keys(outfit).map((slot) => {
    var item = outfit[slot];
    Object.keys(item).map((key) => {
      if (!["category", "material", "pattern", "brand"].includes(key)) return;
      if (item[key]) {
        result += item[key];
      }
    });
    if (item.colors) {
      Object.keys(item.colors).map((color) => {
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
    <VStack>
      {props.outfits.map((outfit) => {
        return <OutfitCard outfit={outfit} />;
      })}
    </VStack>
  );
}

function OutfitScreen({ navigation }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [outfits, setOutfits] = useState(user.wardrobe.outfits);
  const [filteredOutfitList, setFilteredOutfitList] = useState(outfits);

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

  return (
    <SafeAreaView flex={1}>
      <ScrollView>
        <VStack space={1} paddingTop={1} w="100%">
          <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          itemList={filteredOutfitList}
          setFilteredItemList={setFilteredOutfitList}/>
          <SortBar />
          <Text>{searchQuery}</Text>
          <OutfitList outfits={user.wardrobe.outfits} />
        </VStack>
      </ScrollView>
      <Fab
        renderInPortal={false}
        shadow={2}
        size="lg"
        onPress={() => {
          navigation.navigate("NewOutfit");
        }}
        icon={<AddIcon color="white" size="xl" />}
      />
    </SafeAreaView>
  );
}

export default OutfitScreen;
