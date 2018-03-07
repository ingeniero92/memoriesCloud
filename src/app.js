import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';

import SlideMenu from 'react-native-side-menu'
import DropdownAlert from 'react-native-dropdownalert'

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

export default App

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0088ff',
    }
});