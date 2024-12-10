import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { getImages, addImage, deleteImage } from './Utils/database';
import ImageList from '../components/imageList';
import ImageModal from '../components/imageModal';

const ImageCapture = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const route = useRouter();

  const loadImages = async () => {
    try {
      const imagesFromDb = await getImages();
      console.log('Images loaded from database:', imagesFromDb);
      setImages(imagesFromDb); 
      setFilteredImages(imagesFromDb); 
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const filterImages = (query) => {
    if (!query) {
      setFilteredImages(images);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();

    const filtered = images.filter((image) => {
      const { geolocation, timestamp } = image;
      const date = new Date(timestamp).toISOString().split('T')[0]; // Extract YYYY-MM-DD
      return (
        geolocation.toLowerCase().includes(lowerCaseQuery) || 
        timestamp.toLowerCase().includes(lowerCaseQuery) || 
        date.includes(lowerCaseQuery)
      );
    });

    setFilteredImages(filtered);
  };

  const captureImage = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const locationPermission = await Location.requestForegroundPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
  
      if (!cameraPermission.granted || !locationPermission.granted || !mediaLibraryPermission.granted) {
        Alert.alert('Permission required', 'All permissions are needed to capture and save images.');
        return;
      }
  
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
  
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const timestamp = new Date().toISOString();
        const location = await Location.getCurrentPositionAsync({});
        const fileName = uri.split('/').pop();
        const destinationPath = `${FileSystem.documentDirectory}${fileName}`;
  
        await FileSystem.moveAsync({ from: uri, to: destinationPath });
        await MediaLibrary.createAssetAsync(destinationPath);
  
        const newImage = {
          filePath: destinationPath,
          timestamp,
          geolocation: `${location.coords.latitude}, ${location.coords.longitude}`,
        };
  
        // Check if image already exists in the state
        setImages((prevImages) => {
          const updatedImages = [...prevImages];
          if (!updatedImages.some(image => image.filePath === newImage.filePath)) {
            updatedImages.push(newImage);
          }
          setFilteredImages(updatedImages); // Update filtered images too
          return updatedImages;
        });
  
        const imageId = await addImage(newImage.filePath, newImage.timestamp, newImage.geolocation);
        console.log('Image added to SQLite database with ID:', imageId);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      Alert.alert('Error', 'Something went wrong while capturing the image.');
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

  const handleDeleteImage = async (id) => {
    try {
      const changes = await deleteImage(id);
      if (changes > 0) {
        await loadImages();
        console.log(`Image with ID ${id} deleted.`);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      Alert.alert('Error', 'Failed to delete the image. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camera</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search by location, date, or metadata"
          value={searchQuery}
          onChangeText={(query) => {
            setSearchQuery(query);
            filterImages(query);
          }}
        />
      </View>
      <View style={styles.cameraContainer}>
        <ImageList images={filteredImages} onImagePress={openImage} />
      </View>
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => route.push('mapView', { images })}
        >
          <Text style={styles.mapButtonText}>View Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.captureButton} onPress={captureImage}>
          <View style={styles.captureInnerCircle} />
        </TouchableOpacity>
      </View>
      <ImageModal
        visible={isModalVisible}
        image={selectedImage}
        onClose={closeModal}
        onDelete={(id) => {
          handleDeleteImage(id);
          closeModal();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: 'white' },
  searchContainer: { padding: 16, backgroundColor: 'white', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    borderRadius: 5,
  },
  cameraContainer: { flex: 1, padding: 16 },
  bottomBar: { alignItems: 'center', marginBottom: 40 },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -30,
  },
  captureInnerCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'black' },
  mapButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 10,
    marginRight: 220,
    marginBottom: -60,
  },
  mapButtonText: { color: 'white', fontWeight: 'bold' },
});

export default ImageCapture;
