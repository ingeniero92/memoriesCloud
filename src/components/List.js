import React, {Component} from 'react'
import{
    Text,
    View,
    StyleSheet,
    FlatList,
    Image,
    TouchableWithoutFeedback,
    ScrollView,
    Alert,
    TextInput,
    Dimensions,
    Share,
    Clipboard,
    ActivityIndicator,
    AppState
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import DropdownAlert from 'react-native-dropdownalert'
import * as firebase from 'firebase'
import * as Animatable from 'react-native-animatable'
import {connect} from 'react-redux'

import {fetchData} from '../actions'
import {getSortedMemoriesFromObject} from '../lib'
import FirebaseHelpers from '../api/firebaseHelpers'

const {width, height} = Dimensions.get('window')

{ /* Este metodo, envia a la vista Details, un objeto item, con el contenido de item */ }
class List extends Component {

    constructor(props){
        super(props)
        this.state = {
            uid: '',
            refreshing: false,
            appState: ''
        }
        this.getUser()
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }
    
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }
    
    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            try {
                this.props.fetchData(this.state.uid)
            } catch(error){
                console.log(error)
            }            
        }
        this.setState({appState: nextAppState});
    }

    async getUser(){
        try {
            firebase.auth().onAuthStateChanged((user) => {             
                if(user){                                    
                    this.props.fetchData(user.uid)
                    this.setState({     
                        uid: user.uid
                    }) 
                }                             
            })        
        } catch (error){
            console.log(error)
        }        
    }

    onShare(text){      
        Share.share({
            title: 'Memories Cloud',
            message: text
        }, {
            //android
            dialogTitle: 'Share this memory with:',
            //ios
            excludeActivityTypes: [
                'com.apple.UIKit.activity.PostToTwitter'
            ]
        })
    }

    copyToClipboard(text) {
        Clipboard.setString(text);
        this.dropdown.alertWithType('success', 'Text copied to clipboard:', text)
    }

    copyMemoryFromClipboard(){
        const {navigate} = this.props.navigation
        navigate('NewMemory', {source: 'clipboard'})
    }

    deleteMemory(memoryId){      
        FirebaseHelpers.removeMemory(this.state.uid,memoryId)        
        this.props.fetchData(this.state.uid)
        this.dropdown.alertWithType('success', 'Success!', 'Memory Deleted!')   
    }   

    renderItem(item){   
        const {navigate} = this.props.navigation    
        return (
            <View style={styles.memoryContainer}>

                <View style={styles.memoryTextContainer}>
                    <ScrollView horizontal>
                        <TextInput editable = {false} style={styles.memoryText}>{item.text}</TextInput>
                    </ScrollView>            
                </View>

                <View style={styles.memoryIconsContainer}>
                    <TouchableWithoutFeedback 
                        onPress={() => this.onShare(item.text)}
                    >
                        <Icon 
                            name="share-alt-square"
                            color = "white"
                            size = {20}
                            style={styles.memoryIcon}
                        />
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback 
                        onPress={() => this.copyToClipboard(item.text)}
                    >
                        <Icon 
                            name="copy"
                            color = "white"
                            size = {20}
                            style={styles.memoryIcon}
                        />
                    </TouchableWithoutFeedback>
                    
                    <TouchableWithoutFeedback                         
                        onPress={() => this.deleteMemory(item.key)}
                    >
                        <Icon 
                            name="trash"
                            color = "#d80404"
                            size = {20}
                            style={styles.memoryIcon}
                        />
                    </TouchableWithoutFeedback>
                </View>              
            </View>   
        )
    }

    render(){     
        return(
            <View style={styles.container}>
            
                <View style={styles.copyMemoryFromClipboardContainer}> 
                    <TouchableWithoutFeedback 
                        onPress={() => this.copyMemoryFromClipboard()}
                    >
                        <View style={styles.copyMemoryFromClipboard}>
                            <TextInput editable = {false} style={styles.copyMemoryFromClipboardText}>Get memory from clipboard</TextInput>
                            <Icon 
                                name="clipboard"
                                color = "#0088ff"
                                size = {30}
                                style={styles.pasteIcon}
                            />
                        </View>                
                    </TouchableWithoutFeedback>
                </View>

                <Text style={styles.titleText}>My saved Memories:</Text>

                {this.props.data.memories 
                    ?
                    <ScrollView style={styles.memoriesContainer}>                            
                        <FlatList             
                            SeparatorComponent={() => <View style={{width: 5}} />}
                            renderItem={({item}) => this.renderItem(item)}                
                            data = {getSortedMemoriesFromObject(this.props.data.memories)}
                            extraData = {this.props.data.isFetching}  
                            keyExtractor={(item, index) => index.toString()}  
                        />
                    </ScrollView>
                    :
                    <Text style={styles.textNoMemories}>You can add a memory easily with the clipboard, or the "Share Tool", selecting any text in your device and pressing Share with Memories Cloud!</Text>
                }

                <DropdownAlert 
                    ref={ref => this.dropdown = ref} 
                    startDelta = {-200}
                /> 

                {this.props.data.isFetching &&
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
        flex: 1
    },
    copyMemoryFromClipboardContainer: {
        marginTop: 10,
        alignItems: 'center',
        borderColor: 'rgba(255, 255, 255, .5)',
        borderBottomWidth: 3, 
    },
    copyMemoryFromClipboard: {
        flexDirection: 'row',
        backgroundColor: '#fec600',
        marginBottom: 10
    },
    copyMemoryFromClipboardText:{
        fontSize: 15,
        color: '#0088ff',
        fontWeight: 'bold'
    },
    pasteIcon: {
        marginTop: 10,
        marginRight: 5,
        marginLeft: 5
    },
    memoriesContainer: {
        paddingHorizontal: 20,
        paddingVertical: 0,
    },
    memoryContainer: {
        flex: 1,        
        flexDirection: 'row',
        marginBottom: 10,
        width: width
    },
    memoryTextContainer: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        width: width - (30*3 + 40),
        backgroundColor: 'white'
    },
    memoryIconsContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        width: 30*3 + 10,
        marginTop: 15
    },
    memoryText: {
        color: '#0088ff'
    },
    memoryIcon: {
        marginRight: 5,
        marginLeft: 5
    },
    titleText: {
      textAlign: 'center',
      color: 'white',
      marginBottom: 10,
      fontSize: 25,
      fontWeight: 'bold',
      borderColor: 'rgba(255, 255, 255, .5)',
      borderBottomWidth: 3,
      paddingVertical: 10
    },
    textNoMemories: {
        textAlign: 'center',
        color: 'white',
        marginBottom: 10,
        fontSize: 14,
        paddingVertical: 10
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
  });
  
//mapStateToProps
const mapStateToProps = state => {
    return {data: state.data}
}

//mapDispatchToProps
const mapDispatchToProps = dispatch => {
    return {
        fetchData: (user) => dispatch(fetchData(user))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(List)