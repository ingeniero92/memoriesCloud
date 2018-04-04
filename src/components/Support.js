import React, {component, Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    Keyboard,
    ScrollView,
    Image,
    Dimensions,
    Linking,
    TouchableWithoutFeedback
} from 'react-native'

import * as firebase from 'firebase'
import DropdownAlert from 'react-native-dropdownalert'

import FirebaseHelpers from '../api/firebaseHelpers'

const {width, height} = Dimensions.get('window')

class Support extends Component {

    sendMail(){
        Linking.openURL('mailto:memoriescloudapp@gmail.com?subject=Help Memories Cloud&body=versionBETA')
    }

    render(){
        const {goBack} = this.props.navigation
        return (
            <View style={styles.container}>

                <Text style={styles.titleText}>Support</Text> 

                <View style={styles.supportContainer}>
                    
                    <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent : 'center'}}>
                        <View style={styles.scrollSupport}>
                            <Image style={styles.logo} source={require('../images/logo.png')}/>
                            <Text style={styles.textVersion}>Version BETA</Text>
                            <Text style={styles.textAuthor}>José Serrano Álvarez</Text>
                            <Text style={styles.textAuthor}>David de los Santos Gil</Text>
                            <TouchableWithoutFeedback onPress={ () => this.sendMail()}>
                                <View>
                                  <Text style={styles.textMail}>memoriescloudapp@gmail.com</Text>
                                </View>                            
                            </TouchableWithoutFeedback>
                        </View>
                    </ScrollView>
                </View>                                         

                <TouchableHighlight
                    onPress={ () => goBack()}
                    style={styles.cancelButton}
                    underlayColor = 'red'
                >                                       
                    <Text style={styles.textCancelButton}>Back to Home</Text>
                </TouchableHighlight>                 

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
    textCancelButton: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
    },
    containerInputs: {
        marginBottom: 20
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
    },
    logo: {
        alignItems: 'center',
        width: 250,
        height: 100,
        marginBottom: 10
    },
    supportContainer: {
        flex: 1
    },
    scrollSupport: {
        alignItems: 'center'
    },
    textVersion: {
        textAlign: 'center',
        color: 'white',
        marginBottom: 20,
        fontWeight: 'bold'
    },
    textAuthor: {
        textAlign: 'center',
        color: 'white',
    },
    textMail: {
        textAlign: 'center',
        color: 'white',
        marginTop: 10,
        marginBottom: 10,
        textDecorationLine: 'underline'
    },
    image: {
        width: width - 50,
        marginTop: 10,
        marginBottom: 10
    },
})

export default Support