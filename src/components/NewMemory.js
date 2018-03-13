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

import FirebaseHelpers from '../api/firebaseHelpers'
import {getCurrentDate} from '../lib' 

const {width, height} = Dimensions.get('window')

class NewMemory extends Component {

    constructor(props){        
        super(props)
        this.state = {
            source: '',
            value: '',
            uid: ''
        }    
    }

    componentWillUnmount() {
        if (this.unsubscriber) {
          this.unsubscriber();
        }
      }
    

    componentDidMount() {

        this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
          this.setState({ uid: user.uid })
        })

        var source
        try{
            source = this.props.navigation.state.params.source        
        } catch(error) {
            source = 'share'
        }

        if(source == 'clipboard'){
            this.copyMemoryFromClipboard();
        } else {
            this.getShareData()
        }

    }

    async copyMemoryFromClipboard(){
        var value = await Clipboard.getString() 
        this.setState({ 
            value, 
            source: 'clipboard' 
        })
    }

    async getShareData() {

        let user = await firebase.auth().currentUser
        
        if(user){
            try {
                const { type, value } = await ShareExtension.data()
                this.setState({
                    source: 'share',
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

    cancel(){
        if(this.state.source == 'clipboard'){
            this.cancelCopy()
        } else {
            this.cancelShare()
        }
    }

    cancelCopy(){        
        const {goBack} = this.props.navigation
        goBack()
    }

    cancelShare(){
        ShareExtension.close()
    }

    save(){
        if(this.state.uid){
            try{

                let memory = {
                    "text": this.state.value,
                    "date": getCurrentDate()
                }

                this.state.value ? FirebaseHelpers.setMemory(this.state.uid, memory) : null
                this.props.navigation.navigate('Home')

            } catch (error){
                console.log(error)
            }
        }       
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
                    onPress={() => this.save()}
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