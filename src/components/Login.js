import React, {component, Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    Keyboard,
    Image,
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native'

import * as firebase from 'firebase'
import DropdownAlert from 'react-native-dropdownalert'

class Login extends Component {

    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            response: '',
            loading: false
        }
    }

    login(){
        this.setState({
            loading: true
        })
        Keyboard.dismiss()
        this.loginUser()
    }

    async loginUser(){
        const {navigate} = this.props.navigation
        try {
            await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            this.setState({
                response: 'User Log In'
            })            
            this.props.navigation.navigate('Home')
        } catch(error) {
            this.setState({
                loading: false,
                response: error                
            })
            this.dropdown.alertWithType('error', 'Error', error.message);
        }
    }

    render(){
        const {navigate} = this.props.navigation
        return (
            <View style={styles.container}>
                
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../images/logo.jpg')}/>
                    <Text style={styles.text}>Introduce tus datos para iniciar sesión:</Text>
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

                <View style={styles.forgottenPasswordContainer}>
                    <TouchableWithoutFeedback
                        onPress={() => navigate('SendPassword')}
                    >
                        <View>
                            <Text style={styles.sendPasswordText}>¿Has olvidado tu contraseña?</Text>
                        </View>
                    </TouchableWithoutFeedback>                    
                </View>  

                <View style={styles.buttonContainer}>
                    <TouchableHighlight
                        onPress = {() => this.login()}
                        style={styles.loginButton}
                        underlayColor = '#fec600'
                    > 
                        <Text style={styles.textLoginButton}>Entrar</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                        onPress={() => navigate('Register')}
                        style={styles.registerButton}
                        underlayColor = '#32A54A'
                    >                                       
                        <Text style={styles.textRegisterButton}>¡ Crea tu cuenta gratuita !</Text>
                    </TouchableHighlight>   
                </View>      

                <DropdownAlert 
                    ref={ref => this.dropdown = ref} 
                    startDelta = {-200}
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
    sendPasswordText: {
        color: 'white',
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    text: {
        color: 'white'
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 10
    },
    logo: {
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
    loginButton:{
        backgroundColor: '#fec600',
        paddingVertical: 20,
        marginBottom: 10
    },
    registerButton:{
        backgroundColor: '#32A54A',
        paddingVertical: 20,
        marginBottom: 10
    },
    textLoginButton: {
       textAlign: 'center',
       color: '#0088ff',
       fontWeight: 'bold'
    },
    textRegisterButton: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
    },
    forgottenPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: 10
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

export default Login