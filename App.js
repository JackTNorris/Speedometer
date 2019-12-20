/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {PermissionsAndroid} from 'react-native';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Component,
  Button,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Grant Location',
        message: 'Location data needed for app',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the location');
      return true;
    } else {
      return false;
      console.log('Location permission denied');
    }
  } catch (err) {
    return false;
    console.warn(err);
  }
}
export default class App extends React.Component {
  state = {
    loading: false,
    updatesEnabled: false,
    speed: 0,
    location: {},
  };

  getLocUpdate = async () => {
    const hasLocationPermission = await requestLocationPermission();

    if (!hasLocationPermission) return;

    this.setState({updatesEnabled: true}, () => {
      this.watchId = Geolocation.watchPosition(
        position => {
          this.setState({location: position});
          this.setState({speed: position.coords.speed});
          //console.log(position);
          console.log(position.coords.speed);
        },
        error => {
          this.setState({location: error});
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 1000,
          fastestInterval: 500,
        },
      );
    });
  };

  stopUpdates = () => {
    this.setState({updatesEnabled: false});
    Geolocation.clearWatch(this.watchId);
    this.setState({updatesEnabled: false});
    console.log('stoppped updates');
  };

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 30, borderBottomWidth: 2}}>
            Speedometer Testing
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>MPH</Text>
          <Text style={{fontSize: 70}}>
            {Math.round(parseInt(this.state.speed) * 2.237)}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
            marginBottom: 20,
          }}>
          <Button title="Measure Speed" onPress={this.getLocUpdate} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
