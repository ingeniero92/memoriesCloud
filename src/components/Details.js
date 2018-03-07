import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    TouchableWithoutFeedback,
    ScrollView,
    Dimensions,
    Share,
    TextInput,
    Clipboard
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import DropdownAlert from 'react-native-dropdownalert'

const {width, height} = Dimensions.get('window')

class Details extends Component {
    constructor(props){
        super(props)
        this.state = {
            data: this.getData()
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

    onClose(data) {
        // data = {type, title, message, action}
        // action means how the alert was closed.
        // returns: automatic, programmatic, tap, pan or cancel
    }

    getData(){       
        return this.props.navigation.state.params.item
    }

    render(){
        const {goBack} = this.props.navigation
        return (
            <View style={styles.container}>   

                <Text style={styles.titleText}>Mi Recuerdo</Text>

                <View style={styles.memoryTextContainer}>
                    <ScrollView horizontal>
                        <TextInput editable = {false} style={styles.memoryText}>{this.state.data.text}</TextInput>
                    </ScrollView>
                </View>   

                <View style={styles.memoryIcons}>
                    <TouchableWithoutFeedback 
                        onPress={() => this.onShare(this.state.data.text)}
                    >
                        <Icon 
                            name="share-alt-square"
                            color = "white"
                            size = {30}
                            style={styles.memoryIcon}
                        />
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback 
                        onPress={() => this.copyToClipboard(this.state.data.text)}
                    >
                        <Icon 
                            name="copy"
                            color = "white"
                            size = {30}
                            style={styles.memoryIcon}
                        />
                    </TouchableWithoutFeedback>
                    
                    <TouchableWithoutFeedback                         
                        onPress={() => goBack()}
                    >
                        <Icon 
                            name="trash"
                            color = "#d80404"
                            size = {30}
                            style={styles.memoryIcon}
                        />
                    </TouchableWithoutFeedback>
                </View>
                
                <TouchableHighlight
                        onPress={() => goBack()}
                        style={styles.backButton}
                        underlayColor = '#fec600'
                    > 
                        <Text style={styles.textBackButton}>Volver</Text>
                    </TouchableHighlight>  
                
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
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#0088ff'
    },
    backButton:{
        backgroundColor: '#fec600',
        paddingVertical: 20,
        marginBottom: 10
    },
    textBackButton: {
       textAlign: 'center',
       color: '#0088ff',
       fontWeight: 'bold'
    },
    memoryTextContainer: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        width: width - 20,
        backgroundColor: 'white'
    },
    memoryText: {
        color: '#0088ff'
    },
    memoryIcons:{
        flexDirection: 'row',
        justifyContent: 'center',
        width: width - 20,
        marginTop: 10,
        marginBottom: 10
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
      borderBottomWidth: 3
    }
})

export default Details