import React, {component, Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    Image,
    ActivityIndicator,
    Dimensions,
    TouchableHighlight,
    BackHandler
} from 'react-native'

import { StackNavigator, addNavigationHelpers } from 'react-navigation'
import Modal from "react-native-modal"

import FirebaseHelpers from '../api/firebaseHelpers'
import firebase from '../api/firebase'

import {CURRENT_VERSION} from '../constants'

const {width, height} = Dimensions.get('window')

class Loading extends Component {

    constructor(props){
        super(props)
        this.state = {
            initialView : null,
            userLoaded: false,
            textLoading: 'Loading Memories Cloud...',
            isModalVisible: false
        }
        this.getInitialView()
    }

    getInitialView(){
        const {navigate} = this.props.navigation

        FirebaseHelpers.getMinVersion( (minVersion) => {      
            if(minVersion > CURRENT_VERSION){
                this.setState({
                    textLoading: 'Loading Request for Update...',
                    isModalVisible: true
                })
            } else {
                firebase.auth().onAuthStateChanged((user) => {    
                    if(user){
                        this.setState({                   
                            initialView: 'Home',
                            userLoaded: true,
                            textLoading: 'Loading Memories List...'
                        })
                    } else {
                        this.setState({                    
                            initialView: 'Login',     
                            userLoaded: false,               
                            textLoading: 'Loading Register...'
                        })
                    }      
                    setTimeout( () => {
                        navigate(this.state.initialView)
                    }, 500)                   
                })    
            }

                  
        })   
    }

    toggleModal = () => this.setState({ isModalVisible: !this.state.isModalVisible })

    exitApp(){
        BackHandler.exitApp()
    }

    render(){        
        return (
            <View style={styles.container}>           

                <Image style={styles.logo} source={require('../images/logo.png')}/>                
                <ActivityIndicator size="large" color="#fec600" />   
                <Text style={styles.textLoading}>{this.state.textLoading}</Text>    

                <Modal 
                    style={styles.modalContainer}                
                    isVisible={this.state.isModalVisible}
                    supportedOrientations={['portrait', 'landscape']}
                    onBackButtonPress={() => this.exitApp()}    
                    animationIn = {'pulse'}  
                    animationInTiming = {600}
                    hideModalContentWhileAnimating = {true}
                    backdropOpacity = {0.40}
                >
                    <View style={styles.modalBox}>
                        
                        <Text style={styles.modalTitle}>Update Needed</Text>

                        <Text style={styles.modalText}>Sorry, but you need to update Memories Cloud. Please, check in your store the new version.</Text>

                        <TouchableHighlight
                            onPress={() => this.exitApp()}
                            style={styles.exitButton}
                            underlayColor = 'red'
                        >                                       
                            <Text style={styles.textExitButton}>Exit</Text>
                        </TouchableHighlight> 

                    </View>
                </Modal>   

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
    },
    modalContainer: {
        alignItems: 'center'
    },
    modalBox: {        
        backgroundColor: 'white',
        width: width - 60,
        height: 220,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    modalTitle: {
      textAlign: 'center',
      color: '#0088ff',
      marginBottom: 10,
      fontSize: 25,
      fontWeight: 'bold',
      borderColor: '#0088ff',
      borderBottomWidth: 3,
      marginBottom: 10,
      paddingVertical: 10
    },
    modalText: {
        color: '#0088ff',
        marginBottom: 20,
        marginTop: 10,
        textAlign: 'center'
    },
    exitButton:{
        backgroundColor: 'red',
        paddingVertical: 20
    },
    textExitButton: {
       textAlign: 'center',
       color: 'white',
       fontWeight: 'bold'
    }
})

export default Loading