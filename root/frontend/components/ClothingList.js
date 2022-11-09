import { Box, Checkbox, Divider, HStack, Text, VStack } from "native-base";
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

  return (
    <VStack space={3}>
      {props.select ? (
        <Checkbox.Group
          value={props.selected}
          onChange={(values) => props.setSelected(values || [])}
          accessibilityLabel="Select Item"
        >
          {props.value.map((item) => {
            return (
              <HStack key={item.name} alignItems="center">
                <Checkbox value={item} />
                <ItemCard
                  hideButtons={props.hideButtons}
                  key={item.id}
                  item={item}
                />
                <Divider />
              </HStack>
            );
          })}
        </Checkbox.Group>
      ) : (
        props.value.map((item, index) => {
          return (
            <Box key={item.name}>
              {index != 0 && <Divider />}
              <ItemCard
                hideButtons={props.hideButtons}
                key={item.id}
                item={item}
              />
            </Box>
          );
        })
      )}
    </VStack>
  );
}
