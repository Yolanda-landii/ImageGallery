import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';

const MapScreen = () => {
  const { images } = useLocalSearchParams(); 
  const router = useRouter();

  const parsedImages = images ? JSON.parse(images) : []; 

  return (
    <View style={styles.container}>
     
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -30.5595,
          longitude: 22.9375,
          latitudeDelta: 10.0,
          longitudeDelta: 10.0,
        }}
      >
        {parsedImages.map((image, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: image.latitude,
              longitude: image.longitude,
            }}
            title={`Image taken at ${image.timestamp}`}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
