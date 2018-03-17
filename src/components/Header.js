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

{/* Componente de funcion, en lugar de clase, ya que no tiene estado, solo muestra datos */}
{/* Si en vez de {} pusieramos () */}
{/* Props puede ir con parentesis. O ({navigation}) para poder usarlo como parametro */}

class Header extends Component {

    constructor(props){
        super(props)
        this.state = {
        }
    }

    handleViewRef = ref => this.view = ref;

    toggleMenu(){        
        this.view.bounceIn(2000)
        this.props.toggle()
    }

    render(){
        return(
            <View style = {styles.container}>
            
                <TouchableWithoutFeedback onPress = { () => this.toggleMenu()}>
                    <Animatable.View ref={this.handleViewRef}>
                        <Icon
                            name = "bars"
                            color = "white"
                            size = {25}
                        />
                    </Animatable.View>
                </TouchableWithoutFeedback>

                <Image style={styles.logo} source={require('../images/logo.png')}/>

                <TouchableWithoutFeedback>
                <Icon 
                    name="search"
                    color="transparent"
                    size={25}
                />
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