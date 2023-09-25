import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Dimensions } from 'react-native';
import colors from './Colors';
import TodoModal from './TodoModal';

export default class TodoList extends React.Component {
    state = {
        showListVisible: false
    }

    toggleListModal() {
        if(this.state.showListVisible == true) {
            this.props.refreshPet();
        }
        this.setState({showListVisible: !this.state.showListVisible})
    }

    render() {
        const list = this.props.list

        const completedCount = list.todos.filter(todo => todo.completed).length;
        const remainingCount = list.todos.length - completedCount;

        return (
            <View>
                <Modal 
                animationType='slide'
                visible={this.state.showListVisible}
                onRequestClose={() => this.toggleListModal()}
                >
                    <TodoModal 
                    list={list} 
                    foodlist={this.props.foodlist}                     
                    closeModal={() => this.toggleListModal()} 
                    updateList={this.props.updateList}
                    updateFood={this.props.updateFood}
                    refreshPet={this.props.refreshPet}
                    getFood={this.props.getFood}
                    />
                </Modal>
                
                <TouchableOpacity onPress={() => this.toggleListModal()} style={[styles.listContainer, {backgroundColor: list.color}]}>
                    <Text style={styles.listTitle} numberOfLines={1}>
                        {list.name}
                    </Text>
        
                    <View style={styles.completionStatus}>
                        <View style={styles.countContainer}>
                            <Text style={styles.count}>{completedCount}</Text>
                            <Text style={styles.subtitle}>Completed</Text>
                        </View>
                        <View style={styles.countContainer}>
                            <Text style={styles.count}>{remainingCount}</Text>
                            <Text style={styles.subtitle}>Remaining</Text>
                        </View>                        
                    </View>
                </TouchableOpacity>
            </View>
        )
    }    
}

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 5,
        paddingHorizontal: 16,
        borderRadius: 6,
        // marginHorizontal: 12,
        alignItems: 'center',
        width: Dimensions.get('window').width*0.9,
        // marginBottom: 10,
        flexDirection: 'row',
    },
    listTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.white,
        // marginBottom: 18,
        // backgroundColor: 'yellow',
        width: '55%',
        // maxWidth: '60%',
    },
    completionStatus: {
        flex: 1,
        flexDirection: 'row',
        width: '45%',
        // backgroundColor: 'purple',
        justifyContent: 'flex-end',
    },
    countContainer: {
        alignItems: 'center',
        paddingRight: 10,
    },
    count: {
        fontSize: 48,
        fontWeight: '200',
        color: colors.white,        
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.white,
    }
})