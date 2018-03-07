import React, {component, Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    Keyboard,
    Image,
    ActivityIndicator
} from 'react-native'

import * as firebase from 'firebase'

class Register extends Component {

    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            loading: false
        }
        this.signUp = this.signUp.bind(this)
    }

    signUp(){
        this.setState({
            loading: true
        })
        Keyboard.dismiss()
        this.registerUser()
    }

    async registerUser(){        
        const {navigate} = this.props.navigation
        try {
            await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            this.setState({
                response: 'Account Created'
            })
            setTimeout( () => {                
                navigate('Home')
            }, 1500)
        } catch(error){
            this.setState({
                response: error.toString()
            })
        }
    }

    render(){
        
        const {navigate} = this.props.navigation
        const {goBack} = this.props.navigation

        return (
            <View style={styles.container}>
                
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../images/logo.jpg')}/>
                    <Text style={styles.text}>¡ Introduce tus datos para registrarte gratuitamente !</Text>
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
                        placeholder = "Contraseña"
                        password = {true}
                        visible-password = {true}                        
                        secureTextEntry={true}
                        onChangeText = {(password) => this.setState({password})}
                    />
                </View>  

                <View style={styles.buttonContainer}>
                    <TouchableHighlight
                        onPress = {this.signUp}
                        style={styles.registerButton}
                        underlayColor = '#fec600'
                    > 
                        <Text style={styles.textRegisterButton}>¡ Registrarse gratuitamente !</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                        onPress={ () => goBack()}
                        style={styles.backButton}
                        underlayColor = 'red'
                    >                                       
                        <Text style={styles.textBackButton}>Volver</Text>
                    </TouchableHighlight>   
                </View>   

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