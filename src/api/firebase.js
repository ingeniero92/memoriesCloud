import * as firebase from 'firebase'

const config = { 
    apiKey: "AIzaSyCGU19Mzn1HjbGOA4m8CIfV11YSOVGH_XI",
    authDomain: "memoriescloud-app.firebaseapp.com",
    databaseURL: "https://memoriescloud-app.firebaseio.com",
    projectId: "memoriescloud-app",
    storageBucket: "memoriescloud-app.appspot.com",
}

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();