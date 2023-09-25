import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getStorage, ref } from "firebase/storage";
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "Refer to report.pdf",
    authDomain: "tomotodo-fyp.firebaseapp.com",
    projectId: "tomotodo-fyp",
    storageBucket: "tomotodo-fyp.appspot.com",
    messagingSenderId: "251679075383",
    appId: "1:251679075383:web:0da223572159ff2a0723b2"
};

// Initialize Firebase
let app;

if (firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
}
else {
    app = firebase.app()
}

const auth = firebase.auth()
const storage = getStorage(app);

export { auth, storage, firebase };

class Fire {
    constructor(callback) {
        this.init(callback)
    }

    init(callback) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig)
        }

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                callback(null, user)
            } else {
                firebase
                .auth()
                .signInAnonymously()
                .catch(error => {
                    callback(error);
                });
            }
        });
    }

    getPet(callback) {
        // console.log('getPet')
        firebase.
        firestore()
        .collection("users")
        .doc(this.userId)
        .collection('pets')
        .doc('cat')
        .get()
        .then((snapshot) => {
            callback(snapshot.data())
        })
        .catch((e) => console.log(e));
    }

    updatePet(pet) {
        firebase
        .firestore()
        .collection('users')
        .doc(this.userId)
        .collection('pets')
        .doc('cat')
        .update(pet)
        .catch((e) => console.log(e));
    }

    getFood(callback) {
        // console.log('getPet')
        firebase.
        firestore()
        .collection("users")
        .doc(this.userId)
        .collection('inventory')
        .doc('foodlist')
        .get()
        .then((snapshot) => {
            callback(snapshot.data())
        })
        .catch((e) => console.log(e));
    }

    

    getLists(callback) {
        let ref = this.ref.orderBy('name');

        this.unsubscribe = ref.onSnapshot(snapshot => {
            lists = [];

            snapshot.forEach(doc => {
                lists.push({id: doc.id, ...doc.data()});
            });

            callback(lists);
        });
    }

    addList(list) {
        let ref = this.ref;

        ref.add(list);
    }

    deleteList(task) {
        let ref = this.ref;

        ref
        .doc(task.id)
        .delete();
    }

    updateList(list) {
        let ref = this.ref;

        ref.doc(list.id).update(list);
    }
    
    updateFood(food) {
        let ref = this.food;

        ref.update(food);
    }

    get userId() {
        // console.log('userId')
        return firebase.auth().currentUser.uid
    }

    get ref() {
        // console.log('ref')
        return firebase
        .firestore()
        .collection('users')
        .doc(this.userId)
        .collection('lists');
    }

    get food() {
        // console.log('ref')
        return firebase
        .firestore()
        .collection('users')
        .doc(this.userId)
        .collection('inventory')
        .doc('foodlist');
    }

    detach() {
        this.unsubscribe();
    }
}

export default Fire;