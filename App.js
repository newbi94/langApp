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
import icons from './icons';



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
  position: absolute;
`;
//box-shadow가 입체감을 불어 넣는다.
//position: absolute는 모든 Card의 위치를 똑같이 위치시킨다.
//즉 겹치게 된다.

/* const Card = styled.View``;
const AnimatedCard = Animated.createAnimatedComponent(Card); 
이렇게 구성하면 아래 return 파트에서 태그 내에 Animated관련 자동완성기능이
작동하지 않는다. 저번엔 니꼬가 이게 좋다더니 이제와서 바꾸다니
*/

const Btn = styled.TouchableOpacity`
  margin: 0px 10px;
`;

const BtnContainer = styled.View`
  flex-direction: row;
  flex: 1;
`;

const CardContainer = styled.View`
  flex:3;
  justify-content: center;
  align-items: center;
`;


export default function App() {
  
  const scale = useRef(new Animated.Value(1)).current; 

  const position = useRef(new Animated.Value(0)).current;
  
  const rotation = position.interpolate({
    inputRange:[-250, 250],
    outputRange:["-15deg", "15deg"],
    extrapolate: "clamp"
  });
  const secondScale = position.interpolate({
    inputRange: [-300, 0 , 300],
    outputRange: [1, 0.7 , 1],
    extrapolate: "clamp",
  })

  const onPressIn = Animated.spring(scale, { 
      toValue: 0.95, 
      useNativeDriver: true 
  });
  const onPressOut = Animated.spring(scale, { 
    toValue: 1, 
    useNativeDriver: true 
  });
  const goCenter = Animated.spring(position, { 
    toValue: 0, 
    useNativeDriver: true,
  });
  const goLeft = Animated.spring(position, { 
    toValue: -500, 
    tension: 5, 
    useNativeDriver: true, 
    restDisplacementThreshold: 150,
    restSpeedThreshold: 1000,
  })
  const goRight = Animated.spring(position, { 
    toValue: 500, 
    tension: 5, 
    useNativeDriver: true,
    restDisplacementThreshold: 150, //남은 거리에 따라 애니메이션을 끝낸다.
    restSpeedThreshold: 1000, //남은 속도에 따라 애니메이션을 끝낸다.
  })
  //spring 애니메이션 특성상 애니메이션이 끝나기까지 시간이 꽤 걸린다.
  //육안으로 끝나 보여도 진동이 1~3초간 남아 있는데, 아래 onDismiss함수는
  //이 spring의 애니메이션이 완전히 끝나야 실행되기 때문에 카드를 넘기고
  //즉시 바로 또 넘길 수가 없는 것.
  //rest~Threshold 프로퍼티들은 그러한 것들을 속도나, 거리면에서 조정해준다.
  const closePress = () => goLeft.start(onDismiss);
  const checkPress = () => goRight.start(onDismiss);
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderMove: (_, {dx}) => {
        position.setValue(dx);
      },

      onPanResponderGrant: () => onPressIn.start(),

      onPanResponderRelease: (_, { dx }) => {
        if (dx < -250) {
          goLeft.start(onDismiss);
        } else if (dx > 250) {
          goRight.start(onDismiss);
        } else {
        Animated.parallel([ onPressOut, goCenter ]).start();
        }
      },
    })
  ).current;
  const [index, setIndex] = useState(0);

  const onDismiss = () => {
    setIndex((prev) => prev + 1);
    position.setValue(0);
    scale.setValue(1);
  }

    return (
      <Container>
        <CardContainer>
        <Card 
          style={{
            transform: [
              { scale: secondScale },
            ],
          }}
        >
          <Ionicons name={icons[index+1]} color="#192a56" size={98} />
        </Card>
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
          <Ionicons name={icons[index]} color="#192a56" size={98} />
        </Card>
        </CardContainer>
        <BtnContainer>
          <Btn onPress={closePress}>
            <Ionicons name="close-circle" color="white" size={58} />
          </Btn>
          <Btn onPress={checkPress}>
            <Ionicons name="checkmark-circle" color="white" size={58} />
          </Btn>
        </BtnContainer>
      </Container>
    );
  }

  