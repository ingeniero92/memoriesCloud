import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    ActivityIndicator,
    Dimensions
} from 'react-native';

import SlideMenu from 'react-native-side-menu'
import {connect} from 'react-redux'

import Header from './components/Header'
import Menu from './components/Menu'
import List from './components/List'

class App extends Component{

    constructor(props){
        super(props)
            this.state = {
            isOpen: false,
            loading: false
        }
    }

    toggle(){
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    updateMenu(isOpen){
        this.setState({isOpen})
    }

    setLoading(loading){
        this.setState({
            loading
        })
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backPressed)
    }
     
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed)
    }
     
    backPressed = () => {        
    
        const { nav } = this.props
        const { routes, index } = nav
        const currentRoute = routes[index];

        if(currentRoute.routeName != "Home"){
            this.props.navigation.pop()
        } else {
            if(this.state.isOpen){
                this.setState({
                    isOpen: false
                })
            } else {
                BackHandler.exitApp()
            }            
        }

        return true
    
    }

    render(){
        return (           
            <View style={[{flex:1}, styles.container]}>
                <SlideMenu
                    openMenuOffset = {(Dimensions.get('window').width/3)*2}
                    disableGestures = {true}
                    menu = {<Menu navigation={this.props.navigation} updateMenu = {this.updateMenu.bind(this)} setLoading = {this.setLoading.bind(this)} menuWidth = {(Dimensions.get('window').width/3)*2}/>}
                    isOpen = {this.state.isOpen}
                    onChange = { (isOpen) => this.updateMenu(isOpen)}     
                >
                    <View style={[{flex: 1}, styles.container]}>
                        <Header navigation = {this.props.navigation} toggle = {this.toggle.bind(this)} />
                        <List navigation = {this.props.navigation} />
                    </View>                
                </SlideMenu>    

                {this.state.loading &&
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
        backgroundColor: '#0088ff',
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
    return {memories: state.memories, nav: state.nav}
}

export default connect(mapStateToProps)(App)