import React from 'react';
import { 
    ImageBackground, 
    TouchableOpacity, 
    StyleSheet, 
    Text, 
    View, 
    Image, 
    SafeAreaView, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../components/Colors';
import * as screen from '../components/ScreenSize';

const IntroScreen = () => {
    const navigation = useNavigation()
    
    return (
        <SafeAreaView style={styles.container}>            
            <ImageBackground source={require('../assets/system/background.jpg')} resizeMode="cover" style={styles.backgroundimage}>
                <Image source={require('../assets/system/tomotodo.png')} resizeMode='center' style={styles.logo} />
                <View style={styles.buttoncontainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.button}>
                        <Text 
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}
                        style={styles.buttontext}>
                            Login
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.button}>
                        <Text 
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}
                        style={styles.buttontext}>
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    )
}

export default IntroScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,      
    },
    backgroundimage: {
      flex: 1,
      alignItems: 'center',
    },
    logo: {
        width: '95%',
        height: '25%',
        backgroundColor: colors.purple,
        marginTop: screen.vh*0.25,
    },
    buttoncontainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: screen.vh*0.25,
    },
    button: {
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: colors.white,
        width: '80%',
        borderRadius: 50,        
        elevation: 5,
        height: screen.vh*0.075,
        marginBottom: screen.vh*0.025,
    },
    buttontext: {
        fontSize: 20,
        fontWeight: 'bold',      
        color: colors.black,    
    },
});