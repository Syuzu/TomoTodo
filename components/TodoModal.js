import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Keyboard, Animated, Modal, Dimensions } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons'; 
import colors from './Colors';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import AddTaskModal from '../components/AddTaskModal';
import TaskInfoModal from '../components/TaskInfoModal';
import * as screen from '../components/ScreenSize';
import Fire from './Fire';

export default class TodoModal extends React.Component {
    state = {
        addTaskVisible: false,
        taskInfoVisible: false,
        newTodo: '',
        taskInfo: {},
    }

    toggleAddTaskModal(){
        this.setState({ addTaskVisible: !this.state.addTaskVisible })
    };

    toggleTaskInfoModal(){
        this.setState({ taskInfoVisible: !this.state.taskInfoVisible })
    };

    toggleTodoCompleted = index => {
        let list  = this.props.list;
        if(list.todos[index].completed == false) {
            this.growPet();
            this.rollItems();
        }
        list.todos[index].completed = !list.todos[index].completed;

        this.props.updateList(list);
    }

    rollItems = async () => {
        firebase = new Fire((error, user) => {
            if (error) {
                console.log(error)
                return;
            }         
        });

        let rewardMessage = 'Great job! You earned: ';

        firebase.getFood(foodlist => {      
            let foodlistCopy  = this.props.foodlist;

            const rollCount = Math.floor(Math.random() * (3 - 1 +1) + 1);

            for (let i = 0; i < rollCount; i++) {
                const rollItem = Math.floor(Math.random() * ((foodlistCopy.food.length-1) - 0 +1) + 0);
                const rollAmount = Math.floor(Math.random() * (2 - 1 +1) + 1);
                
                foodlistCopy.food[rollItem].amount += rollAmount;
                rewardMessage += `\n${rollAmount}x ${foodlistCopy.food[rollItem].name}`
            }

            this.props.updateFood(foodlistCopy);
            alert(rewardMessage);
        });        
    }

    growPet = async () => {
        firebase = new Fire((error, user) => {
            if (error) {
                console.log(error)
                return;
            }         
        });

        firebase.getPet(pet => {      
            let petCopy = pet;
            petCopy.exp += 60;

            if(petCopy.exp > 99) {
                petCopy.level += 1;
                petCopy.exp -= 100;
                alert('Congratulations! Your pet levelled up!')
            }

            firebase.updatePet(petCopy);
        });        
    }

    addTodo = () => {
        let list = this.props.list;

        if (!list.todos.some(todo => todo.title === this.state.newTodo)) {
            list.todos.push({title: this.state.newTodo, completed: false});

            this.props.updateList(list);
        }        
       
        this.setState({newTodo: ''});
        Keyboard.dismiss();
    };

    deleteTodo = index => {
        let list = this.props.list;
        list.todos.splice(index, 1);

        this.props.updateList(list);
    }

    passitem = (task) => {
        let taskCopy = {
            title: '', 
            date: '',
            startTime: '',
            endTime: '',
            notes: '',
            location: '',            
            latitude: 0.0,
            longtidue: 0.0,
            completed: false,
        };

        taskCopy.title = task.title 
        taskCopy.date = task.date 
        taskCopy.startTime = task.startTime 
        taskCopy.endTime = task.endTime 
        taskCopy.notes = task.notes 
        taskCopy.location = task.location 
        taskCopy.latitude = task.latitude 
        taskCopy.longtidue = task.longtidue 
        taskCopy.completed = task.completed

        this.setState({taskInfo: taskCopy});

        this.toggleTaskInfoModal();
    }

    renderTodo = (todo, index) => {
        return (
            <GestureHandlerRootView>
                <Swipeable renderRightActions={(_, dragX) => this.rightActions(dragX, index)}>
                    <View style={styles.todoContainer}>
                        <TouchableOpacity onPress={() => this.toggleTodoCompleted(index)}>
                            <Ionicons 
                            name={todo.completed ? 'ios-square' : 'ios-square-outline'}
                            size={24} 
                            color={colors.gray} 
                            style={{width: 32}} 
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.passitem(todo)}>
                            <Text style={[
                                styles.todo, 
                                {
                                    textDecorationLine: todo.completed ? 'line-through' : 'none',
                                    color: todo.completed ? colors.gray : colors.black
                                }
                                ]}>
                                {todo.title}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Swipeable>
            </GestureHandlerRootView>
        )
    }

    rightActions = (dragX, index) => {
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
            <TouchableOpacity onPress={() => this.deleteTodo(index)}>
                <Animated.View style={[styles.deleteButton, {opacity: opacity}]}>
                    <Animated.Text style={{color: colors.white, fontWeight: '800', transform: [{scale}]}}>
                        Delete
                    </Animated.Text>
                </Animated.View>
            </TouchableOpacity>
        )
    }

    componentDidMount() {
    }

    render() {
        const list = this.props.list;

        const taskCount = list.todos.length
        const completedCount = list.todos.filter(todo => todo.completed).length

        return (
            <KeyboardAvoidingView style={{flex: 1}} behavior='padding'>
                <Modal 
                animationType='slide' 
                visible={this.state.addTaskVisible} 
                onRequestClose={() => this.toggleAddTaskModal()}>
                    <AddTaskModal
                    list={list}  
                    closeModal={() => this.toggleAddTaskModal()} 
                    updateList={this.props.updateList}
                    />
                </Modal>

                <Modal 
                animationType='slide' 
                visible={this.state.taskInfoVisible} 
                onRequestClose={() => this.toggleTaskInfoModal()}>
                    <TaskInfoModal
                    list={list} 
                    task={this.state.taskInfo}  
                    closeModal={() => this.toggleTaskInfoModal()} 
                    />
                </Modal>
                
                <SafeAreaView style={styles.container}>
                    <View style={[styles.section, styles.header, {borderBottomColor: list.color}]}>
                        <View>
                            <Text style={styles.title}>
                                {list.name}
                            </Text>
                            <Text style={styles.taskCount}>
                                {completedCount} of {taskCount} tasks
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.section, {flex: 3, marginVertical: 16}]}>
                        <FlatList 
                        data={list.todos} 
                        renderItem={({item, index}) => this.renderTodo(item, index)}
                        keyExtractor={item => item.title}
                        showsVerticalScrollIndicator={false} 
                        />
                    </View>

                    <View style={[styles.section, styles.footer]}>
                        <TouchableOpacity 
                        onPress={() => this.toggleAddTaskModal()}
                        style={[styles.footerButton, {backgroundColor: list.color}]}>
                            <AntDesign name='plus' size={25} color={colors.white} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                        onPress={this.props.closeModal} 
                        style={[styles.footerButton, {backgroundColor: list.color}]}>
                            <AntDesign name='close' size={25} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    section: {
        // flex: 1,
        alignSelf: 'stretch',
    },
    header: {
        justifyContent: 'flex-end',
        marginLeft: screen.vw*0.1,
        borderBottomWidth: 3,
        paddingTop: 16,
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: colors.black,
    },
    taskCount: {
        marginTop: 4,
        marginBottom: 16,
        color: colors.gray,
        fontWeight: '600',
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
    footer: {
        paddingHorizontal: screen.vw*0.05,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingVertical: screen.vh*0.025,
        // backgroundColor: 'lightblue'
    },
    footerButton: {
        borderRadius: 20,
        padding: 15,
        marginLeft: screen.vw*0.05
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    deleteButton: {
        flex: 1,
        backgroundColor: colors.red,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
    },
})