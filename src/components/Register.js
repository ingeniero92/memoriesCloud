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

class Register extends Component {

    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            loading: false,
            response: ''
        }
        this.signUp = this.signUp.bind(this)
    }

    signUp(){

        NetInfo.isConnected.fetch().then(isConnected => {
            if(isConnected){
                
                Keyboard.dismiss()

                if(this.state.password != this.state.confirmPassword){
                    this.dropdown.alertWithType('error', 'Error', 'Passwords must be equal!');
                } else {
                    this.setState({
                        loading: true
                    })
                    
                    this.registerUser()
                } 
            } else {
                this.dropdown.alertWithType('error', 'Error', 'No Internet. Check your connection.')
            }
        })  

    }

    async registerUser(){        
        const {navigate} = this.props.navigation

        try {
            await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            this.setState({
                response: 'Account Created'
            })
            setTimeout( () => {                
                navigate('Home', {newUser: true})
            }, 1500)
        } catch(error){            
            this.setState({
                loading: false,
                response: error.toString()
            })
            this.dropdown.alertWithType('error', 'Error', error.message);
        }
        
    }

    render(){
        
        const {navigate} = this.props.navigation
        const {goBack} = this.props.navigation

        return (
            <View style={styles.container}>
                
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../images/logo.png')}/>
                    <Text style={styles.text}>Fill your data to register free!</Text>
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
                    <TextInput
                        style = {styles.inputText}
                        selectionColor="#449DEF"
                        underlineColorAndroid='transparent'
                        placeholderTextColor="grey"
                        placeholder = "Password"
                        password = {true}
                        visible-password = {true}                        
                        secureTextEntry={true}
                        onChangeText = {(password) => this.setState({password})}
                    />
                    <TextInput
                        style = {styles.inputText}
                        selectionColor="#449DEF"
                        underlineColorAndroid='transparent'
                        placeholderTextColor="grey"
                        placeholder = "Confirm Password"
                        password = {true}
                        visible-password = {true}                        
                        secureTextEntry={true}
                        onChangeText = {(confirmPassword) => this.setState({confirmPassword})}
                    />
                </View>  

                <View style={styles.buttonContainer}>
                    <TouchableHighlight
                        onPress = {this.signUp}
                        style={styles.registerButton}
                        underlayColor = '#fec600'
                    > 
                        <Text style={styles.textRegisterButton}>Register account!</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                        onPress={ () => goBack()}
                        style={styles.backButton}
                        underlayColor = 'red'
                    >                                       
                        <Text style={styles.textBackButton}>Back to Login</Text>
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
    registerButton:{
        backgroundColor: '#fec600',
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

export default Register