import { AddIcon, Fab, ScrollView, View, VStack } from "native-base";
import SearchBar from "../components/SearchBar";

import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import OutfitCard from "../components/OutfitCard";
import { useAuth } from "../contexts/Auth";

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

  const newOutfit = useCallback(
    () => navigation.navigate("NewOutfit"),
    [navigation]
  );

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
