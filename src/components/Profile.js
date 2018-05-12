import React, {component, Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Keyboard,
    Dimensions,
    NetInfo
} from 'react-native'

import * as firebase from 'firebase'
import DropdownAlert from 'react-native-dropdownalert'

import FirebaseHelpers from '../api/firebaseHelpers'

class Profile extends Component {

    constructor(props){
        super(props)
        this.state = {
            name: '',
            uid: ''
        }
        this.getUser()
    }

    getUser(){
        //let user = await firebase.auth().currentUser
        try {
            firebase.auth().onAuthStateChanged((user) => {                
                if(user){
                    FirebaseHelpers.getName(user.uid,(name) => {
                        this.setState({
                            uid: user.uid,
                            name
                        })
                    })
                }             
            })        
        } catch (error){
            console.log(error)
        }
    }

    saveForm(){

        NetInfo.isConnected.fetch().then(isConnected => {
            if(isConnected){
                if(this.state.uid){
                    try{
                        this.state.name ? FirebaseHelpers.setUserName(this.state.uid, this.state.name) : null
                        Keyboard.dismiss()
                        this.dropdown.alertWithType('success', 'Sucess', 'User profile changed!')
                    } catch (error){
                        this.dropdown.alertWithType('error', 'Error', error.message)
                    }
                }      
            } else {
                this.dropdown.alertWithType('error', 'Error', 'No Internet. Check your connection.')
            }
        })        
         
    }

    render(){
        const {goBack} = this.props.navigation
        return (
            <View style={styles.container}>

                <Text style={styles.titleText}>User Settings</Text>

                <View>      
                    <TextInput
                        style = {styles.inputText}
                        selectionColor="#449DEF"
                        underlineColorAndroid='transparent'
                        placeholderTextColor="grey"
                        placeholder = "Name"
                        value = {this.state.name}
                        onChangeText = {(name) => this.setState({name})}
                    />
                </View>               

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress = {this.saveForm.bind(this)}
                    activeOpacity = {0.95}
                > 
                    <Text style={styles.textSaveButton}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={ () => goBack()}
                    style={styles.cancelButton}
                    activeOpacity = {0.9}
                >                                       
                    <Text style={styles.textCancelButton}>Back to Home</Text>
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
    inputText: {
        height: 50,
        color: '#0088ff',
        marginBottom: 10,
        backgroundColor: 'white',
        borderRadius: 5
    },
    button:{
        backgroundColor: '#fff',
        paddingVertical: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'white'
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
    containerInputs: {
        marginBottom: 20
    },
    saveButton: {
        backgroundColor: '#fec600',
        paddingVertical: 20,
        marginBottom: 10
    },
    cancelButton: {
        backgroundColor: 'red',
        paddingVertical: 20,
        marginBottom: 10
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

export default Profile