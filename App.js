import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, TouchableOpacity, View } from 'react-native';
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

/* TouchableOpacity에 직접 animated하면 효과가 썩 좋지 않아 보인다.
그 이유는 opacity 즉, 불투명해지는 애니메이션도 수행해야 하기 때문이라고 한다.
때문에 우리는 styled.TouchableOpacity에서 View로 변경했다.
그리고 아래에서 View를 TouchableOpacity로 감싸주면 된다. */
//const Box = styled(Animated.createAnimatedComponent(TouchableOpacity))``;

export default function App() {
  const [up, setUp] = useState(false);
  const Y_POSITION = useRef(new Animated.Value(300)).current;
  const toggleUp =() => setUp((prev) => !prev);

  const moveUp = () => {
    Animated.timing(Y_POSITION, {
      toValue: up ? 300 : -300,
      useNativeDriver: true,
    }).start(toggleUp);
  }
  const opacity = Y_POSITION.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [1, 0.3 ,1],
  });
  const borderRadius = Y_POSITION.interpolate({
    inputRange: [-300, 300],
    outputRange: [100, 0],
  })
 /*  Animated.특정기능( value, toValue ).start() => 괄호 안의 값들은 필수다.
  easing: Easing.~ 을 통해 효과를 주는데 효과들이 다양해서 주로 사용된다. 
  자세한 것은 공식문서를 참조하자.
  useNativeDriver는 리액트가 brige를 통해 신호를 주고 받는 시스템을 거른다.
  네이티브 스레드에서 자체 처리됨으로 JavaScript 스레드의 부하가 줄어들고, 
  더 부드러운 애니메이션 효과를 얻을 수 있게 된다.
  결론적으로 useNativeDriver는 true로 설정하면 퍼포먼스가 향상된다.
  그리고 .start()를 빼먹으면 애니메이션 효과가 전혀 작동하지 않는다는 것을 명심하자.
  
  start( ~ ) 괄호 안에 들어가는 함수는 callback함수로서 동작을 수행한다.
  때문에 moveUp함수가 동작을 완료하면 괄호 안의 함수 toggleUp이 동작하게 된다.

  setState안에 함수를 넣으면 1개의 argument를 받을 수 있는데, 그 것은 바로 전의 state값이다.
  위 코드를 대입하여 설명하면, setUp에 함수를 넣으면 바로 직전 up의 state를 argument로 받는다.
  그 것을 이용해 setUp((prev) => !prev)해주면 클릭할 때마다 up의 state값을 
  false<->true 전환할 수 있게 된다.

  useState를 통해 up의 상태를 바꾸면 re-rendering이 일어나 new Animated.Value(0) 부분도
  다시 렌더링 됨으로 Y_POSITION이 -300에 박스가 멈추는 순간 다시 0의 위치로 돌아온다.
  풀어서 설명하면, 최초 클릭시 moveUp함수가 동작하고 박스가 -300위치까지 도달하면 callback함수로
  toggleUp함수가 동작, up의 state가 바뀌는데 여기서 바로 re-rendering이 발생하여 
  new Animated.Value(0)에 의해 Y_POSITION의 값이 0으로 바뀌고 박스 위치가 y좌표 0으로 돌아오게 된다.
  우리는 -300의 위치에서 다시 300으로 내리는 애니메이션을 구현해야 한다.
  하지만 이렇게하면 -300위치까지 올라갔다가 0으로 다시 렌더링, 그 후 300의 위치로 내려갔다가
  다시 0의 위치로 렌더링하게 된다.
  이때 useRef는 state값이 변하면 re-rendering되는 react의 규칙내에서 값을 유지 시킨다.
  이로 인해 -300위치까지 올라간 박스는 다시 0으로 돌아오지 않게 되고 다시 박스를 클릭하면
  300의 위치로 내려오게 된다.

  interpolate는 input과 output의 상호작용을 만들어준다.
  const a = b.interpolate({
    inputRange: [-100, 100 ]
    outputRange: [ 1 , 44  ]
  })
위 코드에서 b의 값이 변하는 구간을 뜻하는게 inputRange이다. 당연히 a는 outputRange가 되겠다. 
input값이 -100에서 100까지 변하면 그에 맞게 output값이 1에서 44까지 서서히 변한다.
*/

/* 1. animation의 state는 절대 react의 state에 두지 않는다.
필요한 value는 Animated API에서 주어질 것
2. Animated.Value 값은 절대 직접 수정하지 않음
3. 아무 컴포넌트나 막 animate 할 수 없음. 먼저 컴포넌트를 Animated하게 바꾸거나 (createAnimatedComponent) Animated에서 기본으로 주어진 것(ex. AnimatedBox.View ...etc)들을 이용
두 가지 방법:
1. const Box = styled(Animated.createAnimatedComponent(TouchableOpacity))`
2. styled component를 animated 컴포넌트에 넣어준다
--------------------------------------------------------------------

const AnimatedBox = Animated.createAnimatedComponent(Box); */
  /* const moveUp = () => {
    const id = setInterval(() => setY((prev) => prev + 1), 1);
    setIntervalId(id);
  }
  
  useEffect (() => {
    if(y === 200) {
      clearInterval(intervalId);
    }
  }, [y, intervalId]);
  console.log("rendering"); 
  
  수동으로 애니메이션 효과를 만드는 코드.
  굉장히 정직하게 움직이게 되며, 그 이외의 효과를 수동으로 구현하려면
  방대한 양의 코드가 필요하거나, 불가능할 것.
  때문에 우리는 Animated에 의존한다.
  ----------------------------------------------------------------
  */
 
  Y_POSITION.addListener(() => {
    console.log("Y VALUE:", Y_POSITION);
    console.log("opacity VALUE:", opacity);
    console.log("borderRadius VALUE:", borderRadius);
  });
 /*  useNativeDriver의 영향으로 console.log만 찍으면 콘솔 창에는 Y_POSITION의 값이
  0에서 바뀌지 않는다. Y_POSITION에 addListener를 달아 callback함수로 console.log를
  찍으면 비로소 보이게된다. */
  return (
    <Container>
    <Pressable onPress={moveUp}>
      <AnimatedBox  style={{
        opacity,
        borderRadius,
        transform: [{ translateY: Y_POSITION }],
      }}/>
      </Pressable>
    </Container>
  );
}
//opacity는 프로퍼티인데 const opacity = Y_POSITION.interpolate ~ 처럼 할 수 있다는
//사실을 처음 알았다. 간결해서 좋긴한데 뭔가 weird하다.

