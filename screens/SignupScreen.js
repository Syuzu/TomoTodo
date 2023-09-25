import React, { useState } from 'react';
import { 
    ImageBackground, 
    TouchableOpacity,
    StyleSheet, 
    Text, 
    View, 
    KeyboardAvoidingView, 
    TextInput, 
    Image, } from 'react-native';
import { auth } from '../components/firebase';
import { firebase } from '../components/firebase'
import 'firebase/compat/storage'
import colors from '../components/Colors';
import * as screen from '../components/ScreenSize';
import * as ImagePicker from 'expo-image-picker';

const SignupScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [image, setImage] = useState(null)
    const [uploading, setUploading] = useState(false)

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            allowsMultipleSelection: false,
            aspect: [4, 4],
            quality: 1,
        });
    
        if (!result.cancelled) {
            setImage(result.assets[0].uri);
        }
    };

    const updatePFP = async (uid) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(xhr.response);
            };
            xhr.onerror = function() {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', image, true);
            xhr.send(null);
        })
        const ref = firebase.storage().ref().child(`profilepictures/${uid}`)
        const snapshot = ref.put(blob)
        snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED,
            ()=>{
                setUploading(true)
            },
            (error) => {
                setUploading(false)
                console.log(error)
                blob.close()
                return 
            },
            () => {
                snapshot.snapshot.ref.getDownloadURL().then((url) => {
                    setUploading(false)
                    // console.log("Download URL: ", url)
                    setImage(url)
                    blob.close()
                    // console.log('Updating photoURL with: ', url)
                    auth.currentUser.updateProfile({
                    photoURL: url
                    }) 
                    return url
                })
            }
          )
    }

    const handleSignUp = async () => {
        // create account
        await auth.createUserWithEmailAndPassword(email, password)  
        // alert message
        .then(() => {
            alert('Account created successfully\n\nGet ready to meet your pet!')
        }) 
        // setup user database
        .then(() => {
            firebase
            .firestore()
            .collection('users')
            .doc(`${auth.currentUser.uid}`)
            .set({})
            .then(() => {
                console.log('User database created');
            })  
        })      
        // setup tutorial
        .then(() => {
            firebase
            .firestore()
            .collection('users')
            .doc(`${auth.currentUser.uid}`)
            .collection('lists')
            .add({
                name: 'Tutorial',
                color: '#D88559',
                todos: [
                    {title: 'Create your first large task', completed: false},
                    {title: 'Create your first sub task', completed: false},
                    {title: 'Feed your pet', completed: false}
                ],
            })    
            .then(() => {
                console.log('Tutorial set up');
            })     
        })
        // setup pet
        .then(() => {
            firebase
            .firestore()
            .collection('users')
            .doc(`${auth.currentUser.uid}`)
            .collection('pets')
            .doc('cat')
            .set({
                name: 'Tomo',
                level: 0,
                exp: 0,
                hunger: 100,                
            })    
            .then(() => {
                console.log('Pet set up');
            })     
        })
        // setup inventory
        .then(() => {
            firebase
            .firestore()
            .collection('users')
            .doc(`${auth.currentUser.uid}`)
            .collection('inventory')
            .doc('foodlist')
            .set({
                food: [
                    //apple
                    {name: 'apple', 
                    description: 'Red apple',
                    imageurl: 'https://firebasestorage.googleapis.com/v0/b/tomotodo-fyp.appspot.com/o/inventory%2Ffood%2Fapple?alt=media&token=9a234bfc-5c80-4c67-a46b-d0d015240d16',
                    value: 10,
                    amount: 0},
                    //watermelon
                    {name: 'watermelon', 
                    description: 'Suika',
                    imageurl: 'https://firebasestorage.googleapis.com/v0/b/tomotodo-fyp.appspot.com/o/inventory%2Ffood%2Fwatermelon?alt=media&token=1c847266-1433-4326-8129-93c055e0806b',
                    value: 25,
                    amount: 0},
                    //carrot
                    {name: 'carrot', 
                    description: 'Ninjin',
                    imageurl: 'https://firebasestorage.googleapis.com/v0/b/tomotodo-fyp.appspot.com/o/inventory%2Ffood%2Fcarrot?alt=media&token=11c77141-3550-4901-af94-1bd19555af2b',
                    value: 10,
                    amount: 0},
                    //fish
                    {name: 'fish', 
                    description: 'Sakana',
                    imageurl: 'https://firebasestorage.googleapis.com/v0/b/tomotodo-fyp.appspot.com/o/inventory%2Ffood%2Ffish?alt=media&token=053796c2-6fab-4b30-8e8f-d71cf10684e8',
                    value: 30,
                    amount: 0},
                    //sushi
                    {name: 'sushi', 
                    description: 'Sushi da',
                    imageurl: 'https://firebasestorage.googleapis.com/v0/b/tomotodo-fyp.appspot.com/o/inventory%2Ffood%2Fsushi?alt=media&token=84ab4fb4-cbfc-430c-9c85-54d6c17607e3',
                    value: 30,
                    amount: 0},
                    //pizza
                    {name: 'pizza', 
                    description: 'Fresh',
                    imageurl: 'https://firebasestorage.googleapis.com/v0/b/tomotodo-fyp.appspot.com/o/inventory%2Ffood%2Fpizza?alt=media&token=067b8e8e-8fa5-4477-be29-b5a395d476af',
                    value: 40,
                    amount: 0},
                    //burger
                    {name: 'burger', 
                    description: '10 layers tall',
                    imageurl: 'https://firebasestorage.googleapis.com/v0/b/tomotodo-fyp.appspot.com/o/inventory%2Ffood%2Fburger?alt=media&token=f26bc9f8-1abc-424c-b5f5-d89310f9aef4',
                    value: 35,
                    amount: 0},
                    //coffee
                    {name: 'coffee', 
                    description: 'Black',
                    imageurl: 'https://firebasestorage.googleapis.com/v0/b/tomotodo-fyp.appspot.com/o/inventory%2Ffood%2Fcoffee?alt=media&token=18bc7b52-f01a-4ffb-b408-45ebd049cf4c',
                    value: 15,
                    amount: 0},
                    //cake
                    {name: 'cake', 
                    description: 'Chocolate',
                    imageurl: 'https://firebasestorage.googleapis.com/v0/b/tomotodo-fyp.appspot.com/o/inventory%2Ffood%2Fcake?alt=media&token=48f82675-e804-4a07-aabb-8590eec293d5',
                    value: 20,
                    amount: 0},
                ],              
            })    
            .then(() => {
                console.log('Inventory set up');
            })     
        })
        // update profile picture if provided
        .then(() => {
            if (image) {
                updatePFP(auth.currentUser.uid);
            }          
        })
        // update username if provided
        .then(() => {
            if (!username == '') {
                auth.currentUser.updateProfile({
                    displayName: username
                })
            }            
        })
        .catch(error => alert(error.message))          
    }

    const uploadImage = async () => {
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function() {
            resolve(xhr.response);
          };
          xhr.onerror = function() {
            reject(new TypeError('Network request failed'));
          };
          xhr.responseType = 'blob';
          xhr.open('GET', image, true);
          xhr.send(null);
        })
        const ref = firebase.storage().ref().child('inventory/food/cake')
        const snapshot = ref.put(blob)
        snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED,
          ()=>{
            setUploading(true)
          },
          (error) => {
            setUploading(false)
            console.log(error)
            blob.close()
            return 
          },
          () => {
            snapshot.snapshot.ref.getDownloadURL().then((url) => {
              setUploading(false)
              console.log("Download URL: ", url)
              setImage(url)
              blob.close()
              return url
            })
          }
          )
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior='height'>
            <ImageBackground source={require('../assets/system/background.jpg')} resizeMode="cover" style={styles.backgroundimage}>
                <Image source={logo = require('../assets/system/tomotodo.png')} resizeMode="center" style={styles.logo}/>
                <View style={styles.inputcontainer}>
                    {!image && <TouchableOpacity onPress={pickImage}>
                    <Image 
                    source={require('../assets/system/user.png')}  
                    style={styles.profilepicture} 
                    />
                    </TouchableOpacity>
                    }
                    {image && <TouchableOpacity onPress={pickImage}>
                    <Image 
                    source={{ uri: image }}
                    style={styles.profilepicture} 
                    />
                    </TouchableOpacity>
                    }                    
                    <TextInput
                        placeholder='Username' 
                        value={username}
                        onChangeText={text => setUsername(text)}
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder='Email' 
                        value={email}
                        onChangeText={text => setEmail(text)}
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder='Password' 
                        value={password}
                        onChangeText={text => setPassword(text)}
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}
                        style={styles.input} 
                        secureTextEntry
                    />
                </View>
                <View style={styles.buttoncontainer}>
                    <TouchableOpacity onPress={handleSignUp} style={styles.button}>
                        <Text style={styles.buttontext}>
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}

export default SignupScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,       
    },
    backgroundimage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: '95%',
        height: '25%',
        backgroundColor: colors.purple,
    },
    inputcontainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: screen.vh*0.01,
    },
    profilepicture: {
        width: screen.vh*0.1, 
        height: screen.vh*0.1, 
        borderRadius: screen.vh*0.1/ 2,
        overflow: "hidden",
        marginBottom: screen.vh*0.025,
    },
    input: {
        backgroundColor: colors.white,
        width: '80%',
        borderRadius: 50,
        paddingHorizontal: 30,
        paddingVertical: 20,
        elevation: 5,
        marginBottom: screen.vh*0.025,
    },
    buttoncontainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: colors.white,
        width: '60%',
        borderRadius: 50,        
        elevation: 5,
        height: screen.vh*0.075,
        marginTop: screen.vh*0.025,
    },
    buttontext: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.black,
    },
})