import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler
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
            isOpen: false
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
            BackHandler.exitApp()
        }

        return true
    
    }

    render(){
        return (           
            <View style={[{flex:1}, styles.container]}>
                <SlideMenu
                    menu = {<Menu navigation={this.props.navigation} />}
                    isOpen = {this.state.isOpen}
                    onChange = { (isOpen) => this.updateMenu(isOpen)}              
                >
                    <View style={[{flex: 1}, styles.container]}>
                        <Header navigation = {this.props.navigation} toggle = {this.toggle.bind(this)} />
                        <List navigation = {this.props.navigation} />
                    </View>                
                </SlideMenu>                              
            </View>          
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0088ff',
    }
});

//mapStateToProps
const mapStateToProps = state => {
    return {data: state.data, nav: state.nav}
}

export default connect(mapStateToProps)(App)