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
    Linking
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
            uid: '',
            loged: false
        }    
    }

    componentWillUnmount() {
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }    

    componentDidMount() {

        try{
            this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
                if(user){
                    this.setState({ uid: user.uid, loged: true})
                }                
            })
        } catch(error){
            console.log(error)
        }

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

        try{

            let user = await firebase.auth().currentUser

            if(user){
                try {
                    const { type, value } = await ShareExtension.data()
                    this.setState({
                        source: 'share',
                        type,
                        value,
                        loged: true
                    })            
                } catch(e) {
                    console.log('error', e)
                }
            } else {
                this.setState({
                    uid: ''
                })
            }       

        } catch(error){
            console.log(error)
        }
        
        
    }

    cancel(){
        if(this.state.source == 'clipboard'){
            this.props.navigation.navigate('Home')
        } else {
            ShareExtension.close()
        }
    }

    save(){
        if(this.state.uid != ''){
            try{

                let memory = {
                    "text": this.state.value,
                    "date": getCurrentDate()
                }
                
                this.state.value ? FirebaseHelpers.setMemory(this.state.uid, memory) : null                
                this.cancel()             

            } catch (error){
                console.log(error)
            }
        }       
    }

    signUp(){
        ShareExtension.close()
        Linking.openURL('com.memoriescloud://').catch(err => console.error(err));
    }

    render(){     
        return (
            
            <View style={styles.container}>   
            
                {this.state.loged 
                
                ?
                <View>

                    <Text style={styles.titleText}>Save Memory?</Text>

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
                        <Text style={styles.textSaveButton}>Save</Text>
                    </TouchableHighlight>  

                    <TouchableHighlight
                        onPress={() => this.cancel()}
                        style={styles.backButton}
                        underlayColor = 'red'
                    >                                       
                        <Text style={styles.textCancelButton}>Discard</Text>
                    </TouchableHighlight> 
                    
                </View>

                :
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
})

export default NewMemory