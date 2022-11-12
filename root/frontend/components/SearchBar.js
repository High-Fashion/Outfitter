import { Button, Center, HStack, Input, SearchIcon, View } from "native-base";

export default function SearchBar(props) {
  return (
    <>
      <HStack alignItems="center" space={1} padding={1}>
        <Input
          flex={6}
          placeholder="Search"
          size="md"
          borderRadius="10"
          py="1"
          px="2"
          InputLeftElement={
            <Center padding={1}>
              <SearchIcon />
            </Center>
          }
          value={props.searchQuery}
          onChangeText={(query) => props.setSearchQuery(query)}
        />
        {!props.hideFilter && (
          <View flex={1}>
            <Button onPress={() => props.open()} borderRadius="md">
              Filter
            </Button>
          </View>
        )}
      </HStack>
    </>
  );
}
