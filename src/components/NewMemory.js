import React, {Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    Dimensions,
    ScrollView,
    Clipboard,
    Image,
    Linking,
    ActivityIndicator,
    NetInfo
} from 'react-native'

import * as firebase from 'firebase'
import ShareExtension from 'react-native-share-extension'
import DropdownAlert from 'react-native-dropdownalert'

import FirebaseHelpers from '../api/firebaseHelpers'
import {getCurrentDate} from '../lib' 

import {MAX_MEMORY_LENGTH} from '../constants'

const {width, height} = Dimensions.get('window')

class NewMemory extends Component {
    
    constructor(props){        
        super(props)
        this.state = {
            source: '',
            value: '',
            uid: '',
            loged: false,
            loading: true,
            saveDisabled: false
        }    
    }

    componentWillUnmount() {
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }    

    componentWillMount() {
        
        try{
            this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
                if(user){

                    this.setState({ 
                        uid: user.uid, 
                        loged: true
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

    async copyMemoryFromClipboard(){
        var value = await Clipboard.getString() 
        subValue = String.prototype.substr.call(value,0,MAX_MEMORY_LENGTH)
        this.setState({ 
            value: subValue, 
            source: 'clipboard',
            loading: false
        })
    }

    async getShareData() {

        try{

            if(this.state.uid != ''){
                try {
                    const { type, value } = await ShareExtension.data()
                    var subValue = String.prototype.substr.call(value,0,MAX_MEMORY_LENGTH)
                    this.setState({
                        source: 'share',
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

    cancel(){
        if(this.state.source == 'clipboard'){
            this.props.navigation.goBack()
        } else {
            ShareExtension.close()
        }
    }

    save(){

        NetInfo.isConnected.fetch().then(isConnected => {
            if(isConnected){
                this.setState({
                    saveDisabled: true,
                    loading: true
                })
                if(this.state.uid != ''){
                    try{
        
                        let memory = {
                            "text": this.state.value,
                            "date": getCurrentDate()
                        }
                        
                        this.state.value ? FirebaseHelpers.setMemory(this.state.uid, memory) : null                
                        
                        if(this.state.source == "clipboard"){
                            this.props.navigation.navigate("Home")
                        } else {
                            ShareExtension.close()
                        }                          
        
                    } catch (error){
                        console.log(error)
                    }
                }      
            } else {
                this.dropdown.alertWithType('error', 'Error', 'No Internet. Check your connection.')
            }
        })  
         
    }

    signUp(){
        ShareExtension.close()
        Linking.openURL('com.memoriescloud://').catch(error => console.error(error));
    }

    render(){     
        return (
            
            <View style={styles.container}>   
            
                {this.state.loged ?
                
                <View>

                    <Text style={styles.titleText}>Save Memory?</Text>

                    <View style={styles.memoryTextContainer}>
                        <ScrollView horizontal>
                            <TextInput 
                                editable = {false} 
                                style={styles.memoryText}
                                value = {this.state.value}
                            />
                        </ScrollView>  
                    </View>

                    <TouchableHighlight
                        onPress={() => this.save()}
                        style={styles.saveButton}
                        underlayColor = '#fec600'
                        disabled = {this.state.saveDisabled}
                    >                                       
                        <Text style={styles.textSaveButton}>Save</Text>
                    </TouchableHighlight>  

                    <TouchableHighlight
                        onPress={() => this.cancel()}
                        style={styles.backButton}
                        underlayColor = 'red'
                    >                                       
                        <Text style={styles.textBackButton}>Discard</Text>
                    </TouchableHighlight> 
                    
                </View>

                :
                <View></View>
                }    

                {!this.state.loading && !this.state.loged ?

                <View style={styles.container}>
                    
                    <View style={styles.logoContainer}>
                        <Image style={styles.logo} source={require('../images/logo.png')}/>
                        <Text style={styles.text}>You need a loged account in Memories Cloud to save your data, login or register now free!</Text>
                    </View>    

                    <View style={styles.buttonContainer}>
                        <TouchableHighlight
                            onPress = {() => this.signUp()}
                            style={styles.registerButton}
                            underlayColor = '#32A54A'
                        > 
                            <Text style={styles.textRegisterButton}>Register free account!</Text>
                        </TouchableHighlight>     
                        
                        <TouchableHighlight
                            onPress={ () => this.cancel()}
                            style={styles.backButton}
                            underlayColor = 'red'
                        >                                       
                            <Text style={styles.textBackButton}>Exit</Text>
                        </TouchableHighlight>                   
                    </View>                          

                </View>          

                :

                <View></View>

                }

                <DropdownAlert 
                    ref={ref => this.dropdown = ref} 
                    updateStatusBar = {false}
                />

                {this.state.loading &&
                    <View style={styles.loading}>
                        <ActivityIndicator style={styles.activityIndicator} size="large" color="white" />   
                    </View>
                }   

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
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
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
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.5,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
})

export default NewMemory