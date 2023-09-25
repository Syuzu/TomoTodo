import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    SafeAreaView, 
    TouchableOpacity, 
    Image,
    FlatList, } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import colors from './Colors';
import * as screen from '../components/ScreenSize';
import Fire from './Fire';
import { useIsFocused } from '@react-navigation/native';

class TodoModal extends React.Component {
    state = {
    }

    componentDidMount() {
    }

    titleCase(string){
        return string[0].toUpperCase() + string.slice(1).toLowerCase();
    }

    feedPet = async (value) => {
        firebase = new Fire((error, user) => {
            if (error) {
                console.log(error)
                return;
            }         
        });

        firebase.getPet(pet => {      
            let petCopy = pet;
            petCopy.hunger += value;

            if(petCopy.hunger > 100) {
                petCopy.hunger = 100;
            }

            firebase.updatePet(petCopy);
        });        
    }

    delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    useItem = async (index) => {
        let list  = this.props.list;
        list.food[index].amount -= 1;

        await this.props.updateFood(list);
        await this.feedPet(list.food[index].value);  
        this.props.closeModal();
        alert(this.titleCase(list.food[index].name) + ' used \n +' + list.food[index].value + ' fullness')
        await this.delay(1000);
        await this.props.refreshPet();
    }

    renderFood = (item, index) => {
        return (
            <View style={styles.itemcard}>
                <View style={styles.itemimagecontainer}>
                    <Image resizeMode='contain' source={{uri:item.imageurl}} style={{width:'100%', height: '100%'}}/>
                </View>
                <View style={styles.iteminfocontainer}>
                    <Text style={styles.itemname}>
                        {this.titleCase(item.name)}
                    </Text>
                    <Text style={styles.itemdescription}>
                        {item.description}
                    </Text>
                </View>
                <View style={styles.itembuttoncontainer}>
                    <Text style={styles.itemcount}>
                        {item.amount}
                    </Text>
                    <View style={styles.useitembutton}>
                        {item.amount > 0 &&
                        <TouchableOpacity onPress={() => this.useItem(index)}>
                            <Text>Feed Pet</Text>
                        </TouchableOpacity>
                        }
                        {item.amount == 0 &&
                        <View>
                            <Text>Empty</Text>
                        </View>
                        }
                        
                    </View>
                </View>                                
            </View>
        )
    }

    render() {
        const list = this.props.list;

        return (
            <SafeAreaView style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <View style={[styles.section, styles.header, {borderBottomColor: list.color}]}>
                        <Text 
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}
                        style={styles.title}>
                            Inventory
                        </Text>
                    </View>

                    <TouchableOpacity onPress={this.props.closeModal} style={styles.closeModalIcon}>
                        <AntDesign name='close' size={30} color={colors.black} />
                    </TouchableOpacity>
                </View>  

                <View style={styles.itemcontainer}>
                    <FlatList 
                        data={list.food} 
                        renderItem={({item, index}) => this.renderFood(item, index)}
                        keyExtractor={item => item.name}
                        showsVerticalScrollIndicator={false} 
                    />
                </View>
            </SafeAreaView>
        );
    }
}

export default function(props) {
    const isFocused = useIsFocused();
    return <TodoModal {...props} isFocused={isFocused} />;
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: colors.background,
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    section: {
        alignSelf: 'stretch',
    },
    header: {
        width: screen.vw*0.8,
        height: screen.vh*0.075,
        marginLeft: screen.vw*0.05,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 25,
        fontWeight: '800',
        color: colors.black,
    },
    closeModalIcon: {
        width: screen.vw*0.1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    todoContainer: {
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 32,
    },
    todo: {
        color: colors.black,
        fontWeight: '700',
        fontSize: 16,
    },
    itemcontainer: {
        // backgroundColor: 'lightgreen',
        alignItems: 'center',
        height: screen.vh*0.9,
    },
    itemcard: {
        width: screen.vw*0.9,
        backgroundColor: 'lightblue',
        marginBottom: 10,
        height: screen.vh*0.15,
        flexDirection: 'row',
    },
    itemimagecontainer: {
        width: '25%',
    },
    iteminfocontainer: {
        width: '50%',
        paddingVertical: 5,
        paddingHorizontal: 10,
        // backgroundColor: 'purple',
    },
    itemname: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.black,
        // backgroundColor: 'lightgreen'
    },
    itemdescription: {},
    itembuttoncontainer: {
        width: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'red'
    },
    itemcount: {
        fontSize: 50,
        fontWeight: '400',
    },
    useitembutton: {
        width: '100%',
        height: screen.vh*0.03,
        // backgroundColor: 'lightgreen',
        alignItems: 'center',
        justifyContent: 'center'
    },
})