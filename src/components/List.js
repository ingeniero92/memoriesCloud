import React, {Component} from 'react'
import{
    Text,
    View,
    StyleSheet,
    FlatList,
    Image,
    TouchableWithoutFeedback,
    TouchableHighlight,
    ScrollView,
    Alert,
    TextInput,
    Dimensions,
    Share,
    Clipboard,
    ActivityIndicator,
    AppState,
    TouchableNativeFeedback,
    NetInfo
} from 'react-native'

import Modal from "react-native-modal"
import Icon from 'react-native-vector-icons/FontAwesome'
import DropdownAlert from 'react-native-dropdownalert'
import * as firebase from 'firebase'
import * as Animatable from 'react-native-animatable'
import {connect} from 'react-redux'

import { getSortedMemoriesFromObject, compareDates } from '../lib'
import FirebaseHelpers from '../api/firebaseHelpers'

import { fetchMemories } from '../actions/memoriesActions'
import { fetchUser } from '../actions/userActions'

const {width, height} = Dimensions.get('window')

class List extends Component {

    constructor(props){
        super(props)
        this.state = {
            uid: '',
            refreshing: false,
            appState: '',
            isModalVisible: false,
            modalMemoryId: '',
            modalMemoryText: '',
            width,
            height,
            difDateMessages: [],
            memoriesSize: 0,
            numberRenders: 0
        }
        this.getUser()
    }

    // Operaciones de Usuario
    
    async getUser(){
        
        try {
            firebase.auth().onAuthStateChanged((user) => {             
                if(user){     
                    this.setState({     
                        uid: user.uid
                    }) 
                    this.updateList()
                }                             
            })        
        } catch (error){
            console.log(error)
        }        
    }

    // Metodo para actualizar la lista

    updateList(){

        NetInfo.isConnected.fetch().then(isConnected => {
            if(isConnected){
                this.props.fetchMemories(this.state.uid)
            } else {
                this.dropdown.alertWithType('error', 'Error', 'No Internet. Check your connection.')
            }
        })
        
    }

    // Metodo para actualizar las dimensiones actuales del dispositivo (debido a los posibles giros de pantalla)

    _handleLayout = event => {
        this.setState({
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height
        })
    }
    
