/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {SegmentedControls} from 'react-native-radio-buttons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const MAIN = '#B7CDBC';
const MAIN2 = '#52796F';
const MAINDARK = '#717F74';

export default function AddSection({addTodo, buttonHandler, todoAdd, theme}) {
  const [input, setInput] = useState('');
  const [pri, setPri] = useState('Normal');
  const todoInput = useRef();

  const Priority = ['High', 'Normal', 'low'];

  const secBottom = useSharedValue(-400);

  const rStyle = useAnimatedStyle(() => {
    return {
      bottom: withSpring(secBottom.value, {
        damping: 90,
        overshootClamping: true,
        restDisplacementThreshold: 0.1,
        restSpeedThreshold: 0.1,
        stiffness: 700,
      }),
    };
  });

  useEffect(() => {
    addTodo ? (secBottom.value = 0) : (secBottom.value = -400);
  }, [addTodo, secBottom]);

  function addHandeler() {
    if (!input == '') {
      todoAdd(input, pri);
      buttonHandler();
      setInput('');
      setPri('Normal');
      secBottom.value = withSpring(-400);
    } else {
      todoInput.current.focus();
    }
  }

  return (
    <Animated.View
      style={[
        styles.addTodo,
        rStyle,
        theme && {backgroundColor: '#203031'},
        //addTodo && {bottom: 0},
      ]}>
      <View style={{alignItems: 'flex-end'}}>
        <Icon
          name="close"
          color={MAINDARK}
          style={{alignItems: 'flex-end'}}
          onPress={() => buttonHandler()}
          style={[
            {fontSize: 30, marginBottom: 5},
            theme ? {color: MAIN} : {color: MAIN2},
          ]}
        />
      </View>

      <View style={{height: '90%', justifyContent: 'space-between'}}>
        <TextInput
          placeholder="write your task"
          style={[
            styles.input,
            theme ? {borderColor: MAIN} : {borderColor: MAIN2},
          ]}
          value={input}
          onChangeText={val => setInput(val)}
          ref={todoInput}
          placeholderTextColor={theme ? MAIN : MAIN2}
        />

        <View>
          <Text
            style={[
              {
                marginVertical: 10,
                fontWeight: 'bold',
              },
              theme ? {color: MAIN} : {color: MAIN2},
            ]}>
            Priority:
          </Text>
          <SegmentedControls
            tint={theme ? MAIN : MAIN2}
            selectedTint={theme ? '#203031' : '#fff'}
            backTint={theme ? '#203031' : '#fff'}
            options={Priority}
            selectedOption={pri}
            allowFontScaling={false} // default: true
            onSelection={val => setPri(val)}
            optionStyle={{padding: 7}}
            optionContainerStyle={{flex: 1}}
          />
        </View>

        <TouchableOpacity onPress={() => addHandeler()}>
          <Text style={styles.button}>Add</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  addTodo: {
    backgroundColor: '#fff',
    height: 300,
    width: '100%',
    position: 'absolute',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    padding: 20,
    zIndex: 30,
    //bottom: -400,
  },
  input: {
    width: '100%',
    fontSize: 20,
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    color: MAINDARK,
    fontFamily: 'Shabnam',
  },
  pItems: {
    backgroundColor: MAIN,
    fontSize: 15,
    margin: 6,
    padding: 10,
    borderRadius: 5,
    color: '#fff',
  },
  button: {
    width: '100%',
    backgroundColor: MAIN2,
    padding: 20,
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 10,
  },
});
