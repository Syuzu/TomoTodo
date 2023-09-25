import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    FlatList, 
    Modal, 
    ActivityIndicator, 
    ImageBackground, 
    Image, 
    Animated, 
    SafeAreaView, } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import TodoList from '../components/TodoList';
import AddListModal from '../components/AddListModal';
import InventoryModal from '../components/InventoryModal';
import Fire from '../components/Fire';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import colors from '../components/Colors';
import * as screen from '../components/ScreenSize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class HomeScreen extends React.Component {
    state = {
        addTodoVisible: false,
        showInventoryVisible: false,
        lists: [],
        user: {},
        loading: true,
        time: new Date(),
        pet: null,
        exp: null,
        url: 'not_empty',
        foodlist: null
    };

    randomIntFromInterval = (min, max) => { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    refreshPet = () => {
        const storage = getStorage();

        firebase.getPet(pet => {
            this.setState({pet: pet});
           
            if (pet.level == 0) {
                const reference = ref(storage, `pets/cat/0/0`)
    
                getDownloadURL(reference).then((x) => {
                    this.setState({url: x})
                })
            }

            if (pet.level > 0) {
                const rndInt = this.randomIntFromInterval(0, 9)                    
                const reference = ref(storage, `pets/cat/1/${rndInt}`)
                
                getDownloadURL(reference).then((x) => {
                    this.setState({url: x})
                })
            }
        });
    }

    raiseHunger = async () => {
        firebase = new Fire((error, user) => {
            if (error) {
                console.log(error)
                return;
            }         
        });

        firebase.getPet(pet => {      
            let petCopy = pet;
            petCopy.hunger -= 10;
            if(petCopy.hunger < 0) {
                petCopy.hunger = 0;
            }
            firebase.updatePet(petCopy);
            this.refreshPet();
        });        
    }

    async componentDidMount() {
        firebase = new Fire((error, user) => {
            if (error) {
                console.log(error)
                return;
            }

            firebase.getLists(lists => {
                this.setState({lists, user}, () => {
                    this.setState({loading: false});
                });
            });

            this.setState({user});            
            this.getFood();
        });

        await this.refreshPet();

        setInterval(this.raiseHunger, 30000);
        setInterval(this.refreshPet, 30000);
    }

    getFood() {
        firebase.getFood(foodlist => {
            this.setState({foodlist: foodlist});
        })
    }

    componentWillUnmount() {
        firebase.detach();
    }

    toggleAddTodoModal(){
        this.setState({ addTodoVisible: !this.state.addTodoVisible })
    };

    toggleInventoryModal(){
        this.setState({ showInventoryVisible: !this.state.showInventoryVisible })
    };

    renderList = list => {
        const taskID = list.id;
        return (
            <GestureHandlerRootView style={styles.taskCard}>
                <Swipeable renderRightActions={(_, dragX) => this.rightActions(dragX, taskID)}>
                    <TodoList 
                    list={list} 
                    foodlist={this.state.foodlist} 
                    updateList={this.updateList} 
                    updateFood={this.updateFood}
                    refreshPet={this.refreshPet}
                    getFood={this.getFood}
                    />
                </Swipeable>                
            </GestureHandlerRootView>            
        )       
    };

    rightActions = (dragX, taskID) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0.9],
            extrapolate: 'clamp'
        })

        const opacity = dragX.interpolate({
            inputRange: [-100, -20, 0],
            outputRange: [1, 0.9, 0],
            extrapolate: 'clamp'
        })

        return (
            <View style={styles.sliderContainer}>
                <TouchableOpacity onPress={() => this.deleteList(taskID)}>
                    <Animated.View style={[styles.sliderButton, {opacity: opacity}]}>
                        <Animated.Text style={[styles.sliderButtonText, {transform: [{scale}]}]}>
                            Delete
                        </Animated.Text>
                    </Animated.View>
                </TouchableOpacity>
            </View>            
        )
    }

    deleteList = id => {
        firebase.deleteList({id});
        
        this.updateList;
    }

    addList = list => {
        firebase.addList({
            name: list.name,
            color: list.color,
            todos: []
        });
    };

    updateList = list => {
        firebase.updateList(list);
    };

    updateFood = list => {
        firebase.updateFood(list);
    }

    refresh = () => {}
    
    render(){
        if (this.state.loading) {
            return (
                <SafeAreaView style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color={colors.blue} />                    
                </SafeAreaView>
            );
        }

        if (!this.state.loading) {
            return(
                <SafeAreaView style={styles.container}>
                    <Modal 
                    animationType='slide' 
                    visible={this.state.addTodoVisible} 
                    onRequestClose={() => this.toggleAddTodoModal()}>
                        <AddListModal 
                        closeModal={() => this.toggleAddTodoModal()} 
                        addList={this.addList}  
                        />
                    </Modal>

                    <Modal 
                    animationType='slide'
                    visible={this.state.showInventoryVisible}
                    onRequestClose={() => this.toggleInventoryModal()}
                    >
                        <InventoryModal 
                        list={this.state.foodlist} 
                        closeModal={() => this.toggleInventoryModal()} 
                        updateFood={this.updateFood}
                        refreshPet={this.refreshPet}
                        />
                    </Modal>
    
                    <View style={styles.labelcontainer}>
                        <Text 
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}
                        style={styles.title}>
                            {this.state.time.toDateString()}                         
                        </Text>

                        <Text 
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}
                        style={styles.level}>
                            Lvl. {this.state.pet?.level}
                        </Text>
                    </View>
    
                    <View style={{alignItems: 'center'}}>
                        <View style={styles.petContainer}>
                            <ImageBackground 
                            source={require('../assets/pet/background.jpg')} 
                            resizeMode="cover" 
                            style={styles.backgroundimage}
                            imageStyle={{borderRadius: 40}}>     
                            <TouchableOpacity onPress={this.refreshPet} style={styles.petImage}>
                                <Image source={{uri:this.state.url}} style={{width:'100%', height: '100%'}}/>
                            </TouchableOpacity>                                           
                            </ImageBackground>
                        </View>
                        <View style={{flexDirection: 'row', paddingHorizontal: screen.vw*0.05}}>
                            <View style={styles.petbarcontainer}>
                                <View style={styles.expbar}>
                                    <View style={[styles.exp, {width: (screen.vw*0.75)/100*this.state.pet.exp,}]}></View>
                                </View>
                                <View style={styles.hungerbar}>
                                    <View style={[styles.hunger, {width: (screen.vw*0.75)/100*this.state.pet.hunger,}]}></View>
                                </View>
                            </View>
                            <View style={styles.feedContainer}>
                                <TouchableOpacity onPress={() => this.toggleInventoryModal()} style={styles.addButton}>
                                    <MaterialCommunityIcons name='food' size={30} color={colors.blue} />
                                </TouchableOpacity>
                            </View>   
                        </View>
                    </View>
    
                    <View style={styles.taskTitleContainer}>
                        <Text style={styles.title}>
                            Tasks                       
                        </Text>
                        <View style={styles.addContainer}>
                            <TouchableOpacity onPress={() => this.toggleAddTodoModal()} style={styles.addButton}>
                                <AntDesign name='plus' size={30} color={colors.blue} />
                            </TouchableOpacity>
                        </View>                    
                    </View>
    
                    <View style={styles.taskContainer}>
                        <FlatList 
                            data={this.state.lists} 
                            keyExtractor={item => item.id.toString()} 
                            showsVerticalScrollIndicator={false}
                            renderItem={({item, index}) => this.renderList(item, index)}
                            keyboardShouldPersistTaps='always'
                        />
                    </View>
                </SafeAreaView>
            );
        }        
    }
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    labelcontainer: {
        height: screen.vh*0.075,       
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'lightgreen'
    },
    title: {
        fontSize: 27,
        fontWeight: '800',
        color: colors.black,
        paddingHorizontal: screen.vw*0.05,
        width: screen.vw*0.75,
        elevation: 10,
        // backgroundColor: 'lightblue'
    },
    level: {        
        fontSize: 20,
        fontWeight: '800',
        color: colors.black,
        paddingHorizontal: screen.vw*0.05,
        width: screen.vw*0.25,
    },
    petContainer: {
        width: screen.vw*0.9,
        height: screen.vw*0.9,
        // backgroundColor: 'lightblue',
    },
    backgroundimage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    petImage: {
        width: '40%',
        height: '40%',
        // position: 'absolute',
        top: '50%', 
        left: '30%',
    },
    petbarcontainer: {
        // backgroundColor: 'red',
        width: screen.vw*0.75,
    },
    expbar: {
        width: '100%',
        height: screen.vh*0.025,
        marginTop: 5,
        borderWidth: 1,
        borderColor: colors.blue,
        borderRadius: 20,
        // backgroundColor: 'lightgreen',
    },
    exp: {
        height: '100%',
        borderRadius: 20,
        backgroundColor: colors.blue
    },
    hungerbar: {
        width: '100%',
        height: screen.vh*0.025,
        marginTop: 5,
        borderWidth: 1,
        borderColor: 'lightgreen',
        borderRadius: 20,
        // backgroundColor: 'lightgreen',
    },
    hunger: {
        height: '100%',
        borderRadius: 20,
        backgroundColor: 'lightgreen'
    },
    feedContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    taskTitleContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        // backgroundColor:'lightblue',
    },    
    addContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: screen.vw*0.05,
        // backgroundColor: 'yellow'
    },
    addButton: {
        borderWidth: 2,
        borderColor: colors.blue,
        borderRadius: 10,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    taskContainer: {
        alignItems: 'center',
        height: screen.vh*0.235,
        // backgroundColor: 'lightgreen'
    },
    taskCard: {
        // paddingTop: screen.vh*0.01,
        paddingBottom: screen.vh*0.01,
    },
    sliderContainer: {
        flexDirection: 'row',
    },    
    sliderButton: {
        flex: 1,
        backgroundColor: colors.red,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
    },
    sliderButtonText: {
        color: colors.white, 
        fontWeight: '800'
    },
})