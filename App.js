import React, { useRef, useState } from 'react';
import { Animated, Easing, PanResponder, Text, View } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from "@expo/vector-icons";
import icons from "./icons"

const BLACK_COLOR = "#1e272e";
const GREY = "#485460";
const GREEN = "#2ecc71";
const RED = "#e74c3c";

const Container = styled.View`
  flex: 1;
  background-color: ${BLACK_COLOR};
`;
const Edge = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const WordContainer = styled(Animated.createAnimatedComponent(View))`
  width: 100px;
  height: 100px;
  justify-content: center;
  align-items: center;
  background-color: ${GREY};
  border-radius: 50px;
`;
const Word = styled.Text`
  font-size: 38px;
  font-weight: 500;
  color: ${(props) => props.color};
`;
const Center = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;
//z-index는 높을수록 상위 레이어에 표시된다. position absolute와 헷갈린다.
//스타일 속성 옆에 //를 달고 주석이 되는 듯하나, 에러가 뜬다..
//되질 말게 하던가
const IconCard = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  padding: 10px 20px;
  border-radius: 10px;
  z-index: 10;
  position: absolute;
`;



export default function App() {
  //Values
  const position = useRef(new Animated.ValueXY({
    x: 0, y: 0,})).current;
  const scale = useRef(new Animated.Value(1)).current;
  const scaleOne = position.y.interpolate({
    inputRange: [-300, -80],
    outputRange: [2, 1],
    extrapolate: "clamp",
  });
  const scaleTwo = position.y.interpolate({
    inputRange: [80, 300],
    outputRange: [1, 2],
    extrapolate: "clamp",
  });
  const opacity = useRef(new Animated.Value(1)).current;

  //Animations
  const onPressIn = Animated.spring(scale, {
    toValue: 0.9,
    useNativeDriver: true,
  });   
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver:true,
  });
  const backHome = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });
  const drop = Animated.timing(scale, {
    toValue: 0,
    duration: 50,
    easing: Easing.linear,
    useNativeDriver: true,
  });
  const beOpacity = Animated.timing(opacity, {
    toValue: 0,
    duration: 50,
    easing: Easing.linear, //투명해지는 속도가 일정하게
    useNativeDriver: true,
  });
  const rePop = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });

  const unOpacity = Animated.spring(opacity, {
    toValue: 1,
    useNativeDriver: true,
  });
  const goHome = Animated.timing(position, {
    toValue: 0,
    duration: 50,
    easing: Easing.linear,
    useNativeDriver: true,
  });

  //spring으로 하면 빠른 복귀도 어려울 뿐더러, 끝에 가서 미세한 진동으로
  //동작 완료가 지연되어 다음 동작이 느려진다.

  //PanResponders
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      onPressIn.start();
    },
    onPanResponderMove: (_,{ dx, dy }) => {
      position.setValue({
        x: dx,
        y: dy,
      })
      console.log(dy)
    },
    onPanResponderRelease: (_, { dy }) => {
     if(dy > 250 || dy < -250) {
      Animated.sequence([
        Animated.parallel([
        drop, beOpacity
      ]),
      goHome,
    ]).start(nextIcon)
     } else {
      Animated.parallel([
        onPressOut,backHome,
      ]).start();
     }
    },
  })
  ).current
//States
const [index, setIndex] = useState(0);
const nextIcon = () => {
  setIndex((prev) => prev+1)
  Animated.parallel([
    rePop,unOpacity
  ]).start();
}
    return (
      <Container>
        <Edge>
          <WordContainer style={{transform:[{scale: scaleOne}]}}>
            <Word color={GREEN}>알아</Word>
          </WordContainer>
        </Edge>
        <Center>
          <IconCard
          {...panResponder.panHandlers}
          style={{
            opacity,
            transform: [
              ...position.getTranslateTransform(),
              {scale},
            ]
          }}
          >
            <Ionicons name={icons[index]} color={GREY} size={66} />
          </IconCard>
        </Center>
        <Edge>
          <WordContainer style={{transform:[{scale: scaleTwo}]}}>
            <Word color={RED}>몰라</Word>
          </WordContainer>
        </Edge>
      </Container>
    );
  };
  //transform: 내부에 postion~ 와 {scale}의 위치에 따라
  //애니메이션이 미세하게 달라지고 그에 따라 어색하거나 자연스럽게 보인다.
  //지금 {scale}이 position~보다 앞에 있으면, 카드가 작아지면서 중앙으로 돌아오는
  //모습이 찰나에 보인다. 때문에 상단과 하단부에서 사라지는 모습처럼 보이지 않는다.