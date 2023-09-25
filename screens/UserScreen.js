import React, { useState, useEffect } from "react";
import { 
  TouchableOpacity, 
  StyleSheet, 
  Text, 
  View, 
  Image, } from 'react-native';
import { auth } from '../components/firebase';
import colors from '../components/Colors';
import * as screen from '../components/ScreenSize';

export default function UserScreen() {
    const [email, setEmail] = useState()
    const [uid, setUID] = useState()
    const [username, serUsername] = useState()
    const [profilepicture, setProfilePicture] = useState()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user){
                setEmail(auth.currentUser?.email)
                setUID(auth.currentUser?.uid)
                serUsername(auth.currentUser?.displayName)
                setProfilePicture(auth.currentUser?.photoURL)
            }
        })
        return unsubscribe
    }, [])  

    const handleSignout = () => {
        auth.signOut()
        .catch(error => {
            console.log(error.message)
        })
    }

  return (
    <View style={styles.container}>            
      {profilepicture &&
      <Image 
      source={{ uri: profilepicture }}  
      style={styles.profilepicture} 
      />
      }
      {!profilepicture &&
      <Image 
      source={require('../assets/system/user.png')}  
      style={styles.profilepicture} 
      />
      }
      
      {username &&
      <View style={styles.usernamecontainer}>
        <Text style={styles.username}>
            { username }
        </Text>
      </View>
      }

      {!username &&
      <View style={styles.usernamecontainer}>
        <Text style={styles.username}>
            Profile
        </Text>
      </View>
      }        

      <View style={styles.userinfocontainer}>
        <Text style={styles.userinfotext}>
            Email: { email }
        </Text>
      </View>
        
      <View style={styles.buttoncontainer}>
        <TouchableOpacity onPress={handleSignout} style={styles.button}>
          <Text style={styles.buttontext}>
              Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,      
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      backgroundColor: colors.background,
    },
    backgroundimage: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profilepicture: {
      width: screen.vh*0.15, 
      height: screen.vh*0.15, 
      borderRadius: screen.vh*0.15/ 2,
      overflow: "hidden",
    },
    usernamecontainer: {
      width: '90%',
      alignItems: 'center',
      borderBottomWidth: 4,
      borderColor: colors.gray,
    },
    username: {
      fontSize: 40,
      fontWeight: '600',
      color: colors.black,
    },
    userinfocontainer: {
      width: '90%',
      alignItems: 'center',
      paddingVertical: screen.vh*0.02
    },   
    userinfotext: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.black,
    }, 
    buttoncontainer: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: colors.white,
        width: '80%',
        borderRadius: 20,        
        elevation: 5,
        height: screen.vh*0.08,
        marginBottom: screen.vh*0.02,
    },
    buttontext: {
        fontSize: 20,
        fontWeight: 'bold', 
        color: colors.black,       
    },
});