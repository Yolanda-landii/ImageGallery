import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const ImageModal = ({ visible, image, onClose, onDelete }) => {
  if (!image) return null;

  const fileName = image.filePath?.split('/').pop();

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
        <Image source={{ uri: image.filePath }} style={styles.fullScreenImage} />
        <View style={styles.metadataContainer}>
          <Text style={styles.metadataText}>File Name: {fileName}</Text>
          <Text style={styles.metadataText}>Timestamp: {image.timestamp}</Text>
          <Text style={styles.metadataText}>Location: {image.geolocation}</Text>
        </View>
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => onDelete(image.id)}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

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
  actionButtonsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ImageModal;
