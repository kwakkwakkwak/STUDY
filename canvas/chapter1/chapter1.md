# 캔버스 구성

## 1.1 <canvas> 요소

### 1.1.1 <canvas> 요소의 크기와 드로잉 표면의 크기
`<canvas>` 는 그림, 그레프, 애니메이션 등을 그리는데 사용되는 요소이다.  

웹브라우저 호환성  

| 크롬   | 파이어폭스    | 익스플로러 | 사파리  |
| ---- | -------- | ----- | ---- |
| 1.0  | 1.5(1.8) | 9.0   | 2.0  |

height : 기본값 150  
width : 기본값 300  
height, width 는 음수 아닌 정수만 사용할수 있다.  
또한 픽셀 값은 기술적으로는 허락하지 않는다.  

CSS 속성을 이용해서 `<canvas>` 요소의 크기를 변경할수는 있지만
원치 않는 결과가 발생할 수 있다.  

캔버스는 캔버스 요소 크기 뿐만 아니라 요소의 드로잉 표면에 대한 크기도 설정가능  
CSS로는 요소의 크기만 설정 가능하다.  
이렇게 요소와 드로잉 표면의 크기가 일치하지 않으면 요소의 크기에 맞추기 위해
드로잉 표면의 크기를 변경하게 되면서 늘어지게 보인다.

따라서 `<canvas>` 요소 내부의 width, height 를 통해서 변경해주는게 좋다.

### 1.1.2 캔버스 API
캔버스 API 에는 무엇이 있을까?
`<canvas>` 요소에서는 2가지 속성과 3가지 메서드만 제공하고 있다.

#### <canvas> 속성
width : 드로잉 표면의 너비, 기본적으로 브라우저에서는 `<canvas>` 요소를 같은 크기로 생성한다.  height : 드로잉 표면의 높이, 기본적으로 브라우저에서는 `<canvas>` 요소를 같은 크기로 생성한다.  

#### <canvas> 메서드
getContext() : 캔버스와 연관된 그래픽 콘텍스트를 반환.
toDataURL(type, quality) : <img> 요소의 src 속성에 할당할 수 있는 데이터 URL을 반환
toBlob(callback, type, args...) : 캔버스에 이미지를 포함하고 있는 파일을 나타내는 Blob 생성


## 1.2 캔버스 콘텍스트
`<canvas>` 는 콘텍스트를 위한 컨테이너로서의 역할만 한다.  
콘텍스트는 모든 그래픽 능력(graphics horsepower)를 제공한다.  

### 1.2.1 2d 콘텍스트
`<canvas>` 요소는 너비, 높이, 데이터 URL 가져오는 거 외에는 요소자체를 사용하는 일이 거의 없다.  

#### 2d 콘텍스트 속성 ( CanvasRenderingContext2D 속성 )
- canvas : 콘텍스트의 캔버스를 참조한다.
- fillStyle : 콘텍스트에서 도형을 채울 때 사용할 색상, 그라디언트, 패턴을 명시한다.
- font : fillText()나 strokeText()를 호출할때 콘텍스트에서 사용할 폰트 명시
- globalAlpha : 전역 Alpha값을 설정하는 속성으로 0 ~ 1.0 사이의 값 사용
- globalCompositeOperation : 브라우저가 도형위에 다른도형을 그리는 방법을 결정
- lineCap : line에 대한 endpoint를 그리는 방법을 명시. butt, round, square
- lineWidth : line의 너비를 결정. 유한 실수 값 사용
- lineJoin : line의 끝점이 만날 때 연결되는 방법을명시, bevel, round, miter
- miterLimit : miter 값으로 선의 연결을 그리는 방법 명시
- shadowBlur : 브라우저에서 그림자를 흐리는 방법을 결정
- shadowColor : 그림자의 색상을 정의
- shadowOffsetX : 그림자의 가로 오프셋(픽셀)을 명시한다.
- shadowOffsetY : 그림자의 세로 오프셋(픽셀)을 명시한다.
- strokeStyle : path를 그릴 때 사용할 스타일을 명시한다. 색상, 그라디언트, 패턴 사용가능
- textAlign : fillText()나 strokeText()를 사용해 그린 텍스트의 가로 위치 결정
- textBaseline : fillText()나 strokeText()를 사용해 그린 텍스트의 세로 위치 결정




##### WebGL 3d 컨텍스트

- OpenGL ES 2.0 API에 따른 3d 컨텍스트도 존재한다.



