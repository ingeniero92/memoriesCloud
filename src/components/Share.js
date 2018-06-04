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
            type: '',
            value: '',
            title: '',
            uid: '',
            loged: true,
            loading: true,
            saveDisabled: false,
            width,
            height
        }    
    }

    // Metodo para actualizar las dimensiones actuales del dispositivo (debido a los posibles giros de pantalla)

    _handleLayout = event => {
        this.setState({
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height
        })
    }

    componentWillUnmount() {
        if (this.unsubscriber) {
            this.unsubscriber()
        }
    }    

    componentDidMount() {
        
        try{
            this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
                if(user){

                    this.setState({ 
                        uid: user.uid, 
                        loged: true
                    })
                        
                    this.getShareData()                    

                } else {
                    this.setState({
                        loading: false,
                        loged: false
                    })
                }         
            })
        } catch(error){
            console.log(error)
        }       

    }

    async getShareData() {

        try{

            if(this.state.uid != ''){
                try {
                    const { type, value } = await ShareExtension.data()
                    var subValue = String.prototype.substr.call(value,0,MAX_MEMORY_LENGTH)
                    this.setState({
                        type,
                        value: subValue,
                        loged: true,
                        loading: false
                    })            
                } catch(error) {
                    console.log(error)
                }
            } else {
                this.setState({
                    uid: '',
                    loading: false,
                    loged: false
                })
            }       

        } catch(error){
            console.log(error)
        }
                
    }

    save(){

        NetInfo.isConnected.fetch().then(isConnected => {
            if(isConnected){
                this.setState({
                    saveDisabled: true
                })
                if(this.state.uid != ''){
                    if(this.state.uid != ''){
                        try{
            
                            let memory = {
                                "text": this.state.value,
                                "title": this.state.title,
                                "date": getCurrentDate()
                            }
                            
                            this.state.value ? FirebaseHelpers.setMemory(this.state.uid, memory) : null              
                            Keyboard.dismiss()
                            ShareExtension.close()                        
                        
                        } catch (error){
                            console.log(error)
                        }
                    } else {
                        this.dropdown.alertWithType('error', 'Error', 'The memory can not be empty.')
                        this.setState({
                            saveDisabled: false
                        })
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

    signUp(){
        ShareExtension.close()
        Linking.openURL('com.memoriescloud://').catch(error => console.error(error))
    }

    render(){     
        return (
            
            <View style={styles.container} onLayout={this._handleLayout}>     

                {this.state.loged ?

                <View>

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
                        onPress={() => ShareExtension.close()}
                        style={styles.backButton}
                        activeOpacity = {0.9}
                    >                                       
                        <Text style={styles.textBackButton}>Discard</Text>
                    </TouchableOpacity>    

                </View>   

                :

                <View>
                    
                    <View style={styles.logoContainer}>
                        <Image style={styles.logo} source={require('../images/logo.png')}/>
                        <Text style={styles.text}>You need a loged account in Memories Cloud to save your data, login or register now free.</Text>
                    </View>    

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress = {() => this.signUp()}
                            style={styles.registerButton}
                            activeOpacity = {0.9}
                        > 
                            <Text style={styles.textRegisterButton}>Register free account!</Text>
                        </TouchableOpacity>     
                        
                        <TouchableOpacity
                            onPress={ () => ShareExtension.close()}
                            style={styles.backButton}
                            activeOpacity = {0.9}
                        >                                       
                            <Text style={styles.textBackButton}>Exit</Text>
                        </TouchableOpacity>                   
                    </View>                          

                </View>  
                
                } 

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
        borderBottomWidth: 2
    },
    titleText: {
      textAlign: 'center',
      color: 'white',
      marginBottom: 10,
      fontSize: 25,
      fontWeight: 'bold',
      borderColor: 'rgba(255, 255, 255, .5)',
      borderBottomWidth: 3
    },
    text: {
        color: 'white',
        textAlign: 'center'
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 10
    },
    logo: {
        alignItems: 'center',
        width: 250,
        height: 100,
        marginBottom: 10
    },
    registerButton:{
        backgroundColor: '#32A54A',
        paddingVertical: 20,
        marginBottom: 10
    },
    backButton:{
        backgroundColor: 'red',
        paddingVertical: 20,
        marginBottom: 10
    },
    textRegisterButton: {
       textAlign: 'center',
       color: 'white',
       fontWeight: 'bold'
    },
    textBackButton: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
    }
})

export default NewMemory