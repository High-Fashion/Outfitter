import OutfitCard from "../components/OutfitCard";
import { useAuth } from "../contexts/Auth";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Spinner,
  View,
  VStack,
} from "native-base";
import axiosInstance from "../utils/axiosInstance";
import config from "../config";

function SimilarOutfitScreen({ navigation, route }) {
  const { user } = useAuth();
  const [outfits, setOutfits] = useState(undefined);

  useEffect(() => {
    async function get() {
      const similarData = await axiosInstance
        .get(config.API_URL + "/outfit/" + route.params.outfit.id + "/similar")
        .then((res) => {
          if (res.status == 200) {
            return res.data;
          } else {
            return false;
          }
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
      setOutfits(similarData);
    }

    get();
  }, [route.params.outfit]);

  return (
    <ScrollView>
      <VStack py={2} mx={2} space={3}>
        <Heading size="xl">Desired Outfit</Heading>
        <View pb={5}>
          <OutfitCard info outfit={route.params.outfit} />
        </View>
      </VStack>

      <VStack py={2} mx={2} space={3}>
        <Heading size="xl">Similar Outfits</Heading>
        {outfits ? (
          <VStack py={2} mx={2} space={3}>
            {outfits.map((outfit, index) => {
              return (
                <View key={index}>
                  <OutfitCard info key={index} outfit={outfit} />
                </View>
              );
            })}
          </VStack>
        ) : (
          <VStack
            alignItems="center"
            space={3}
            flex={1}
            justifyContent="space-around"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => {
              return (
                <Center w="100%" key={index}>
                  <VStack
                    w="90%"
                    maxW="400"
                    borderWidth="1"
                    space={8}
                    overflow="hidden"
                    rounded="md"
                    _dark={{
                      borderColor: "indigo.500",
                    }}
                    _light={{
                      borderColor: "indigo.200",
                    }}
                  >
                    <Skeleton h="40" />
                    <Skeleton.Text px="4" />
                    <Skeleton
                      px="4"
                      my="4"
                      rounded="md"
                      startColor="indigo.100"
                    />
                  </VStack>
                </Center>
              );
            })}
          </VStack>
        )}
      </VStack>
    </ScrollView>
  );
}

export default SimilarOutfitScreen;
