import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Platform, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageList from '../components/imageList';
import ImageModal from '../components/imageModal';
import MapView, { Marker } from 'react-native-maps'; 

const ImageCapture = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const loadImages = async () => {
    try {
      const savedImages = await AsyncStorage.getItem('images');
      if (savedImages) {
        setImages(JSON.parse(savedImages));
      }
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const saveImages = async (newImages) => {
    try {
      await AsyncStorage.setItem('images', JSON.stringify(newImages));
    } catch (error) {
      console.error('Error saving images:', error);
    }
  };

  useEffect(() => {
    loadImages(); 
  }, []);

  const captureImage = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Web Camera', 'Use a web-specific method for capturing images.');
    } else {
      try {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        const locationPermission = await Location.requestForegroundPermissionsAsync();
        const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

        if (!cameraPermission.granted) {
          Alert.alert('Permission required', 'Camera permission is needed to capture images.');
          return;
        }

        if (!locationPermission.granted) {
          Alert.alert('Permission required', 'Location permission is needed to save geolocation data.');
          return;
        }

        if (!mediaLibraryPermission.granted) {
          Alert.alert('Permission required', 'Media library permission is needed to save the image to gallery.');
          return;
        }

        const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
        if (!result.canceled) {
          const uri = result.assets[0].uri;
          const timestamp = new Date().toISOString();
          const location = await Location.getCurrentPositionAsync({});
          const geolocation = `${location.coords.latitude}, ${location.coords.longitude}`;
          const fileName = uri.split('/').pop();
          const destinationPath = `${FileSystem.documentDirectory}${fileName}`;

          await FileSystem.moveAsync({ from: uri, to: destinationPath });

          await MediaLibrary.createAssetAsync(destinationPath);

          const newImage = {
            uri: destinationPath,
            timestamp,
            geolocation,
            fileName,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,  
          };

          const updatedImages = [...images, newImage];
          setImages(updatedImages); 
          saveImages(updatedImages); 

          Alert.alert('Success', `Image saved to: ${destinationPath}`);
        }
      } catch (error) {
        console.error('Error capturing image:', error);
        Alert.alert('Error', 'Something went wrong while capturing the image.');
      }
    }
  };

  const openImage = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camera</Text>
      
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -30.5595, 
            longitude: 22.9375, 
            latitudeDelta: 10.0,  
            longitudeDelta: 10.0, 
          }}
        >
          {images.map((image, index) => (
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

      <View style={styles.cameraContainer}>
        <ImageList images={images} onImagePress={openImage} />
      </View>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.captureButton} onPress={captureImage}>
          <View style={styles.captureInnerCircle} />
        </TouchableOpacity>
      </View>
      <ImageModal visible={isModalVisible} image={selectedImage} onClose={closeModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: 'white' },
  cameraContainer: {
    flex: 1,
    padding: 16,
  },
  mapContainer: {
    flex: 2,  
  },
  map: {
    flex: 1,  
  },
  bottomBar: {
    alignItems: 'center',
    marginBottom: 40,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'black',
  },
});

export default ImageCapture;
