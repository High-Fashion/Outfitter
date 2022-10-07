//Create paging for the New Items Screen

import { Alert, Modal, StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';

import HorizontalCard from '../components/horizontalCard.jsx';


function CategoryListScreen() {
  // const [modalVisible, setModalVisible] = useState(false)
  return (
     <View style={styles.modalView}>
                            <FlatList 
                                // contentContainerStyle={{ paddingBottom: "60%"}}
                                // columnWrapperStyle={{justifyContent: "space-evenly"}}
                                // ItemSeparatorComponent={() => <View style={{height: "3%"}} />}
                                // backgroundColor="green"
                                style={{flex: 1}}
                                data={Object.keys(DATA["mens"][""])}
                                renderItem = {({ item }) => (
                                    <Pressable onPress={() => {console.log(item + " pressed")}}>
                                        <Card itemType={item} image={require("./../assets/hanger.png")}/>
                                    </Pressable>
                                )}
                            />
                        {/* </NavigationContainer> */}
                    </View>
  )
}

export default NewItemScreen;