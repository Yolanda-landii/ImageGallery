import React from 'react';
import { FlatList, StyleSheet, Text, View, Dimensions } from 'react-native';
import ImageItem from './imageItem';

const ImageList = ({ images, onImagePress }) => {
  const numColumns = 3; 
  const screenWidth = Dimensions.get('window').width; 
  const itemSize = Math.floor(screenWidth / numColumns) - 10; 

  if (images.length === 0) {
    return <Text style={styles.placeholderText}>No images captured yet</Text>;
  }

  return (
    <FlatList
      data={images}
      renderItem={({ item }) => (
        <View style={[styles.itemContainer, { width: itemSize, height: itemSize }]}>
          <ImageItem image={item} onPress={onImagePress} />
        </View>
      )}
      keyExtractor={(item) => item.timestamp}
      contentContainerStyle={styles.list}
      numColumns={numColumns}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 5, 
  },
  placeholderText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0, 
  },
});

export default ImageList;
