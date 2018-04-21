import React, {Component} from 'react'
import{
    Text,
    View,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
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

import {MAX_MEMORY_LENGTH, MAX_TITLE_LENGTH} from '../constants'

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
            modalMemoryTitle: '',
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
    
    // Metodos para cargar la lista al volver desde el background (deshabilitado)

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange)
    }
    
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange)
    }
    
    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            try {
                //this.updateList()
            } catch(error){
                console.log(error)
            }            
        }
        this.setState({appState: nextAppState})
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

    // Metodos para crear recuerdos

    newMemory(){
        const {navigate} = this.props.navigation
        navigate('NewMemory')
    }

    // Metodos para usar el portapapeles

    async copyMemoryFromClipboard(){
        var value = await Clipboard.getString() 
        subValue = String.prototype.substr.call(value,0,MAX_MEMORY_LENGTH)
        return subValue
    }

    copyToClipboard(text) {
        Clipboard.setString(text)
        this.dropdown.alertWithType('success', 'Text copied to clipboard:', text)
    }

    async newMemoryFromClipboard(){        
        const {navigate} = this.props.navigation
        var value = await this.copyMemoryFromClipboard()
        navigate('NewMemory', {source: 'clipboard',value})
    }

    // Metodos para editar y borrar recuerdos

    saveMemory(){      
        
        NetInfo.isConnected.fetch().then(isConnected => {
            this.toggleModal()
            if(isConnected){                
                if(this.state.modalMemoryText != ''){
                    FirebaseHelpers.editMemory(this.state.uid,this.state.modalMemoryId,this.state.modalMemoryTitle,this.state.modalMemoryText)        
                    this.updateList() 
                } else {
                    this.dropdown.alertWithType('error', 'Error', 'The memory can not be empty.')
                }
            } else {
                this.dropdown.alertWithType('error', 'Error', 'No Internet. Check your connection.')
            }
        })     

    }   

    deleteMemory(){      
        
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

    // Metodos para mostrar el modal

    showDeleteModal(memoryId,title,text){
        this.setState({
            modalMemoryId: memoryId,
            modalMemoryTitle: title,
            modalMemoryText: text            
        })
        this.toggleModal()
    }

    toggleModal = () => this.setState({ isModalVisible: !this.state.isModalVisible })

    // Metodos para pintar los recuerdos en la lista

    getDifDates(item){        

        // Fix para el bug del multiple render de la flatlist (cuando el render se reinicia)
        if(this.state.numberRenders != item.index){
            this.state.difDateMessages = []
            this.state.numberRenders = 0
        }   

        var dif = null     

        if(this.state.numberRenders <= this.state.memoriesSize){
            
            dif = compareDates(item.date)
            var difDateMessages = this.state.difDateMessages

            if(difDateMessages.indexOf(dif) == -1){    
                difDateMessages.push(dif)                      
            }  else {
                dif = null
            }

        }

        this.state.numberRenders++ 

        // Fix para el bug del multiple render de la flatlist (cuando el render se ha completado)
        this.state.memoriesSize = Object.keys(this.props.memories.memories).length        
        if(this.state.numberRenders >= this.state.memoriesSize){
            this.state.difDateMessages = []
            this.state.numberRenders = 0
        }
       
        return dif
    }

    renderItem(item){   
        
        const {navigate} = this.props.navigation  
       
        difDates = this.getDifDates(item)

        var marginTopIcons = 10

        {item.title ? marginTopIcons = 30 : item.title = null}       

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

                    <View style={[styles.memoryTextContainer, { width: this.state.width - (30*3 + 55) }]}>
                        {item.title && 
                            <TextInput editable = {false} style={styles.memoryTitle}>{item.title}</TextInput>
                        }                        
                        <ScrollView style={styles.memoryTextScrollView} horizontal>     
                            <TextInput editable = {false} style={styles.memoryText}>{item.text}</TextInput>
                        </ScrollView>            
                    </View>

                    <View style={[styles.memoryIconsContainer, {marginTop: marginTopIcons}]}>
                        <TouchableOpacity 
                            onPress={() => this.onShare(item.text)}
                            activeOpacity = {0.9}
                        >
                            <Icon 
                                name="share-alt-square"
                                color = "white"
                                size = {25}
                                style={styles.memoryIcon}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => this.copyToClipboard(item.text)}
                            activeOpacity = {0.9}
                        >
                            <Icon 
                                name="copy"
                                color = "white"
                                size = {25}
                                style={styles.memoryIcon}
                            />
                        </TouchableOpacity>
                        
                        <TouchableOpacity                         
                            onPress={() => this.showDeleteModal(item.key,item.title,item.text)}
                            activeOpacity = {0.9}
                        >
                            <Icon 
                                name="edit"
                                color = "white"
                                size = {25}
                                style={styles.memoryIcon}
                            />
                        </TouchableOpacity>
                    </View>         

                </View>                  

            </View>

        )
    }

    render(){   

        return(            
            <View style={styles.container} onLayout={this._handleLayout}>
            
                {/* Botones New y Copy From Clipboard */}

                <View style={styles.buttonsContainer}> 
                    <TouchableOpacity 
                        onPress={() => this.newMemory()}
                        style={styles.newMemoryButton}
                        activeOpacity = {0.9}
                    >                         
                        <Icon 
                            name="plus"
                            color = "white"
                            size = {25}
                        />           
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => this.newMemoryFromClipboard()}
                        activeOpacity = {0.9}
                    >
                        <View style={styles.copyMemoryFromClipboardButton}>
                            <Text style={styles.copyMemoryFromClipboardButtonText}>Get memory from clipboard</Text>
                            <Icon 
                                name="clipboard"
                                color = "#0088ff"
                                size = {25}
                                style={styles.pasteIcon}
                            />
                        </View>                
                    </TouchableOpacity>
                </View>

                {/* Lista de Recuerdos */}

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
                        <Text style={styles.noMemoriesText}>You can add a memory easily with the clipboard, or the "Share Tool", selecting any text in your device and pressing Share with Memories Cloud.</Text>
                        <TouchableOpacity 
                            onPress={() => this.props.navigation.navigate("Help")}
                            activeOpacity = {0.9}
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
                        </TouchableOpacity>
                    </View>
                }       

                {/* Modal de info de recuerdo*/}       

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
                    <View style={[styles.modalBox, {width: this.state.width - 60}]}>
                        
                        <Text style={styles.modalTitle}>Edit Memory</Text>

                        <TextInput 
                            editable = {true} 
                            selectionColor="#449DEF"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#0088ff"
                            placeholder = "Title"
                            style={styles.memoryModalTitle}
                            value = {this.state.modalMemoryTitle}
                            onChangeText = {(modalMemoryTitle) => this.setState({modalMemoryTitle})}
                            maxLength = {MAX_TITLE_LENGTH}
                        />

                        <TextInput 
                            editable = {true} 
                            selectionColor="rgba(255, 255, 255, .5)"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="white"
                            placeholder = "Memory"
                            style={styles.memoryTextModal}
                            value = {this.state.modalMemoryText}
                            onChangeText = {(modalMemoryText) => this.setState({modalMemoryText})}
                            maxLength = {MAX_MEMORY_LENGTH}
                        />     

                        <TouchableOpacity
                            onPress={() => this.saveMemory()}
                            style={styles.backButton}
                            underlayColor = '#fec600'
                            activeOpacity = {0.9}
                        >                                       
                            <Text style={styles.textBackButton}>Save changes</Text>
                        </TouchableOpacity> 

                        <TouchableOpacity
                            onPress={() => this.deleteMemory()}
                            style={styles.deleteButton}
                            underlayColor = 'red'
                            activeOpacity = {0.9}
                        >                                       
                            <Text style={styles.textDeleteButton}>Delete Memory</Text>
                        </TouchableOpacity>                          

                    </View>
                </Modal>      

                {/* Dropdownalert */}

                <DropdownAlert 
                    ref={ref => this.dropdown = ref} 
                    updateStatusBar = {false}
                /> 

                {/* Loading */}

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
        fontWeight: 'bold',
        marginBottom: 1
    },
    noMemoriesText:{
        fontSize: 14,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    noMemoriesIcon: {
        marginTop: 6,
        marginBottom: 5,
        marginRight: 10,
        marginLeft: 5
    },
    buttonsContainer: {        
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15
    },
    newMemoryButton: {        
        backgroundColor: '#32A54A',
        alignItems:'center',
        justifyContent:'center',
        width:45,
        height:45,
        borderRadius:100,
    },
    copyMemoryFromClipboardButton: {
        flexDirection: 'row',
        backgroundColor: '#fec600',
        marginLeft: 10,
        marginBottom: 10,
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 7
    },
    copyMemoryFromClipboardButtonText:{
        fontSize: 15,
        color: '#0088ff',
        fontWeight: 'bold',
        marginTop: 8
    },
    pasteIcon: {
        marginTop: 6,
        marginBottom: 5,
        marginRight: 5,
        marginLeft: 5
    },
    memoriesContainer: {
        paddingHorizontal: 20
    },
    memoryContainer: {
        flex: 1,        
        flexDirection: 'row',
        marginBottom: 15,
    },
    memoryTextContainer: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        backgroundColor: 'white',
    },
    memoryIconsContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        width: 30*3 + 25
    },
    memoryTitle: {
        color: '#0088ff',
        fontSize: 15,
        fontWeight: 'bold',
        borderColor: '#0088ff',
        borderBottomWidth: 2,
        height: 40
    },
    memoryText: {
        color: '#0088ff',
        height: 41
    },
    memoryIcon: {
        marginRight: 5,
        marginLeft: 5
    },
    titleText: {
      textAlign: 'center',
      color: 'white',
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
        height: 310,
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
      fontSize: 25,
      fontWeight: 'bold',
      borderColor: '#0088ff',
      borderBottomWidth: 3,
      marginBottom: 5
    },
    deleteButton:{
        backgroundColor: 'red',
        paddingVertical: 20
    },
    backButton:{
        backgroundColor: '#fec600',
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
        color: 'white',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        backgroundColor: '#0088ff',
        marginBottom: 10,
        height: 50
    },
    memoryModalTitle: {
        textAlign: 'center',
        color: '#0088ff',
        fontSize: 15,
        borderColor: '#0088ff',
        borderBottomWidth: 2,
        marginBottom: 10,
        paddingVertical: 10
    },
    dateSeparatorContainer: {
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10
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
})
  
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