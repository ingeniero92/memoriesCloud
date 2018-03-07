import React, {Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    Dimensions,
    ScrollView,
    Clipboard
} from 'react-native'

import * as firebase from 'firebase'
import ShareExtension from 'react-native-share-extension'

import {getCurrentDate} from '../lib' 

const {width, height} = Dimensions.get('window')

class NewMemory extends Component {

    constructor(props){        
        super(props)

        var source
        try{
            source = this.props.navigation.state.params.source        
        } catch(error) {
            source = 'share'
        }

        this.state = {
            source,
            value: ''
        }    
        
        if(this.state.source == 'clipboard'){
            this.copyMemoryFromClipboard();
        } else {
            this.getShareData()
        }

    }

    async copyMemoryFromClipboard(){
        var value = await Clipboard.getString() 
        this.setState({ value })
    }

    cancelCopy(){
        const {goBack} = this.props.navigation
        goBack()
    }

    async getShareData() {

        let user = await firebase.auth().currentUser
        
        if(user){
            try {
                const { type, value } = await ShareExtension.data()
                this.setState({
                    type,
                    value
                })            
            } catch(e) {
                console.log('error', e)
            }
        } else {
            console.log("No hay sesion")
        }       
    }

    cancelShare(){
        ShareExtension.close()
    }

    cancel(){
        if(this.state.source == 'clipboard'){
            this.cancelCopy()
        } else {
            this.cancelShare()
        }
    }

    saveNewMemory(){
        var date = getCurrentDate()
    }

    render(){     
        return (
            <View style={styles.container}>   
            
                <Text style={styles.titleText}>¿Guardar Recuerdo?</Text>

                <View style={styles.memoryTextContainer}>
                    <ScrollView horizontal>
                        <TextInput editable = {false} style={styles.memoryText}>{this.state.value}</TextInput>
                    </ScrollView>  
                </View>

                <TouchableHighlight
                    onPress={() => this.cancel()}
                    style={styles.saveButton}
                    underlayColor = '#fec600'
                >                                       
                    <Text style={styles.textSaveButton}>Guardar</Text>
                </TouchableHighlight>  

                <TouchableHighlight
                    onPress={() => this.cancel()}
                    style={styles.backButton}
                    underlayColor = 'red'
                >                                       
                    <Text style={styles.textCancelButton}>Descartar</Text>
                </TouchableHighlight>  

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
    saveButton:{
        backgroundColor: '#fec600',
        paddingVertical: 20,
        marginBottom: 10
    },
    backButton:{
        backgroundColor: 'red',
        paddingVertical: 20,
        marginBottom: 10
    },
    textSaveButton: {
       textAlign: 'center',
       color: '#0088ff',
       fontWeight: 'bold'
    },
    textCancelButton: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
    },
    memoryContainer: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 10,
        width: width
    },
    memoryTextContainer: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        width: width - 20,
        backgroundColor: 'white',
        marginBottom: 10
    },
    memoryText: {
        color: '#0088ff'
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

export default NewMemory