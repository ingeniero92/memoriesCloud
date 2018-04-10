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
    Dimensions
} from 'react-native'

import * as firebase from 'firebase'
import DropdownAlert from 'react-native-dropdownalert'

import FirebaseHelpers from '../api/firebaseHelpers'

const {width, height} = Dimensions.get('window')

class Help extends Component {

    render(){
        const {goBack} = this.props.navigation
        return (
            <View style={styles.container}>

                <Text style={styles.titleText}>Help</Text> 

                <View style={styles.helpContainer}>
                    
                    <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent : 'center'}}>
                        <View style={styles.scrollHelp}>
                            <Text style={styles.text}>Lost? Dont worry! You can easily add memories to this app with the next steps!</Text>
                            <Text style={styles.text}>First, you can select a URL pressing it from any web browser like this image:</Text>
                            <Image style={styles.image} source={require('../images/share1.png')}/>
                            <Text style={styles.text}>Or any text in a web like that:</Text>
                            <Image style={styles.image} source={require('../images/share2.png')}/>
                            <Text style={styles.text}>Then, press "Share" to show your compatible apps...</Text>
                            <Image style={styles.image} source={require('../images/share3.png')}/>
                            <Text style={styles.text}>...and voalá! Press in Memories Cloud and save your memory!</Text>
                            <Text style={styles.text}>Also, you can copy any text in another app and paste it in Memories Cloud with in Home like this image!</Text>
                            <Image style={styles.image} source={require('../images/share4.png')}/>
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
        marginBottom: 10,
        marginTop: 10
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
    helpContainer: {
        flex: 1
    },
    scrollHelp: {
        alignItems: 'center'
    },
    text: {
        textAlign: 'center',
        color: 'white',
        marginTop: 10,
        marginBottom: 10
    },
    image: {
        width: width - 50,
        height: ((width - 50)*0.58),
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 10,
        borderColor: '#80c4ff',
        borderWidth: 3
    }
})

export default Help