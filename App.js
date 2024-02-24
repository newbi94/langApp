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
const IconCard = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  padding: 10px 20px;
  border-radius: 10px;
  z-index: 10;
  position: absolute;
`;

export default function App() {

  //Values
  const a = useRef(new Animated.ValueXY({
    x: 0, y: 0,})).current;
  const upperPosition = useRef(new Animated.ValueXY({
    x: 0, y: 330,})).current;
  const lowerPosition = useRef(new Animated.ValueXY({
    x: 0, y: -330,})).current;
  const scale = useRef(new Animated.Value(1)).current;
  const scaleOne = a.y.interpolate({
    inputRange: [-300, -80],
    outputRange: [2, 1],
    extrapolate: "clamp",
  });
  const scaleTwo = a.y.interpolate({
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
  const backHome = Animated.spring(a, {
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
    easing: Easing.linear,
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
  const goHome = Animated.timing(a, {
    toValue: 0,
    duration: 50,
    easing: Easing.linear,
    useNativeDriver: true,
  });

  //PanResponders
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      onPressIn.start();
    },
    onPanResponderMove: (evt,ges) => {
      a.setValue({
        x: ges.dx,
        y: ges.dy,
      })
      console.log('lowerPosition.x:', lowerPosition.x);
      console.log('lowerPosition.y:', lowerPosition.y);
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
};

const frontWord = 
  icons[index].substring(0,Math.round(icons[index].length/2))

const behindWord = 
icons[index].substring(Math.round(icons[index].length/2))


    return (
      <Container>
        <Edge>
          <WordContainer style={{transform:[{scale: scaleOne}]}}>
            <Word color={GREEN}>{frontWord}</Word>
          </WordContainer>
        </Edge>
        <Center>
          <IconCard
          {...panResponder.panHandlers}
          style={{
            opacity,
            transform: [
              ...a.getTranslateTransform(),
              {scale},
            ]
          }}
          >
            <Ionicons name={icons[index]} color={GREY} size={66} />
          </IconCard>
        </Center>
        <Edge>
          <WordContainer 
          
          style={{
            transform:[
              {translateX: lowerPosition.x},
              {translateY: 50},
              {scale: scaleTwo},
              ]}}>
            <Word color={RED}>{behindWord}</Word>
          </WordContainer>
        </Edge>
      </Container>
    );
  };
  //아래 동그라미의 translateY: -330으로 설정하면 (dy:-330이 중앙에서 아래 동그라미까지의 값이다)
  //중앙으로 오게된다. 영겁의 시간을 거쳐 -200으로 설정하니 알게됐다.
  //아래 동그라미의 영역은 Edge에 의해 화면의 5분의 1크기이다.
  //
  // 비슷하게 접근했는데, 조금 다른 것 같다..