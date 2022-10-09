//Create paging for the New Items Screen

import { Box, View, Pressable, FlatList } from 'native-base';

import HorizontalCard from '../components/horizontalCard.jsx';

function ItemListScreen({ route, navigation }) {
  const { items } = route.params;
  return (
    <View>
        <FlatList 
            data={Object.keys(items)}
            renderItem = {({ item }) => (
                // <Box px="15">
                    <Pressable onPress={() => {console.log(item + " pressed")}}>
                        <HorizontalCard itemType={item} image={require("./../assets/hanger.png")}/>
                    </Pressable>
                // </Box>
            )}
        />
    </View>
  )
}

export default ItemListScreen;