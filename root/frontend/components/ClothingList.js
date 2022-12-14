import { Box, Checkbox, HStack, Text, VStack } from "native-base";
import ItemCard from "./ItemCard";

export default function ClothingList(props) {
  if (!props.value || props.value.length == 0)
    return (
      <VStack alignItems="center">
        <Box p={20}>
          <Text bold>
            {props.emptyComponent ? (
              props.emptyComponent
            ) : (
              <Text>No items to display</Text>
            )}
          </Text>
        </Box>
      </VStack>
    );

  const CARD_SPACING = 3;

  return (
    <VStack space={CARD_SPACING} mt={CARD_SPACING}>
      {props.select ? (
        <Checkbox.Group
          value={props.selected}
          onChange={(values) => props.setSelected(values || [])}
          accessibilityLabel="Select Item"
        >
          {props.value.map((item) => {
            return (
              <HStack key={item._id} alignItems="center">
                <Checkbox value={item} />
                <ItemCard info item={item} />
              </HStack>
            );
          })}
        </Checkbox.Group>
      ) : (
        props.value.map((item, index) => {
          return (
            <VStack space={CARD_SPACING} key={item._id}>
              <ItemCard
                setDeleted={() => props.removeItem(item._id)}
                hideButtons={props.hideButtons}
                key={item._id}
                item={item}
              />
            </VStack>
          );
        })
      )}
    </VStack>
  );
}
