//Create paging for the New Items Screen

import { Alert, Modal, StyleSheet, Text, View, SafeAreaView, Button, Pressable, FlatList } from 'react-native';

import HorizontalCard from '../components/horizontalCard.jsx';


function ItemListScreen({ route, navigation }) {
  // const [modalVisible, setModalVisible] = useState(false)
  const { items } = route.params;
  return (
     <View>
                            <FlatList 
                                data={Object.keys(items)}
                                renderItem = {({ item }) => (
                                    <Pressable onPress={() => {console.log(item + " pressed")}}>
                                        <HorizontalCard itemType={item} image={require("./../assets/hanger.png")}/>
                                    </Pressable>
                                )}
                            />
                                        <Button 
                title="Category Type of Item"
                onPress={() => (
                    console.log(route.params.item)
                    // console.log(Object.keys(items))
                    // navigation.navigate("ItemList", {items: DATA["mens"][item]})
                    // console.log(Object.keys(DATA["mens"]))
                )}
            />
                    </View>
  )
}

export default ItemListScreen;