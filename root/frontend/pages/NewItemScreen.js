//Create paging for the New Items Screen

import { Alert, Modal, StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';

import ItemModal from "./ItemModal.jsx"
import Card from "./../components/card.jsx"


function NewItemScreen() {
  // const [modalVisible, setModalVisible] = useState(false)
  return (
    <View style={{ flex: 1, alignItems: 'flex-start' }}>
      <ItemModal />
     </View>
  )
}

export default NewItemScreen;