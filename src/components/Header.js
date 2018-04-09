import React, {Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Image,
    NetInfo
} from 'react-native'

import DropdownAlert from 'react-native-dropdownalert'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as Animatable from 'react-native-animatable'
import {connect} from 'react-redux'

import { fetchMemories } from '../actions/memoriesActions'
import { fetchUser } from '../actions/userActions'

class Header extends Component {

    constructor(props){
        super(props)
        this.state = {
        }
        this.props.fetchUser()
    }

    handleMenuView = ref => this.menu = ref;
    handleRefreshView = ref => this.refresh = ref;

    toggleMenu(){        
        this.menu.bounceIn(2000)
        this.props.toggle()
    }

    refreshList(){

        NetInfo.isConnected.fetch().then(isConnected => {
            if(isConnected){
                this.refresh.rotate(200)
                this.props.fetchMemories(this.props.user.user.uid) 
            } else {
                this.dropdown.alertWithType('error', 'Error', 'No Internet. Check your connection.')
            }
        })   

    }

    render(){
        return(
            <View style = {styles.container}>
            
                <TouchableWithoutFeedback onPress = { () => this.toggleMenu()}>
                    <Animatable.View ref={this.handleMenuView}>
                        <Icon
                            name = "bars"
                            color = "white"
                            size = {25}
                        />
                    </Animatable.View>
                </TouchableWithoutFeedback>

                <Image style={styles.logo} source={require('../images/logo.png')}/>

                <TouchableWithoutFeedback onPress = { () => this.refreshList()}>
                    <Animatable.View ref={this.handleRefreshView}>
                        <Icon 
                            name="refresh"
                            color="white"
                            size={25}
                        />
                    </Animatable.View>
                </TouchableWithoutFeedback>

                <DropdownAlert 
                    ref={ref => this.dropdown = ref} 
                    updateStatusBar = {false}
                /> 

            </View>
        )
    }
   
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 80,
        alignItems: 'center',
        justifyContent:'space-between',
        backgroundColor: '#0088ff',
        paddingHorizontal: 15,
        paddingTop: 10,    
        borderColor: 'rgba(255, 255, 255, .5)',
        borderBottomWidth: 3,  
    },
    logo: {
        width: 150,
        height: 60,
        marginBottom: 10
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

export default connect(mapStateToProps,mapDispatchToProps)(Header)