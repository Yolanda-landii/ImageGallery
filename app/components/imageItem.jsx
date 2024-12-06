import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const ImageItem = ({ image, onPress }) => (
  <TouchableOpacity onPress={() => onPress(image)} style={styles.imageItem}>
    <Image source={{ uri: image.uri }} style={styles.thumbnail} />
    <View style={styles.metadata}>
      <Text style={styles.metadataText}>File Name: {image.fileName}</Text>
      <Text style={styles.metadataText}>Timestamp: {image.timestamp}</Text>
      <Text style={styles.metadataText}>Location: {image.geolocation}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  imageItem: {
    flexDirection: 'row',
    marginVertical: 10,
    backgroundColor: '#1c1c1e',
    padding: 10,
    borderRadius: 10,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  metadata: {
    flex: 1,
  },
  metadataText: {
    color: 'white',
    fontSize: 12,
    marginBottom: 4,
  },
});

export default ImageItem;