    // Metodos para cargar la lista al volver desde el background

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }
    
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }
    
    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            try {
                console.log(this.state.appState)
                console.log(nextAppState)
                //this.updateList()
            } catch(error){
                console.log(error)
            }            
        }
        this.setState({appState: nextAppState});
    }

    // Metodo para compartir recuerdos

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

    // Metodos para usar el portapapeles

    copyToClipboard(text) {
        Clipboard.setString(text);
        this.dropdown.alertWithType('success', 'Text copied to clipboard:', text)
    }

    copyMemoryFromClipboard(){        
        const {navigate} = this.props.navigation
        navigate('NewMemory', {source: 'clipboard'})
    }

    // Metodos para borrar recuerdos

    deleteMemory(memoryId){      
        
        NetInfo.isConnected.fetch().then(isConnected => {
            this.toggleModal()
            if(isConnected){                
                FirebaseHelpers.removeMemory(this.state.uid,this.state.modalMemoryId)        
                this.updateList() 
            } else {
                this.dropdown.alertWithType('error', 'Error', 'No Internet. Check your connection.')
            }
        })     

    }   

    // Metodos para mostrar el modal de borrar recuerdo

    showDeleteModal(text,memoryId){
        this.setState({
            modalMemoryId: memoryId,
            modalMemoryText: text
        })
        this.toggleModal()
    }

    toggleModal = () => this.setState({ isModalVisible: !this.state.isModalVisible })

    // Metodos para pintar los recuerdos en la lista

    getDifDates(date){

        this.state.numberRenders++ 
        
        var dif = null        
        
        // Fix para el bug del doble render de la flatlist
        this.state.memoriesSize = Object.keys(this.props.memories.memories).length        
        if(this.state.numberRenders == this.state.memoriesSize){
            this.state.difDateMessages = []
            this.state.numberRenders = 0
        }

        if(this.state.numberRenders <= this.state.memoriesSize){
            
            dif = compareDates(date)
            var difDateMessages = this.state.difDateMessages

            if(difDateMessages.indexOf(dif) == -1){    
                difDateMessages.push(dif)                      
            }  else {
                dif = null
            }

        }
       
        return dif
    }

    renderItem(item){   
        
        const {navigate} = this.props.navigation  
       
        difDates = this.getDifDates(item.date)

        return (

            <View>

                {/* Separador de Fechas */}

                {difDates &&
                    <View style = {styles.dateSeparatorContainer}>                     
                        <Text style = {styles.dateSeparatorText}>{difDates}</Text>
                    </View>
                }

                {/* Recuerdo */}

                <View style={[styles.memoryContainer, { width: this.state.width}]}>                                 

                    <View style={[styles.memoryTextContainer, { width: this.state.width - (30*3 + 40) }]}>
                        <ScrollView horizontal>
                            <TextInput editable = {false} style={styles.memoryText}>{item.text}</TextInput>
                        </ScrollView>            
                    </View>

                    <View style={[styles.memoryIconsContainer, {width: 30*3 + 10}]}>
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
                            onPress={() => this.showDeleteModal(item.text,item.key)}
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

            </View>

        )
    }

    render(){   

        return(            
            <View style={styles.container} onLayout={this._handleLayout}>
            
                <View style={styles.copyMemoryFromClipboardContainer}> 
                    <TouchableWithoutFeedback 
                        onPress={() => this.copyMemoryFromClipboard()}
                    >
                        <View style={styles.copyMemoryFromClipboardButton}>
                            <Text style={styles.copyMemoryFromClipboardButtonText}>Get memory from clipboard</Text>
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

                {this.props.memories.memories 
                    ?
                    <ScrollView style={styles.memoriesContainer}>                            
                        <FlatList             
                            SeparatorComponent={() => <View style={{width: 5}} />}
                            renderItem={({item}) => this.renderItem(item)}                
                            data = {getSortedMemoriesFromObject(this.props.memories.memories)}
                            extraData = {this.props.memories.isFetching}  
                            keyExtractor={(item, index) => index.toString()}  
                        />
                    </ScrollView>
                    :
                    <View style={styles.noMemoriesContainer}> 
                        <Text style={styles.noMemoriesText}>You can add a memory easily with the clipboard, or the "Share Tool", selecting any text in your device and pressing Share with Memories Cloud!</Text>
                        <TouchableWithoutFeedback 
                            onPress={() => this.props.navigation.navigate("Help")}
                        >
                            <View style={styles.noMemoriesButton}>
                                <Text style={styles.noMemoriesTextButton}>Yet lost? Get Help!</Text>
                                <Icon 
                                    name="book"
                                    color = "white"
                                    size = {30}
                                    style={styles.noMemoriesIcon}
                                />
                            </View>                
                        </TouchableWithoutFeedback>
                    </View>
                }              

                <Modal 
                    style={styles.modalContainer}                
                    isVisible={this.state.isModalVisible}
                    supportedOrientations={['portrait', 'landscape']}
                    onBackdropPress={() => this.toggleModal()}     
                    onBackButtonPress={() => this.toggleModal()}    
                    animationIn = {'pulse'}  
                    animationOut = {'pulse'} 
                    animationInTiming = {600}
                    animationOutTiming = {1}
                    hideModalContentWhileAnimating = {true}
                    backdropOpacity = {0.40}
                >
                    <View style={styles.modalBox}>
                        
                        <Text style={styles.modalTitle}>Delete Memory?</Text>

                        <View style={styles.memoryTextModal}>
                            <ScrollView horizontal>
                                <TextInput editable = {false} style={styles.memoryModalText}>{this.state.modalMemoryText}</TextInput>
                            </ScrollView>  
                        </View>

                        <TouchableHighlight
                            onPress={() => this.deleteMemory()}
                            style={styles.deleteButton}
                            underlayColor = 'red'
                        >                                       
                            <Text style={styles.textDeleteButton}>Delete</Text>
                        </TouchableHighlight>  

                        <TouchableHighlight
                            onPress={() => this.toggleModal()}
                            style={styles.backButton}
                            underlayColor = '#fec600'
                        >                                       
                            <Text style={styles.textBackButton}>Back</Text>
                        </TouchableHighlight> 

                    </View>
                </Modal>      

                <DropdownAlert 
                    ref={ref => this.dropdown = ref} 
                    updateStatusBar = {false}
                /> 

                {this.props.memories.isFetching &&
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
    noMemoriesContainer: {
        marginTop: 10,
        alignItems: 'center', 
    },
    noMemoriesButton: {
        flexDirection: 'row',
        backgroundColor: '#32A54A',
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 5
    },
    noMemoriesTextButton:{
        paddingHorizontal: 10,
        paddingVertical: 10,
        textAlign: 'center',
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold'
    },
    noMemoriesText:{
        fontSize: 14,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15
    },
    noMemoriesIcon: {
        marginTop: 5,
        marginBottom: 5,
        marginRight: 10,
        marginLeft: 5
    },
    copyMemoryFromClipboardContainer: {
        marginTop: 10,
        alignItems: 'center',
        borderColor: 'rgba(255, 255, 255, .5)',
        borderBottomWidth: 3, 
    },
    copyMemoryFromClipboardButton: {
        flexDirection: 'row',
        backgroundColor: '#fec600',
        marginBottom: 10,
        paddingHorizontal: 5,
        paddingVertical: 5
    },
    copyMemoryFromClipboardButtonText:{
        fontSize: 15,
        color: '#0088ff',
        fontWeight: 'bold',
        marginTop: 10
    },
    pasteIcon: {
        marginTop: 5,
        marginBottom: 5,
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
    },
    memoryTextContainer: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        backgroundColor: 'white'
    },
    memoryIconsContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
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
    },
    modalBox: {        
        backgroundColor: 'white',
        width: width - 60,
        height: 280,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    modalContainer: {
        alignItems: 'center'
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
    backButton:{
        backgroundColor: '#fec600',
        paddingVertical: 20
    },
    deleteButton:{
        backgroundColor: 'red',
        paddingVertical: 20,
        marginBottom: 10
    },
    textBackButton: {
       textAlign: 'center',
       color: '#0088ff',
       fontWeight: 'bold'
    },
    textDeleteButton: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
    },
    memoryTextModal: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        backgroundColor: '#0088ff',
        marginBottom: 10,
        height: 50
    },
    memoryModalText: {
        color: 'white'
    },
    dateSeparatorContainer: {
        alignItems: 'center',
        marginBottom: 10
    }, 
    dateSeparatorText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        backgroundColor: '#32A54A',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 1
    }
  });
  
//mapStateToProps
const mapStateToProps = state => {
    return {memories: state.memories, user: state.user}
}

//mapDispatchToProps
const mapDispatchToProps = dispatch => {
    return {
        fetchMemories: (user) => dispatch(fetchMemories(user)),
        fetchUser: () => dispatch(fetchUser())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(List)