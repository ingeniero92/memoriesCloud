import * as firebase from 'firebase'

class FirebaseHelpers {

    // Setters
    static setUserName(userId, name){
        let userNamePath = "/user/" + userId + "/details/name"
        return firebase.database().ref(userNamePath).set(name)
    }
    
    static setUserBio(userId, bio){
        let userNamePath = "/user/" + userId + "/details/bio"
        return firebase.database().ref(userNamePath).set(bio)
    }
    
    static setUserPlace(userId, place){
        let userNamePath = "/user/" + userId + "/details/place"
        return firebase.database().ref(userNamePath).set(place)
    }

    // Getters
    static getName(userId, callback){
        let userNamePath = "/user/" + userId + "/details/name"
        firebase.database().ref(userNamePath).on('value', (snapshot) => {
            let name = ''
            if (snapshot.val()){
                name = snapshot.val()
            }
            callback(name)
        })
    }

}

module.exports = FirebaseHelpers