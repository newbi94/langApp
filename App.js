import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { 
  View,
  Animated, 
  Dimensions,
  PanResponder,
} from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from "@expo/vector-icons";



const Container = styled.View`
  flex:1;
  justify-content: center;
  align-items: center;
  background-color: #00a8ff;
`;

const Card = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  width: 300px;
  height: 300px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
`;
//box-shadow가 입체감을 불어 넣는다.

/* const Card = styled.View``;
const AnimatedCard = Animated.createAnimatedComponent(Card); 
이렇게 구성하면 아래 return 파트에서 태그 내에 Animated관련 자동완성기능이
작동하지 않는다. 저번엔 니꼬가 이게 좋다더니 이제와서 바꾸다니
*/

export default function App() {
  const scale = useRef(new Animated.Value(1)).current; 
  //scale은 아래 <Card 내부에 style={{~ 에서 쓰이는 프로퍼티다. 프로퍼티 자체를 정의 해준 것.
  //때문에 Animated.Value(1)에서 1은 스케일의 기본 값을 뜻한다.
  const position = useRef(new Animated.Value(0)).current;
  //position에서의 Animated.Value(0) 0은 아래 translateX에 쓰여있으니 Card의 x좌표 위치 기본 값이 되겠다.
  const rotation = position.interpolate({
    inputRange:[-250, 250],
    outputRange:["-15deg", "15deg"],
    extrapolate: "clamp"
    // inputRange를 넘어서면 어떻게 할 것인지 설정하는 프로퍼티.
    //"clamp"는 input이 넘어서도 해당 outputRange 끝 값에서 멈춘다.
    //"extend"는 input과 output의 비율에 맞춰 계속해서 진행된다.
    //"identity"는 넘어서면 이상해진다(?).
  });
  const onPressIn = () => 
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  const onPressOut =
    Animated.spring(scale, { toValue: 1, useNativeDriver: true });
  const goCenter = 
    Animated.spring(position, { toValue: 0, useNativeDriver: true,});
  
  //onPressIn처럼 끝에 .start()를 붙이고 onPanResponderGrant: () => onPressIn(),
  //이런식으로 해도 되지만 onPressOut과 goCenter처럼 끝에 ()=> 와 .start()를 지우고 
  //release부분에서 Animated.parallel([onPressOut, goCenter]).start();
  //이렇게 불러 사용하는 방법도 있다.
  
  const panResponder = useRef(
    PanResponder.create({
    onStartShouldSetPanResponder: () => true,

    onPanResponderMove: (_, {dx}) => {
      position.setValue(dx);
    },

    onPanResponderGrant: () => onPressIn(),

    onPanResponderRelease: (_, { dx }) => {
      if (dx < -300) {
        Animated.spring(position, {
          toValue: -500,
          useNativeDriver: true,
        }).start();
      } else if (dx > 300) {
        Animated.spring(position, {
          toValue: 500,
          useNativeDriver: true,
        }).start();
      } else {
      Animated.parallel([ onPressOut, goCenter ]).start();
    }
    console.log(dx)
    },
  })
  ).current;
  //x좌표가 300 또는 -300을 넘어서면 toValue를 화면 이상의 값으로 설정해
  //날려버리는 애니메이션을 구현했다.
  //Animated.parallel을 통해 여러 애니메이션을 묶어서 실행한다.
    return (
      <Container>
        <Card 
          {...panResponder.panHandlers}
          style={{
            transform: [
              { scale },
              {translateX: position},
              {rotateZ: rotation},
            ],
          }}
        >
          <Ionicons name="pizza" color="#192a56" size={98} />
        </Card>
      </Container>
    );
  }
//rotateZ가 아니라 그냥 rotate라고 해도 똑같이 작동하는 것으로 보인다. 무슨 차이인지는 모르겠다.

  