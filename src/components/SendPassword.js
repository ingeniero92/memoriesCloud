import React, {component, Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    Keyboard,
    Image
} from 'react-native'

import * as firebase from 'firebase'

class SendPassword extends Component {

    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: ''
        }
        this.sendPassword = this.sendPassword.bind(this)
    }    

    sendPassword(){
        const {goBack} = this.props.navigation
        firebase.auth().sendPasswordResetEmail(this.state.email)
            .then(function() {
                console.log("Email sent")
            })
            .catch(function(error) {
                console.log("Error")
            })
        goBack()
    }

    render(){
        
        const {navigate} = this.props.navigation
        const {goBack} = this.props.navigation

        return (
            <View style={styles.container}>
                
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../images/logo.jpg')}/>
                    <Text style={styles.text}>¡ Introduce tu email para enviarte el reseteo de contraseña !</Text>
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
                        onPress = {this.sendPassword}
                        style={styles.sendPasswordButton}
                        underlayColor = '#fec600'
                    > 
                        <Text style={styles.textSendButton}>Enviar reseteo de contraseña</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                        onPress={ () => goBack()}
                        style={styles.backButton}
                        underlayColor = 'red'
                    >                                       
                        <Text style={styles.textBackButton}>Volver</Text>
                    </TouchableHighlight>   
                </View>                                

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
    }
})

export default SendPassword