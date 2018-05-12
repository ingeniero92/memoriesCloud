import * as firebase from 'firebase'

class FirebaseHelpers {

    // Getters Memories

    static getMemories(userId){

        let userMemoriesPath = "/user/" + userId + "/memories"
        var ref = firebase.database().ref(userMemoriesPath)

        return ref.once("value", (snapshot) => {
            let memories = snapshot.val()
        }).then(response => Promise.all([response.val()])) // response, response.json()

    }

    // Setters Memories
    
    static setMemory(userId, memory){
        let userNamePath = "/user/" + userId + "/memories"
        var ref = firebase.database().ref(userNamePath)
        ref.push(memory)
    }

    static editMemory(userId, memoryId, memoryTitle, memoryText){
        let memoryTitlePath = "/user/" + userId + "/memories/" + memoryId + "/title"
        let memoryTextPath = "/user/" + userId + "/memories/" + memoryId + "/text"
        firebase.database().ref(memoryTitlePath).set(memoryTitle)
        firebase.database().ref(memoryTextPath).set(memoryText)
    }

    static removeMemory(userId, memoryId){
        let userNamePath = "/user/" + userId + "/memories/" + memoryId
        var ref = firebase.database().ref(userNamePath)
        ref.remove()
    }

    // Setters User

        static setUserName(userId, name){
            let userNamePath = "/user/" + userId + "/details/name"
            return firebase.database().ref(userNamePath).set(name)
        }

    // Getters User

    static getActualUser(){
        return firebase.auth().currentUser
    }

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

    // Getters App

    static getMinVersion(callback){
        
        let minVersionPath = "/appData/minVersion"
        
        firebase.database().ref(minVersionPath).on('value', (snapshot) => {
            let minVersion = ''
            if (snapshot.val()){
                minVersion = snapshot.val()
            }
            callback(minVersion)
        })
    }

}

module.exports = FirebaseHelpers