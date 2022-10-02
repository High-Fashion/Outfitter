import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginTop: 22
    },
    modalView: {
        // margin: 0.1,
        elevation: 5,
        height: "45%",
        width: "100%",
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 0
    },
    Text: {
        // backgroundColor: "blue"
    }
});