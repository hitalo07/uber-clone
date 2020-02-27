import React, { useState, useEffect, useRef } from 'react';
import { View, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { getPixelSize } from '../../utils';

import Search from '../Search';
import Directions from '../Directions';
import Details from '../Details';

import markerImage from '../../../assets/marker.png';
import backImage from '../../../assets/back.png';

import {
  LocationBox,
  LocationText,
  LocationTimeBox,
  LocationTimeText,
  LocationTimeTextSmall,
  Back
} from './styles';

Geocoder.init('API key');

export default function Map() {
  const [region, setRegion] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);
  const [location, setLocation] = useState(null);

  let mapView = useRef();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        const response = await Geocoder.from({ latitude, longitude });
        const address = response.results[0].formatted_address;
        const location = address.substring(0, address.indexOf(','));

        setLocation(location);

        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0143,
          longitudeDelta: 0.0134
        })
      }, // success
      () => { }, // error
      {
        timeout: 2000,
        enableHighAccuracy: true,
        maximumAge: 1000
      }
    )
  }, []);

  useEffect(() => {
    fitCoordinates();
  }, [route]);

  function handleLocationSelected(data, { geometry }) {
    const { location: { lat: latitude, lng: longitude } } = geometry

    setDestination({
      latitude,
      longitude,
      title: data.structured_formatting.main_text,
    });
  }

  function fitCoordinates() {
    mapView.fitToCoordinates(route && route.coordinates, {
      edgePadding: {
        right: getPixelSize(50),
        left: getPixelSize(50),
        top: getPixelSize(50),
        bottom: getPixelSize(350)
      },
      animated: true
    })
  }

  function handleBack() {
    setDestination(null);
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={region}
        showsUserLocation
        loadingEnabled
        ref={el => mapView = el}
      >
        {destination && (
          <>
            <Directions
              origin={region}
              destination={destination}
              onReady={result => {
                setRoute({
                  duration: Math.floor(result.duration),
                  coordinates: result.coordinates
                });
              }}
            />
            <Marker
              coordinate={destination}
              anchor={{ x: 0, y: 0 }}
              image={markerImage}
            >
              <LocationBox>
                <LocationText>{destination.title}</LocationText>
              </LocationBox>
            </Marker>
            <Marker
              coordinate={region}
              anchor={{ x: 0, y: 0 }}
            >
              <LocationBox>
                <LocationTimeBox>
                  <LocationTimeText>{route && route.duration}</LocationTimeText>
                  <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                </LocationTimeBox>
                <LocationText>{location}</LocationText>
              </LocationBox>
            </Marker>
          </>
        )}
      </MapView>

      {destination ?
        (
          <>
            <Back onPress={() => handleBack()}>
              <Image source={backImage} />
            </Back>
            <Details />
          </>
        )
        :
        <Search onLocationSelected={handleLocationSelected} />
      }
    </View>
  );
}
