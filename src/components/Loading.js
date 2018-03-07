import React, {component, Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    Image,
    ActivityIndicator
} from 'react-native'

import { StackNavigator, addNavigationHelpers } from 'react-navigation'
import * as firebase from 'firebase'

import Firebase from '../api/firebase'

class Profile extends Component {

    constructor(props){
        super(props)
        Firebase.init()
        this.state = {
            initialView : null,
            userLoaded: false,
            textLoading: 'Cargando Memories Cloud...'
        }
        this.getInitialView()
    }

    getInitialView(){
        const {navigate} = this.props.navigation
        firebase.auth().onAuthStateChanged((user) => {    
            if(user){
                this.setState({                   
                    initialView: 'Home',
                    userLoaded: true,
                    textLoading: 'Cargando usuario...'
                })
            } else {
                this.setState({                    
                    initialView: 'Login',     
                    userLoaded: false,               
                    textLoading: 'Cargando Registro...'
                })
            }      
            setTimeout( () => {
                navigate(this.state.initialView)
            }, 1500)                  
        })        
    }

    render(){        
        return (
            <View style={styles.container}>                
                <Image style={styles.logo} source={require('../images/logo.jpg')}/>                
                <ActivityIndicator size="large" color="#fec600" />   
                <Text style={styles.textLoading}>{this.state.textLoading}</Text>        
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {        
        flex: 1,
        backgroundColor: '#0088ff',
        paddingHorizontal: 10,
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    logo: {
        width: 250,
        height: 100,
        marginBottom: 10
    },
    textLoading: {
        color: 'white',
        fontSize: 18,
        marginTop: 10
    }
})

export default Profile