//Create paging for the New Items Screen

import { Alert, Modal, StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';

import ItemModal from "./ItemModal.jsx"
import HorizontalCard from '../components/horizontalCard.jsx';


function NewItemScreen() {
  // const [modalVisible, setModalVisible] = useState(false)
  return (
     <View style={{ flex: 1, alignItems: 'flex-start' }}>
      <ItemModal />
      <HorizontalCard />
     </View>
  )
}

export default NewItemScreen;