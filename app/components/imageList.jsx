import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ImageItem from './imageItem';

const ImageList = ({ images, onImagePress }) => {
  if (images.length === 0) {
    return <Text style={styles.placeholderText}>No images captured yet</Text>;
  }

  return (
    <FlatList
      data={images}
      renderItem={({ item }) => <ImageItem image={item} onPress={onImagePress} />}
      keyExtractor={(item) => item.timestamp}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 10,
  },
  placeholderText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
  },
});

export default ImageList;
