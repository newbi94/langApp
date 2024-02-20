import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { 
  Animated, 
  Dimensions, 
  Pressable,
  PanResponder,
} from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex:1;
  justify-content: center;
  align-items: center;
`;
const Box = styled.View`
  background-color: tomato;
  width: 200px;
  height: 200px;
`;

const AnimatedBox = Animated.createAnimatedComponent(Box)

export default function App() {
  
  const POSITION = useRef(
    new Animated.ValueXY({
      x: 0,
      y: 0,
    })
  ).current;
  
/*   const topLeft = Animated.timing(POSITION, {
    toValue: {
      x: -SCREEN_WIDTH / 2 + 100,
      y: -SCREEN_HEIGHT / 2 + 100,
    },
    useNativeDriver: false,
  });
  const bottomLeft = Animated.timing(POSITION, {
    toValue: {
      x: -SCREEN_WIDTH / 2 + 100,
      y: SCREEN_HEIGHT / 2 - 100,
    },
    useNativeDriver: false,
  });
  const bottomRight = Animated.timing(POSITION, {
    toValue: {
      x: SCREEN_WIDTH / 2 - 100,
      y: SCREEN_HEIGHT / 2 - 100,
    },
    useNativeDriver: false,
  });
  const topRight = Animated.timing(POSITION, {
    toValue: {
      x: SCREEN_WIDTH / 2 - 100,
      y: -SCREEN_HEIGHT / 2 + 100,
    },
    useNativeDriver: false,
  });
  
  const moveUp = () => {
    Animated.loop(
      Animated.sequence([bottomLeft, bottomRight, topRight, topLeft])
    ).start();
  } *///Animated.sequence([ ~ ]) array형태로 여러 애니메이션을 넣어 순서대로 실행시킨다.
  //Animated.loop( ~ ) 괄호 안의 애니메이션을 반복하여 실행한다.
  const borderRadius = POSITION.y.interpolate({
    inputRange: [-300, 300],
    outputRange: [100, 0],
  });
  const bgColor = POSITION.y.interpolate({
    inputRange: [-300, 300],
    outputRange: ["rgb(255, 99, 71)", "rgb(71, 166, 255)"],
  });
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, //터치 감지에 대한 함수, 드래그를 하려면 필수적인 시작부분이라 할 수 있다.
      onPanResponderMove:(_, { dx ,dy }) =>{
        POSITION.setValue({
          x: dx,
          y: dy,
        })//Animated.Value의 값은 직접 수정할 수 없고 setValue를 통해 수정한다.
        console.log(dx, dy)
      }
    })
  ).current;
  /* 모든(?) panResponder.create안에 담긴 함수들은 
  (evt, gestureState)를 argument로 갖는다. 참조: https://reactnative.dev/docs/panresponder
  PanResponder역시 드래그나 여러 동작에서 값이 변해도 re-rendering되지 않아야 하므로
  useRef( ~ )로 감싸준다.

  gestureState객체 내의 dx,dy의 값은 박스 클릭후 손을 떼지 않고 드래그한 거리를 나타낸다.
  그것으로 setValue를 통해 POSITION의 value값을 바꿔줌으로써 박스를 드래그로
  위치이동 시킬 수 있게 되었다. 
  */
  
    //backgroundcolor를 animate하는 것은 native-driver: true 일 때에는 
    //사용할 수 없다. 굳이 사용하고 싶다면 false로 두고 사용할 것.
    return (
      <Container>
          <AnimatedBox
          {...panResponder.panHandlers}
            style={{
              borderRadius,
              backgroundColor: bgColor,
              transform: [...POSITION.getTranslateTransform()],
            }}
          />
      </Container>
    );
  }
/*   getTranslateTransform() => 
  기존의 
  transform: [ 
            translateX: POSITION.x, 
            translateY: POSITION.y,
        ]    
  를 간소화 시킬수 있는 메소드다. */
  