import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  Image
} from 'react-native';

import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const App = () => {
  const [location, setLocation] = useState({ latitude: -1, longitude: -1 });
  const [mapPadding, setMapPadding] = useState(1);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'ios') {
        // TODO: Add IOS permissions
      } else if (Platform.OS === 'android') {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      }
    }

    requestPermissions();

    Geolocation.getCurrentPosition(
      position => {
        //console.log(position);
        setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude, });
      },
      error => {
        console.error(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 5 }
    );

    // currently, react-native-maps needs a forced update to show the current position button
    setTimeout(() => setMapPadding(0), 500);
  }, []);

  return (
    <View style={{ flex: 1, paddingTop: mapPadding }}>
      <StatusBar />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        mapType='hybrid'
        showsUserLocation
        followsUserLocation
        showsMyLocationButton
        initialRegion={{
          ...location,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
      </MapView>

      <View style={styles.filterView}>
        <TouchableOpacity style={{ height: 39, width: 38, backgroundColor: 'rgba(0, 255, 0, 0.6)' }}>

        </TouchableOpacity>
      </View>

      <View style={styles.spotView}>
        <TouchableOpacity activeOpacity={0.8} style={styles.spotButton}>
          <Image source={require('./assets/Goospotter-logo.png')} style={{ width: 70, height: 70 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    height: '100%',
    width: '100%',
  },
  spotView: {
    position: 'absolute',
    top: '88%',
    alignSelf: 'center',
  },
  spotButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    height: 75,
    width: 75,
    borderRadius: 75,
    backgroundColor: 'rgba(225, 225, 225, 0.7)'
  },
  filterView: {
    position: 'absolute',
    top: '1.7%',
    right: '87.3%',
  }
});

export default App;
