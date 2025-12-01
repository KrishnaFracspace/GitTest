import React, {useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Animated} from 'react-native';
// import * as Animatable from 'react-native-animatable';
const CustomModal = ({visible, onClose, children, modalStyle}) => {
    const modalContentRef = useRef(null);
    const [isVisible, setIsVisible] = useState(visible);
  useEffect(() => {
    // When the visible prop changes, trigger the appropriate animation
    if (visible) {
        setIsVisible(true);
    //   slideIn();
    } else {
      foldOut();
    }
  }, [visible]);
  useEffect(() => {
    // Slide in animation when the modal becomes visible
    if (isVisible) {
      slideIn();
    }
  }, [isVisible]);

  const slideIn = () => {
    // Slide in animation with 5-second duration
    if (isVisible && modalContentRef.current) {
        modalContentRef.current.slideInUp(700);
      }
  };

  const foldOut = () => {
    // Fold out animation with 5-second duration
    // this.modalContentRef.fadeOutDown(700);
    // Fold out animation with 5-second duration
    if (isVisible && modalContentRef.current) {
        modalContentRef.current.fadeOutDown(700).then(() => {
        //   onClose(); // Close the modal after the animation completes
        setIsVisible(false);
        });
      }
    
  };
  if (!isVisible) return null;

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.modalContainer]}
      onPress={onClose}>
      <Animated.View
        ref={modalContentRef}
        style={[styles.modalContent, modalStyle]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    width: '100%',
    overflow: 'hidden',
    height: '75%',
   // paddingHorizontal:20
  },
  modalContent: {
    // height: "100%",
    elevation: 5,
  },
});

export default CustomModal;