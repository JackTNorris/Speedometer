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
    speedLimit: null,
  };

  componentDidMount() {
    setInterval(async () => {
      if (
        this.state.updatesEnabled &&
        this.state.location.coords.latitude &&
        this.state.location.coords.longitude
      ) {
        let lat = this.state.location.coords.latitude;
        let long = this.state.location.coords.longitude;
        console.log('Lat is ' + lat);
        console.log('Long is ' + long);
        if (lat && long) {
          let x = await this.getSpeedLimit(lat, long);
          this.setState({speedLimit: x});
          console.log('Set speed limit!');
        }
      }
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval();
    this.setState({updatesEnabled: false});
    Geolocation.clearWatch(this.watchId);
    this.setState({updatesEnabled: false});
    console.log('stoppped updates');
  }

  getSpeedLimit = async (lat, long) => {
    let speedLimit = 0;
    await fetch(
      `https://route.cit.api.here.com/routing/7.2/calculateroute.json?jsonAttributes=1&waypoint0=${lat},${long}&waypoint1=${lat},${long}&legattributes=li&linkattributes=nl,fc&mode=fastest;car;traffic:enabled&app_code=1SJYNrIZOz4yoN1HUbnxKA&app_id=HtPbLdxKKA5U2FiGbQ4H`,
    )
      .then(res => res.json())
      .then(response => {
        let data = response;
        //console.log('The speed limit data is : ' + JSON.stringify(response));
        speedLimit = data.response.route[0].leg[0].link[0].speedLimit * 2.237;
      });
    return speedLimit;
  };

  getLocUpdate = async () => {
    const hasLocationPermission = await requestLocationPermission();
    if (!hasLocationPermission) return;
    //let speedLimit = await this.getSpeedLimit();
    this.setState({updatesEnabled: true}, () => {
      this.watchId = Geolocation.watchPosition(
        position => {
          this.setState({location: position});
          this.setState({speed: position.coords.speed * 2.237});
          //this.setState({speedLimit: speedLimit});
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
    this.setState({speed: null, speedLimit: null});
    Geolocation.clearWatch(this.watchId);
    this.setState({updatesEnabled: false});
    console.log('stoppped updates');
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            borderWidth: 5,
            borderColor: 'black',
            margin: 10,
            borderRadius: 10,
          }}>
          <View
            style={{flexDirection: 'column', alignItems: 'center', flex: 1}}>
            <Text style={{fontSize: 35, fontFamily: 'Apple SD Gothic Neo'}}>
              YOUR
            </Text>
            <Text style={{fontSize: 35, fontFamily: 'Apple SD Gothic Neo'}}>
              SPEED
            </Text>
          </View>
          <View
            style={{
              flex: 2,
              backgroundColor: 'black',
              margin: 10,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 120, color: 'orange'}}>
              {this.state.speed ? Math.round(this.state.speed) : 'XX'}
            </Text>
          </View>
        </View>
        <View>
          <Button
            title="Measure Speed"
            onPress={this.getLocUpdate}
            disabled={this.state.updatesEnabled}
          />
          <Button
            title="Stop Measuring"
            onPress={this.stopUpdates}
            disabled={!this.state.updatesEnabled}
          />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            borderWidth: 5,
            borderColor: 'black',
            margin: 10,
            borderRadius: 10,
          }}>
          <View
            style={{flexDirection: 'column', alignItems: 'center', flex: 1}}>
            <Text style={{fontSize: 40, fontFamily: 'Apple SD Gothic Neo'}}>
              SPEED
            </Text>
            <Text style={{fontSize: 40, fontFamily: 'Apple SD Gothic Neo'}}>
              LIMIT
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 2,
            }}>
            <Text style={{fontSize: 120}}>
              {this.state.speedLimit ? Math.round(this.state.speedLimit) : 'XX'}
            </Text>
          </View>
        </View>
      </View>
    );
    /*
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
            {Math.round(parseInt(this.state.speed))}
          </Text>
          <Text>Speed Limit</Text>
          <Text>
            {this.state.speedLimit
              ? Math.round(this.state.speedLimit)
              : 'Speed Limit Data Not Available'}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
            marginBottom: 20,
          }}>
          <Button
            title="Measure Speed"
            onPress={this.getLocUpdate}
            disabled={this.state.updatesEnabled}
          />
          <Button
            title="Stop Measuring"
            onPress={this.stopUpdates}
            disabled={!this.state.updatesEnabled}
          />
        </View>
      </View>
    );*/
  }
}

const styles = StyleSheet.create({});
