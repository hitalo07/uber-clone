import React from 'react';
import MapViewDirections from 'react-native-maps-directions';

// import { Container } from './styles';

export default function Directions({ destination, origin, onReady }) {
  return (
    <MapViewDirections
      destination={destination}
      origin={origin}
      onReady={onReady}
      apikey="API key"
      strokeWidth={3}
      strokeColor="#222"
    />
  );
}
