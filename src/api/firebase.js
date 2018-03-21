import * as firebase from 'firebase'

const config = { 
    apiKey: "AIzaSyAy_ZDEWc_BYiy9Kbo_OvClOFgJKDFkLxU",
    authDomain: "netflix2-7b1f9.firebaseapp.com",
    databaseURL: "https://netflix2-7b1f9.firebaseio.com",
    projectId: "netflix2-7b1f9",
    storageBucket: "netflix2-7b1f9.appspot.com"
}

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();