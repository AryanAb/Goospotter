import React, { useState, useEffect, useRef } from 'react';
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
  const [mapPadding, setMapPadding] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [spotBg, setSpotBg] = useState('rgba(225, 225, 225, 0.7)');
  const [isSpotting, setIsSpotting] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "24 hours", value: 24 },
    { label: "48 hours", value: 48 },
    { label: "Week", value: 168 },
    { label: "Don't Show Any", value: -1 }
  ]);

  const mapView = useRef(null);

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
        mapView.current.animateToRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }, 0);
      },
      error => {
        console.error(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 5 }
    );

    // currently, react-native-maps needs a forced update to show the current position button
    setTimeout(() => setMapPadding(0), 500);
  }, []);

  function onSpot() {

    if (isSpotting) {
      {/* Exit spotting mode */ }
      setSpotBg('rgba(225, 225, 225, 0.7)');

      Geolocation.getCurrentPosition(
        position => {
          mapView.current.animateToRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          });
        },
        error => {
          console.error(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 5 }
      );
    } else {
      {/* Enter spotting mode */ }
      setSpotBg('rgba(245, 40, 60, 0.7)');

      Geolocation.getCurrentPosition(
        position => {
          mapView.current.animateToRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.008,
            longitudeDelta: 0.0051,
          });
        },
        error => {
          console.error(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 5 }
      );
    }

    setIsSpotting(!isSpotting)
  }

  return (
    <View style={{ flex: 1, paddingTop: mapPadding }}>
      <StatusBar />
      <MapView
        ref={mapView}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        mapType='hybrid'
        showsUserLocation
        showsMyLocationButton
        scrollEnabled={!isSpotting}
        zoomEnabled={!isSpotting}
        initialRegion={{
          latitude: 0,
          longitude: 0,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
      </MapView>

      {/* The filter button */}
      <View style={styles.filterView}>
        <TouchableOpacity activeOpacity={0.87} style={styles.filterButton} onPress={() => setShowFilters(true)}>
          <Icon name='filter' size={25} color='rgba(90, 90, 90, 1.0)' />
        </TouchableOpacity>
      </View>

      {/* The spot goose button */}
      <View style={styles.spotView}>
        <TouchableOpacity activeOpacity={0.8} style={{ backgroundColor: spotBg, ...styles.spotButton }} onPress={onSpot}>
          <Image source={require('./assets/Goospotter-logo.png')} style={{ width: 70, height: 70 }} />
        </TouchableOpacity>
      </View>

      {/* The modal to show filters */}
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
    backgroundColor: 'rgba(80, 255, 90, 1.0)',
    width: 100,
    height: 50,
    borderRadius: 10,
    marginTop: '35%',
    marginLeft: '35%'
  }
});

export default App;
