import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    SafeAreaView, 
    TouchableOpacity, 
    Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import colors from './Colors';
import MapView, {Marker, Callout} from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as screen from '../components/ScreenSize';

export default class AddTaskModal extends React.Component {
    state = {
        // form input fields
        // task title
        title: '',
        // date
        date: new Date(),  
        mode: 'date',   
        showPicker: false,
        displayDate: '',
        taskDate: '',
        // time
        time: 'start',
        displayStartTime: '',
        startTime: null,
        displayEndTime: '',
        endTime: null,
        // notes
        notes: '',
        //location
        location: null,
        errorMsg: null,
        latitude: 0.0,
        longitude: 0.0,
        latitudeDelta: 0.0922, // zoom level
        longitudeDelta: 0.0421, // zoom level
        showMap: false,
        locationName: null,
        apiKey: 'Refer to report.pdf',
    }

    async componentDidMount() {
        console.log(this.props.task)
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            this.setState({errorMsg: 'Permission to access location was denied'});
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({location: location});

        this.setState({latitude: location.coords.latitude});
        this.setState({longitude: location.coords.longitude});

        this.setCurrentLocationName();
    }

    updateLatLng = (e) => {
        this.setState({latitude: e.nativeEvent.coordinate.latitude});
        this.setState({longitude: e.nativeEvent.coordinate.longitude});
    }

    reverseGeoLocation = () => {
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.latitude + ',' + this.state.longitude + '&key=' + this.state.apiKey)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({locationName: responseJson.results[0].formatted_address})
        })
    }

    setCurrentLocationName = () => {
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.latitude + ',' + this.state.longitude + '&key=' + this.state.apiKey)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({location: responseJson.results[0].formatted_address})
        })
    }

    updateLocation = async (e) => {
        await this.updateLatLng(e);
        
        this.reverseGeoLocation();
    }

    updateLocationPOI = (e) => {
        this.updateLatLng(e);
        this.setState({locationName: e.nativeEvent.name})
    }

    toggleMap = () => {
        let show = this.state.showMap
        this.setState({showMap: !show});
    }

    closeMap = () => {
        this.setState({locationName: null})

        this.toggleMap();
    }

    setLocation = () => {
        this.toggleMap();
    }

    render() {
        const list = this.props.list;
        const lat = this.state.latitude;
        const long = this.state.longitude;
        const task = this.props.task;

        return (
            <View style={{flex: 1}}>
                {this.state.showMap && (
                    <View style={{width: '100%', height: '100%', flex: 1}}>
                        <GooglePlacesAutocomplete
                            placeholder='Search'
                            fetchDetails={true}
                            GooglePlacesSearchQuery={{
                                rankby: 'distance'
                            }}
                            onPress={(data, details = null) => {
                                // 'details' is provided when fetchDetails = true
                                this.setState({latitude: details.geometry.location.lat})
                                this.setState({longitude: details.geometry.location.lng})
                                this.setState({locationName: data.description})
                            }}
                            query={{
                                key: 'AIzaSyCraHUaG3NmGMqYld4DehDXwCe4fOVeGeA',
                                language: 'en',
                                radius: 10000,
                                location: `${this.state.latitude}, ${this.state.longitude}`
                            }}
                            styles={{
                                container: {flex: 0, position: 'absolute', width: '100%', zIndex:1},
                                listView: {backgroundColor: 'white'}
                            }}
                        />
                        <MapView
                        onPress={e => this.updateLocation(e)}
                        onPoiClick={e => this.updateLocationPOI(e)}
                        style={styles.map}
                        region={{
                            latitude: lat,
                            longitude: long,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        provider='google'
                        >
                            <Marker
                            // draggable={true}
                            // onDragEnd={e => this.updateMarker(e)}
                            coordinate={{
                                latitude: task.latitude, 
                                longitude: task.longitude}}
                            >
                                <Callout>
                                    {!this.state.locationName && 
                                    <Text>
                                        {this.state.location}
                                    </Text>
                                    }
                                    {this.state.locationName && 
                                    <Text>
                                        {this.state.locationName}
                                    </Text>
                                    }                                    
                                </Callout>
                            </Marker>
                        </MapView>          

                        <View style={styles.mapFooter}>
                            <TouchableOpacity onPress={() => this.setLocation()} style={[styles.mapFooterButton, {backgroundColor: list.color}]}>
                                <AntDesign name='check' size={25} color={colors.white} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.closeMap()} style={[styles.mapFooterButton, {backgroundColor: list.color}]}>
                                <AntDesign name='close' size={25} color={colors.white} />
                            </TouchableOpacity>                            
                        </View>         
                    </View>
                )}
                
                {!this.state.showMap && (
                <SafeAreaView style={styles.container}>
                    <TouchableOpacity 
                    onPress={this.props.closeModal} 
                    style={{position: 'absolute', top: 34, right: 32, zIndex: 10}}
                    >
                        <AntDesign name='close' size={24} color={colors.black} />
                    </TouchableOpacity>

                    <View style={[styles.section, styles.header, {borderBottomColor: list.color}]}>
                        <View>
                            <Text style={styles.title}>
                                {task.title}
                            </Text>
                        </View>
                    </View>

                    {task.location &&
                    <View style={[styles.section, styles.footer]}>
                        <Text style={{color: colors.black}}>
                            Date: {task.date}
                        </Text>
                    </View>
                    }
                    
                    {task.startTime &&
                    <View style={[styles.section, styles.footer]}>
                        <Text style={{color: colors.black}}>
                            Start: {task.startTime}
                        </Text>
                    </View>
                    }

                    {task.endTime &&
                    <View style={[styles.section, styles.footer]}>
                        <Text style={{color: colors.black}}>
                            End: {task.endTime}
                        </Text>
                    </View>
                    }

                    {task.location &&
                    <TouchableOpacity onPress={() => this.toggleMap()} style={[styles.section, styles.footer]}>
                        <Text style={{color: colors.black}}>
                            Location: {task.location}
                        </Text>
                    </TouchableOpacity>
                    }

                    {task.notes &&
                    <TouchableOpacity onPress={() => this.toggleMap()} style={[styles.section, styles.footer]}>
                        <Text style={{color: colors.black}}>
                            Notes: {task.notes}
                        </Text>
                    </TouchableOpacity>
                    }
                </SafeAreaView>
                )}
            </View>
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
        alignSelf: 'stretch',
    },
    header: {
        justifyContent: 'flex-end',
        marginLeft: Dimensions.get('window').width*0.1,
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
    footer: {
        paddingHorizontal: 32,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    input: {
        // flex: 1,
        width: '100%',
        minHeight: 48,
        borderWidth: 1,
        borderRadius: 6,
        marginRight: 8,
        paddingHorizontal: 8,
        color: colors.black,
    },
    mapFooterButton: {
        borderRadius: 20,
        padding: 15,
        marginLeft: screen.vw*0.05,
        // alignItems: 'center',
        // justifyContent: 'center',
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
    deleteButton: {
        flex: 1,
        backgroundColor: colors.red,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
    },
    datePickerStyle: {
        width: 200,
        marginTop: 20,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    mapFooter: {
        // backgroundColor: 'red',
        position: 'absolute',
        bottom: screen.vh*0.1,
        zIndex: 1,
        width: '100%',
        // height: 20,
        flexDirection: 'row-reverse',
        paddingHorizontal: screen.vw*0.05,
        alignItems: 'center'
    },
})