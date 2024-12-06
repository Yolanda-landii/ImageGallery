import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const ImageModal = ({ visible, image, onClose }) => (
  <Modal visible={visible} transparent={true} animationType="slide">
    <View style={styles.modalContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
      <Image source={{ uri: image?.uri }} style={styles.fullScreenImage} />
      <View style={styles.metadataContainer}>
        <Text style={styles.metadataText}>File Name: {image?.fileName}</Text>
        <Text style={styles.metadataText}>Timestamp: {image?.timestamp}</Text>
        <Text style={styles.metadataText}>Location: {image?.geolocation}</Text>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  fullScreenImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
  metadataContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  metadataText: {
    color: 'white',
    fontSize: 12,
    marginBottom: 4,
  },
});

export default ImageModal;
