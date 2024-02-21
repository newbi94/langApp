import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { 
  Animated, 
  Dimensions,
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
      onStartShouldSetPanResponder: () => true, 
      onPanResponderGrant: () => { //터치가 시작될 때 호출되는 함수
        console.log("Touch Started");
        POSITION.setOffset({
          x: POSITION.x._value,
          y: POSITION.y._value,
        })
        console.log(POSITION.x._value,POSITION.y._value)
      },
        //x: POSITON.x라고 해주면 number가 아니라는 에러가 뜬다.
        //POSITON.x는 여러 함수가 포함된 Animated.Value를 받아오는 것.
        //setOffset은 아래 onPanResponderMove의 POSITION.setValue를 통한 드래그를 구현하는 과정 중
        //터치 오프후 다시 터치시 중앙(0의 위치)에서 시작되는 것을 방지하고 터치 오프할 때의 위치에서
        //계속해서 드래그를 진행하기 위해 사용하는 메소드이다.
        //onPanResponderMove의 dx,dy값은 말 그대로 터치후부터 터치오프까지의 '거리' 이기 때문에
        //터치 오프후 다시 터치를 하면 dx,dy값은 0부터 시작하여 POSITION.setValue를 통해 x와 y를 0으로 즉시 변경,
        //박스가 중앙으로 순간이동한후 드래그된다.
        //setOffset은 터치가 시작할 때 0부터 시작하지 않고 전의 좌표 값을 적용시켜 (전의 좌표 값) + (터치후 이동거리)
        //로 계산하여 이어서 드래그할 수 있게 해준다.
      
      onPanResponderMove:(_, { dx ,dy }) =>{ //터치 중일 때 호출되는 함수
        console.log("Finger Moving");
        POSITION.setValue({
          x: dx,
          y: dy,
        })
      },
      onPanResponderRelease: () => { //터치가 끝났을 때 호출되는 함수
        console.log("Touch Finished");
        POSITION.flattenOffset();
      }
      //flattenOffset() Offset의 값이 누적되는 것을 막기위한 메소드. 값을 0으로 비워준다.

      /*  onPanResponderRelease: () => {
        Animated.spring(POSITION,{
          toValue: {
            x:0,
            y:0,
          },
          bounciness: 20,
          useNativeDriver: false,
        }).start(); 
        드래그후 손을 뗐을 때 중앙으로 돌아가는 애니메이션
        */
    })
  ).current;
  
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

  