import React, {component, Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    Keyboard,
    Image,
    ActivityIndicator,
    NetInfo
} from 'react-native'

import * as firebase from 'firebase'
import DropdownAlert from 'react-native-dropdownalert'

class SendPassword extends Component {

    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            loading: false
        }
    }    

    sendPassword(){

        NetInfo.isConnected.fetch().then(isConnected => {
            if(isConnected){

                this.setState({
                    loading: true            
                })
        
                const {navigate} = this.props.navigation
                firebase.auth().sendPasswordResetEmail(this.state.email)
                    .then(() => {
                        navigate("Login", {sendPassword: true})
                    })
                    .catch((error) =>{
                        this.setState({
                            loading: false            
                        })
                        this.dropdown.alertWithType('error', 'Error', error.message)
                    })  
                     
            } else {
                this.dropdown.alertWithType('error', 'Error', 'No Internet. Check your connection.')
            }
        })  
        
    }

    render(){
        
        const {navigate} = this.props.navigation
        const {goBack} = this.props.navigation

        return (
            <View style={styles.container}>
                
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../images/logo.png')}/>
                    <Text style={styles.text}>Fill with your email to reset password!</Text>
                </View>                

                <View style={styles.inputsContainer}>
                    <TextInput 
                        style = {styles.inputText}
                        selectionColor="#449DEF"
                        underlineColorAndroid='transparent'
                        placeholderTextColor="grey"
                        placeholder = "Email"   
                        keyboardType = 'email-address'
                        onChangeText = {(email) => this.setState({email})}                      
                    />
                </View>  

                <View style={styles.buttonContainer}>
                    <TouchableHighlight
                        onPress = { () => this.sendPassword()}
                        style={styles.sendPasswordButton}
                        underlayColor = '#fec600'
                    > 
                        <Text style={styles.textSendButton}>Send reset password</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                        onPress={ () => goBack()}
                        style={styles.backButton}
                        underlayColor = 'red'
                    >                                       
                        <Text style={styles.textBackButton}>Back</Text>
                    </TouchableHighlight>   
                </View> 

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
        backgroundColor: '#0088ff',
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    text: {
        color: 'white'
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
    inputText: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 20,
        paddingVertical: 10,
        color: '#0088ff',
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: 'white'
    },
    sendPasswordButton:{
        backgroundColor: '#fec600',
        paddingVertical: 20,
        marginBottom: 10
    },
    backButton:{
        backgroundColor: 'red',
        paddingVertical: 20,
        marginBottom: 10
    },
    textSendButton: {
       textAlign: 'center',
       color: '#0088ff',
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
    }
})

export default SendPassword