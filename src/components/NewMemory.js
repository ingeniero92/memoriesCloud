import React, {Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Clipboard,
    Image,
    Linking,
    ActivityIndicator,
    NetInfo,
    Keyboard
} from 'react-native'

import * as firebase from 'firebase'
import ShareExtension from 'react-native-share-extension'
import DropdownAlert from 'react-native-dropdownalert'

import FirebaseHelpers from '../api/firebaseHelpers'
import {getCurrentDate} from '../lib' 

import {MAX_MEMORY_LENGTH, MAX_TITLE_LENGTH} from '../config'

const {width, height} = Dimensions.get('window')

class NewMemory extends Component {
    
    constructor(props){        
        super(props)
        this.state = {
            source: '',
            value: '',
            title: '',
            uid: '',
            saveDisabled: false,
            width,
            height
        }    
    }  

    componentWillMount() {

        try {
            firebase.auth().onAuthStateChanged((user) => {             
                if(user){     

                    this.setState({     
                        uid: user.uid
                    }) 
                    
                    var source
                    try{
                        source = this.props.navigation.state.params.source       
                        this.setState({
                            value: this.props.navigation.state.params.value 
                        }) 
                    } catch(error) {
                        source = 'new'
                    }   

                }                             
            })        
        } catch (error){
            console.log(error)
        }             
          
    }

    // Metodo para actualizar las dimensiones actuales del dispositivo (debido a los posibles giros de pantalla)

    _handleLayout = event => {
        this.setState({
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height
        })
    }

    // Metodo para guardar los recuerdos

    save(){

        NetInfo.isConnected.fetch().then(isConnected => {
            if(isConnected){
                this.setState({
                    saveDisabled: true,
                })
                if(this.state.uid != ''){
                    try{      
                        
                        if(this.state.value != ''){

                            let memory = {
                                "text": this.state.value,
                                "title": this.state.title,
                                "date": getCurrentDate()
                            }

                            this.state.value ? FirebaseHelpers.setMemory(this.state.uid, memory) : null                
                            Keyboard.dismiss()
                            this.props.navigation.navigate("Home")  

                        } else {
                            this.dropdown.alertWithType('error', 'Error', 'The memory can not be empty.')
                            this.setState({
                                saveDisabled: false
                            })
                        }                                             
        
                    } catch (error){
                        console.log(error)
                    }
                }      
            } else {
                this.dropdown.alertWithType('error', 'Error', 'No Internet. Check your connection.')
                this.setState({
                    saveDisabled: false
                })
            }
        })  
         
    }

    render(){     
        return (
            
            <View style={styles.container} onLayout={this._handleLayout}>          

                <Text style={styles.titleText}>Save Memory</Text>

                <TextInput 
                    editable = {true} 
                    selectionColor="#449DEF"
                    underlineColorAndroid='transparent'
                    placeholderTextColor="white"
                    placeholder = "Title"
                    style={[styles.memoryTitleText, { width: this.state.width - 30}]}
                    value = {this.state.title}
                    onChangeText = {(title) => this.setState({title})}
                    maxLength = {MAX_TITLE_LENGTH}
                />
                
                <TextInput 
                    editable = {true} 
                    selectionColor="#449DEF"
                    underlineColorAndroid='transparent'
                    placeholderTextColor="grey"
                    placeholder = "Memory"
                    style={[styles.memoryTextContainer, { width: this.state.width - 20}]}
                    value = {this.state.value}
                    onChangeText = {(value) => this.setState({value})}
                    maxLength = {MAX_MEMORY_LENGTH}
                />   

                <TouchableOpacity
                    onPress={() => this.save()}
                    style={styles.saveButton}
                    activeOpacity = {0.95}
                    disabled = {this.state.saveDisabled}
                >                                       
                    <Text style={styles.textSaveButton}>Save</Text>
                </TouchableOpacity>  

                <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                    style={styles.backButton}
                    activeOpacity = {0.9}
                >                                       
                    <Text style={styles.textBackButton}>Discard</Text>
                </TouchableOpacity>             

                <DropdownAlert 
                    ref={ref => this.dropdown = ref} 
                    updateStatusBar = {false}
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
    textBackButton: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
    },
    memoryContainer: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 10
    },
    memoryTextContainer: {
        color: '#0088ff',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 10
    },
    memoryTitleText: {
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 18,
        fontWeight: 'bold',
        borderColor: 'rgba(255, 255, 255, .5)',
        borderBottomWidth: 2,
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