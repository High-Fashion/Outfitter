import {
  Button,
  Center,
  HStack,
  Input,
  SearchIcon,
  View,
  VStack,
} from "native-base";

export default function SearchBar(props) {
  return (
    <>
      <HStack
        style={{ position: "relative", zIndex: 2 }}
        alignItems="center"
        space={1}
      >
        <Input
          flex={6}
          placeholder="Search"
          size="md"
          py="1"
          px="2"
          InputLeftElement={
            <Center padding={1}>
              <SearchIcon />
            </Center>
          }
          value={props.searchQuery}
          onChangeText={(query) => props.setSearchQuery(query)}
          _stack={{
            borderTopRadius: 10,
            borderBottomRadius: 10,
          }}
          style={{
            borderTopRadius: 10,
            borderBottomRadius: 10,
          }}
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
