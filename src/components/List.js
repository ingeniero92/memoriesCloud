import React, {Component} from 'react'
import{
    Text,
    View,
    StyleSheet,
    FlatList,
    Image,
    TouchableWithoutFeedback,
    ScrollView,
    Alert,
    TextInput,
    Dimensions,
    Share,
    Clipboard
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import DropdownAlert from 'react-native-dropdownalert'

import {getMemories} from '../api/api'

const {width, height} = Dimensions.get('window')

{ /* Este metodo, envia a la vista Details, un objeto item, con el contenido de item */ }
class List extends Component {

    constructor(props){
        super(props)
        this.state = {
        }
    }

    onShare(text){
        Share.share({
            title: 'Memories Cloud',
            message: '¡Mira este enlace que te envio con Memories Cloud! ' + text
        }, {
            //android
            dialogTitle: 'Comparte este recuerdo con:',
            //ios
            excludeActivityTypes: [
                'com.apple.UIKit.activity.PostToTwitter'
            ]
        })
    }

    copyToClipboard(text) {
        Clipboard.setString(text);
        this.dropdown.alertWithType('success', 'Copiado al portapapeles:', text);
    }

    copyMemoryFromClipboard(){
        const {navigate} = this.props.navigation
        navigate('NewMemory', {source: 'clipboard'})
    }

    // Necesario para el DropAlert
    onClose(data) {
        // data = {type, title, message, action}
        // action means how the alert was closed.
        // returns: automatic, programmatic, tap, pan or cancel
    }

    renderItem(item){   
        const {navigate} = this.props.navigation         
        return (
            <View style={styles.memoryContainer}>

                <View style={styles.memoryTextContainer}>
                    <ScrollView horizontal>
                        <TextInput editable = {false} style={styles.memoryText}>{item.text}</TextInput>
                    </ScrollView>            
                </View>

                <View style={styles.memoryIconsContainer}>
                    <TouchableWithoutFeedback 
                        onPress={() => this.onShare(item.text)}
                    >
                        <Icon 
                            name="share-alt-square"
                            color = "white"
                            size = {20}
                            style={styles.memoryIcon}
                        />
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback 
                        onPress={() => this.copyToClipboard(item.text)}
                    >
                        <Icon 
                            name="copy"
                            color = "white"
                            size = {20}
                            style={styles.memoryIcon}
                        />
                    </TouchableWithoutFeedback>
                    
                    <TouchableWithoutFeedback                         
                        onPress={() => navigate('Details', {item: item})}
                    >
                        <Icon 
                            name="cog"
                            color = "white"
                            size = {20}
                            style={styles.memoryIcon}
                        />
                    </TouchableWithoutFeedback>
                </View>              
            </View>   
        )
    }

    render(){
        return(
            <View style={styles.container}>

                <View style={styles.copyMemoryFromClipboardContainer}> 
                    <TouchableWithoutFeedback 
                        onPress={() => this.copyMemoryFromClipboard()}
                    >
                        <View style={styles.copyMemoryFromClipboard}>
                            <TextInput editable = {false} style={styles.copyMemoryFromClipboardText}>Obtener recuerdo de portapapeles</TextInput>
                            <Icon 
                                name="clipboard"
                                color = "#0088ff"
                                size = {30}
                                style={styles.pasteIcon}
                            />
                        </View>                
                    </TouchableWithoutFeedback>
                </View>

                <Text style={styles.titleText}>Mis Recuerdos:</Text>

                <ScrollView style={styles.memoriesContainer}>            
                    {/* FlatList se usa para datos locales*/}
                    <FlatList             
                        SeparatorComponent={() => <View style={{width: 5}} />}
                        renderItem={({item}) => this.renderItem(item)}                
                        data = {getMemories()}  
                        keyExtractor={(item, index) => index.toString()}              
                    />
                </ScrollView>

                <DropdownAlert 
                    ref={ref => this.dropdown = ref} 
                    onClose={data => this.onClose(data)}
                    startDelta = {-200}
                /> 

            </View>            
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    copyMemoryFromClipboardContainer: {
        marginTop: 10,
        alignItems: 'center',
        borderColor: 'rgba(255, 255, 255, .5)',
        borderBottomWidth: 3, 
    },
    copyMemoryFromClipboard: {
        flexDirection: 'row',
        backgroundColor: '#fec600',
        marginBottom: 10
    },
    copyMemoryFromClipboardText:{
        fontSize: 15,
        color: '#0088ff',
        fontWeight: 'bold'
    },
    pasteIcon: {
        marginTop: 10,
        marginRight: 5,
        marginLeft: 5
    },
    memoriesContainer: {
        paddingHorizontal: 20,
        paddingVertical: 0,
    },
    memoryContainer: {
        flex: 1,        
        flexDirection: 'row',
        marginBottom: 10,
        width: width
    },
    memoryTextContainer: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        width: width - (30*3 + 40),
        backgroundColor: 'white'
    },
    memoryIconsContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        width: 30*3 + 10,
        marginTop: 15
    },
    memoryText: {
        color: '#0088ff'
    },
    memoryIcon: {
        marginRight: 5,
        marginLeft: 5
    },
    titleText: {
      textAlign: 'center',
      color: 'white',
      marginBottom: 10,
      fontSize: 25,
      fontWeight: 'bold',
      borderColor: 'rgba(255, 255, 255, .5)',
      borderBottomWidth: 3,
      paddingVertical: 10
    }
  });
  
export default List  
