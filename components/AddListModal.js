import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    KeyboardAvoidingView, 
    TouchableOpacity, 
    TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from './Colors';

export default class AddListModal extends React.Component{
    backgroundColors = ['#5CD859', '#24A6D9', '#595BD9', '#8022D9', '#D159D8', '#D85963', '#D88559'];

    state = {
        name: '',
        color: this.backgroundColors[0],
    }

    createTodo = () => {
        const {name, color} = this.state

        const list = {name, color};

        this.props.addList(list);

        this.setState({name: ''})
        this.props.closeModal()
    }

    renderColors(){
        return this.backgroundColors.map(color => {
            return(
                <TouchableOpacity
                    key={color} 
                    style={[styles.colorSelect, {backgroundColor: color}]}
                    onPress={() => this.setState({color})} 
                />
            );
        });
    }

    render(){
        return(
            <KeyboardAvoidingView style={styles.container} behavior='paddings'>
                <TouchableOpacity onPress={this.props.closeModal} style={{position: 'absolute', top: 34, right: 32}}>
                    <AntDesign name='close' size={24} color={colors.black} />
                </TouchableOpacity>

                <View style={{alignSelf: 'stretch', marginHorizontal: 32}}>
                    <Text style={styles.title}>
                        Create Task List
                    </Text>
                    <TextInput 
                    style={[styles.input, {borderColor: this.state.color}]} 
                    placeholder='List Name' 
                    onChangeText={text => this.setState({name: text})}
                    />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 12}}>
                        {this.renderColors()}
                    </View>
                    <TouchableOpacity onPress={this.createTodo} style={[styles.create, {backgroundColor: this.state.color}]}>
                        <Text style={{color: colors.white, fontWeight: '600'}}>
                            Create
                        </Text>
                    </TouchableOpacity>
                </View>
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
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.black,
        alignSelf: 'center',
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderRadius: 6,
        height: 50,
        marginTop: 8,
        paddingHorizontal: 16,
        fontSize: 18,
    },
    create: {
        marginTop: 24,
        height: 50,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colorSelect: {
        width: 30,
        height: 30,
        borderRadius: 4,
    },
})