### 1.2.2 캔버스 상태 저장 및 복원
- 캔버스 API에는 캔버스 콘텍스트의 모든 속성을 저장하고 복원할 수 있는 save() 메서드와 restore() 메서드를 제공한다.

```javascript
function drawGrid(strokeStyle, fillStyle) {
  controlContext.save();	// 콘텍스트의 현재상태를 스택에 저장한다.
  controlContext.fillStyle = fillStyle;
  controContext.strokeStyle = strokeStyle;
  
  // 격차무늬 그리기
  
  controlContext.restore();	// 스택에 저장된 콘텍스트를 불러와 복원한다.
  
}
```



| 메서드       | 설명                                       |
| --------- | ---------------------------------------- |
| save()    | 캔버스의 현재 상태를 스택에 넣는다. 캔버스 상태는 strokeStyle, fillStyle, globalCompositeOperation 등을 포함한 캔버스 콘텍스트의 모든 속성과 현재 변화 및 클리핑 영역도 포함하고 있다. 하지만 캔버스 상태는 현재 path 나 비트맵을 포함하지 않는다. beginPath()를 호출해야만 path를 재설정할 수 있으며 비트맵은 콘텍스트가 아닌 캔버스의 속성이다. 비트맵은 캔버스의 속성이지만 콘텍스트(getImageData())를 통해 비트맵에 접근할수 있다. |
| restore() | 스택으로부터 맨 위에 있는 정보를 꺼낸다. 이렇게 정보를 꺼내면 스택의 맨 위에 있는 상태가 현재 상태가 되며 브라우저에서는 그에 맞춰 캔버스 상태를 설정해야 한다. 따라서 save() 메서드와 restore() 메서드 사이에 캔버스 상태를 변화시키고 싶다면 restore() 메서드를 호출할 때 까지만 상태를 유지하면 된다. |



## 1.3 책에서 사용하는 표준 형태
```html
<body>
  <canvas id='canvas' width='600' height='300'>
  	이 글자가 보이면 캔버스 미지원입니다.
  </canvas>
  <script src='example.js'></script>
</body>
```

```javascript
var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');
// 콘텍스트 사용....
```

- 사용자 에이전트 (User Agent)
  - 캔버스 명세서에서는 <canvas> 요소의 구현자를 사용자 에이전트로 언급하며, UA 라고도 한다. 브라우저 뿐만 아니라 소프트웨어에서도 <canvas> 엘리먼트를 사용할 수 있으므로 명세서에서는 브라우저 대산 사용자 에이전트란 용어를 사용하고 있다.



## 1.4 개발 환경 개요
### 1.4.1 명세서
### 1.4.2 브라우저
### 1.4.3 콘솔 및 디버거

### 1.4.4 성능


## 1.5 기본적인 드로잉 작업
- arc, beginPath, clearRect, fill, fillText, lineTo, moveTo, stroke

## 1.6 이벤트 처리
이벤트처리? 핸들러? 아니면 리스너?

### 1.6.1 마우스 이벤트
마우스 이벤트는 어디까지 커버했을까? 좌클? 우클? 스크롤?

### 1.6.2 키보드 이벤트
키보드 이벤트는 주로 어떤 것을? 방향키, 엔터키?

### 1.6.3 터치 이벤트
터치는 모바일인데 ?

## 1.7 드로잉 표면의 저장 및 복원
드로잉 표면이 무엇일까? 왜 저장하는 것일까?

## 1.8 캔버스에서 HTML 요소 사용하기
캔버스 내부에서 HTML 요소를 사용하는 것일까?
무엇을 왜 사용하는 것일까?

### 1.8.1 보이지 않는 HTML 요소
display none을 말하는 것인가? indent 9999를 말하는 것일까?

## 1.9 캔버스 출력하기
출력은 무엇을 말하는 것일까?
원래 화면에 출력되고 있지 않은 가?

## 1.10 오프스크린 캔버스
오프스크린이 무엇일까?

## 1.11 간단한 수학 입문
간단한 수학입문? 어떤 수학을 말하는가?

### 1.11.1 대수 방정식 풀이
대수 방정식은 무엇을 말하는가? 어떻게 푸는가?

### 1.11.2 삼각법
삼각함수를 말하는 것인가?

### 1.11.3 벡터
벡터는 행렬을 이용할거 같은데 어떻게 할까?

### 1.11.4 측정 단위에서 방정식 산출하기
측정 단위는 무엇일까? 픽셀? 방정식

## 1.12 결론
무엇에 대한 결론일까?
결론은 무엇일까?
