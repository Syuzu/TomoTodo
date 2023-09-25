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
import colors from '../components/Colors';
import * as screen from '../components/ScreenSize';

const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = () => {
        auth.signInWithEmailAndPassword(email, password)
        .catch(error => alert(error.message))
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior='height'>
            <ImageBackground source={require('../assets/system/background.jpg')} resizeMode="cover" style={styles.backgroundimage}>
                <Image source={require('../assets/system/tomotodo.png')} resizeMode="center" style={styles.logo}/>
                <View style={styles.inputcontainer}>
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
                    <TouchableOpacity onPress={handleLogin} style={styles.button}>
                        <Text 
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}
                        style={styles.buttontext}>
                            Login
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

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
        marginTop: screen.vh*0.05,
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