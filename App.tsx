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
  Image,
  Button
} from 'react-native';

import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';

const App = () => {
  const [location, setLocation] = useState({ latitude: -1, longitude: -1 });
  const [mapPadding, setMapPadding] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "24 hours", value: 24 },
    { label: "48 hours", value: 48 },
    { label: "Week", value: 168 },
    { label: "Don't Show Any", value: -1 }
  ]);

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
        <TouchableOpacity activeOpacity={0.87} style={styles.filterButton} onPress={() => setShowFilters(true)}>
          <Icon name='filter' size={25} color='rgba(90, 90, 90, 1.0)' />
        </TouchableOpacity>
      </View>

      <View style={styles.spotView}>
        <TouchableOpacity activeOpacity={0.8} style={styles.spotButton}>
          <Image source={require('./assets/Goospotter-logo.png')} style={{ width: 70, height: 70 }} />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, height: 10 }}>
        <Modal isVisible={showFilters} animationIn="fadeIn" animationOut="fadeOut" backdropOpacity={0.6} backdropTransitionOutTiming={0} onBackdropPress={() => setShowFilters(false)}>
          <View style={{ flex: 0.4, backgroundColor: 'white', padding: 10 }}>
            <Text style={{ marginLeft: '2.5%', fontSize: 20, marginBottom: 10 }}>Show Spottings in the Past:</Text>
            <DropDownPicker
              style={{ width: '90%', marginHorizontal: '5%' }}
              dropDownContainerStyle={{ width: '90%', marginHorizontal: '5%' }}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
            />

            <TouchableOpacity style={styles.OkButton} onPress={() => setShowFilters(false)}>
              <Text style={{ fontSize: 25 }}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
  },
  filterButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 39,
    width: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  OkButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    width: 100,
    height: 50,
    borderRadius: 10,
    marginTop: '35%',
    marginLeft: '35%'
  }
});

export default App;
