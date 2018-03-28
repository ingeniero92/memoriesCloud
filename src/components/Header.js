import React, {Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Image
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import * as Animatable from 'react-native-animatable'

class Header extends Component {

    constructor(props){
        super(props)
        this.state = {
        }
    }

    handleMenuView = ref => this.menu = ref;
    handleRefreshView = ref => this.refresh = ref;

    toggleMenu(){        
        this.menu.bounceIn(2000)
        this.props.toggle()
    }

    refreshList(){
        this.refresh.rotate(1250)
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

export default Header