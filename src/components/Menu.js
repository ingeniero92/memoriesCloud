import React, {Component} from 'react'
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableWithoutFeedback,
    TouchableHighlight,
    ActivityIndicator
} from 'react-native'

import * as firebase from 'firebase'
import Icon from 'react-native-vector-icons/FontAwesome'

import FirebaseHelpers from '../api/firebaseHelpers'

const {width, height} = Dimensions.get('window')

class Menu extends Component {

    constructor(props){
        super(props)
        this.state = {
            name: '',
            uid: ''
        }
        this.getUser()
    }

    _handleLayout = event => {
        this.props.updateMenu(false)
    }

    getUser(){
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

    async logout(){
        this.props.setLoading(true)
        try {
            await firebase.auth().signOut()
        } catch(error){
            console.log(error)
        }
    }

    render(){
        const {navigate} = this.props.navigation
        return (
            <View style={styles.container} onLayout={this._handleLayout}>

                <View style={[styles.userContainer, {width: (this.props.menuWidth)}]}>
                    <View style={styles.settingsContainer}>
                        <TouchableWithoutFeedback 
                            onPress={() => navigate('Profile')}
                        >
                            <Icon 
                                name="cog"
                                color = "white"
                                size = {20}
                            />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback 
                            onPress={() => navigate('Profile')}
                        >                    
                            <View>
                                <Text style = {styles.settingsText}>   User Settings</Text>
                            </View>                
                                                                    
                        </TouchableWithoutFeedback>
                    </View>
                    
                    <TouchableWithoutFeedback 
                        onPress = {this.logout.bind(this)}
                    >
                        <Icon 
                            name="power-off"
                            color = "white"
                            size = {20}
                        />
                    </TouchableWithoutFeedback>
                </View>

                <ScrollView style={[styles.scrollContainer, {width: (this.props.menuWidth) }]}>
                    <TouchableHighlight 
                        onPress={() => navigate('Help')}
                        underlayColor = '#0088ff'
                    >
                        <View style={styles.textWithIcon}>
                            <View style={styles.withIcon}>
                                <Icon 
                                    style={styles.iconWithText}
                                    name="book"
                                    color="white"
                                    size={28}
                                />
                                <Text style={styles.text}>Help</Text>
                            </View>
                            <Icon 
                                style={styles.rightIcon}
                                name="angle-right"
                                color="white"
                                size={25}
                            />
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        onPress={() => navigate('Support')}
                        underlayColor = '#0088ff'
                    >
                        <View style={styles.textWithIcon}>
                            <View style={styles.withIcon}>
                                <Icon
                                    style={styles.iconWithText}
                                    name="info-circle"
                                    color="white"
                                    size={28}
                                />
                                <Text style={styles.text}>Support</Text>
                            </View>
                            <Icon 
                                style={styles.rightIcon}
                                name="angle-right"
                                color="white"
                                size={25}
                            />
                        </View>
                    </TouchableHighlight>
                </ScrollView>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#0088ff"
    },
    userContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',        
        borderColor: 'rgba(255, 255, 255, .5)',
        borderBottomWidth: 3,
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    settingsContainer: {
        flexDirection: 'row',
    },
    text: {
        color: 'white',
        fontSize: 15
    },
    settingsText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold'
    },
    textWithIcon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderColor: 'rgba(255, 255, 255, .5)',
        borderBottomWidth: 3
    },
    withIcon: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    scrollContainer: {
    },
    rightIcon: {
        paddingRight: 20
    },
    iconWithText: {
        marginRight: 10,
        paddingLeft: 20
    }
})

export default Menu