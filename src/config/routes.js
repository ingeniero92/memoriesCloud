import App from '../app'
import Login from '../components/Login'
import Register from '../components/Register'
import Loading from '../components/Loading'
import Profile from '../components/Profile'
import NewMemory from '../components/NewMemory'
import SendPassword from '../components/SendPassword'
import Help from '../components/Help'
import Support from '../components/Support'

const Routes = {
    Home: {
        screen: App, 
        navigationOptions: ({navigation}) => ({
            header: false
          })
    },
    Login: {
        screen: Login, 
        navigationOptions: ({navigation}) => ({
            header: false
          })
    },
    Register: {
        screen: Register, 
        navigationOptions: ({navigation}) => ({
            header: false
          })
    },
    Loading: {
        screen: Loading,
        navigationOptions: ({navigation}) => ({
            header: false
        })
    },
	Profile: {
		screen: Profile,
		navigationOptions: ({navigation}) => ({
			header: false
		})
    },
    NewMemory: {
		screen: NewMemory,
		navigationOptions: ({navigation}) => ({
			header: false
		})
    },
    SendPassword: {
		screen: SendPassword,
		navigationOptions: ({navigation}) => ({
			header: false
		})
    },
    Help: {
		screen: Help,
		navigationOptions: ({navigation}) => ({
			header: false
		})
    },
    Support: {
		screen: Support,
		navigationOptions: ({navigation}) => ({
			header: false
		})
    }
}

export default Routes