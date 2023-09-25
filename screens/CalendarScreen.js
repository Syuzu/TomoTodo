import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import Fire from '../components/Fire';
import colors from '../components/Colors';
import * as screen from '../components/ScreenSize';
import { useIsFocused } from '@react-navigation/native';

class CalendarScreen extends React.Component {
  state = {
    lists: [],
    user: {},
    tasks: {},
    loading: true,
    selectedDate: '',
  };

  componentDidUpdate(prevProps) {
    // Check that screen is newly focused
    if (this.props.isFocused && prevProps.isFocused !== this.props.isFocused) {
      this.setState({lists: []});
      this.fillEmptyDates();
      this.updateCalendar();
    }
  }

  formatDate = (date) => {
    const year = date.slice(6, 10);
    const month = date.slice(3, 5);
    const day = date.slice(0, 2);
    const d = year + '-' + month + '-' + day;

    return d;
  }

  fillEmptyDates() {
    let i = 0;
    const date = new Date();
    const time = date.getTime();

    while (i < 365) {
      // populate empty items for 1 year      
      const tmr = time + (86400000*i);
      const tmrDate = new Date(tmr).toLocaleDateString();

      const d = this.formatDate(tmrDate);
      this.state.tasks[d] = [];

      i++;
    }
  }

  updateCalendar() {   
    firebase = new Fire((error, user) => {
        if (error) {
            console.log(error)
            return;
        }

        firebase.getLists(lists => {
            this.setState({lists, user}, () => {
                let i = 0;

                while (i < this.state.lists.length) {
                    let j = 0;

                    while (j < this.state.lists[i].todos.length) {
                      if (this.state.lists[i].todos[j].completed == false) {
                        if (this.state.lists[i].todos[j].date) {
                        
                          if (this.state.lists[i].todos[j].date in this.state.tasks == false) {
                            // add new key to tasks dictionary                  
                            this.state.tasks[this.state.lists[i].todos[j].date] = [];                   
                          }        
  
                          // create task dictionary
                          let taskCopy = {
                            name: '', 
                            subname: '',
                            startTime: '',
                            endTime: '',
                            location: '',
                            notes: '',
                          }; //create a new copy
                          taskCopy.name = this.state.lists[i].name 
                          taskCopy.subname = this.state.lists[i].todos[j].title       
                          taskCopy.startTime = this.state.lists[i].todos[j].startTime   
                          taskCopy.endTime = this.state.lists[i].todos[j].endTime   
                          taskCopy.location = this.state.lists[i].todos[j].location 
                          taskCopy.notes = this.state.lists[i].todos[j].notes 
  
                          this.state.tasks[this.state.lists[i].todos[j].date].push(taskCopy);                          
                        }
                        if (!this.state.lists[i].todos[j].date) {
                            // console.log('date not available')
                        }
                      }
                      
                      j++;
                    }

                    i++;
                }

                // set selectedDate to today 
                const date = new Date();
                const d = date.toLocaleDateString();
                const t = this.formatDate(d);

                this.setState({selectedDate: t});

                // hide loading screen
                this.setState({loading: false});
            });
        });
    });
  }

  componentDidMount() {    
    this.fillEmptyDates();
    this.updateCalendar();
  }

  render() {
    if (this.state.loading) {
      return (
          <View style={styles.loadingContainer}>
              <ActivityIndicator size='large' color={colors.blue} />                    
          </View>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <Agenda
        selected={this.state.selectedDate}
        items={this.state.tasks}
        showClosingKnob={true}
        renderEmptyDate={() => {
          return (
          <View style={styles.empty}/>);
        }}
        renderItem={(item) => (
          <View style={styles.item}>              
            <Text style={styles.itemTitle}>{item.subname}</Text>
            <Text style={styles.itemSubtitle}>-{item.name}</Text>
            {item.startTime && <Text style={styles.itemSubtitle}>Start: {item.startTime}</Text>}
            {item.endTime && <Text style={styles.itemSubtitle}>End: {item.endTime}</Text>}
            {item.location && <Text style={styles.itemSubtitle}>Location: {item.location}</Text>}
            {item.notes && <Text style={styles.itemSubtitle}>Notes: {item.notes}</Text>}
          </View>
        )}
        />
      </SafeAreaView>
    );
  }
};

export default function(props) {
  const isFocused = useIsFocused();
  return <CalendarScreen {...props} isFocused={isFocused} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',    
  },
  container: { 
    width: '100%',
    height: screen.vh*0.9,
    backgroundColor: colors.background,
  },
  empty: {
    backgroundColor: colors.white,
    flex: 1,
    borderRadius: 5,
    marginRight: 10,
    marginTop: 17,
  },
  item: {
    backgroundColor: colors.white,
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  itemTitle: {
    color: colors.black,
    fontSize: 24,
    fontWeight: '400',
  },
  itemSubtitle: {
    color: colors.black,
    fontSize: 16,
  },
});