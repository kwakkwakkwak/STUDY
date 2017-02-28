display ares : 브라우저 안에 있는 하얀 공간.

device : 디바이스가 사용할수 있는 모든 공간, 즉 모니터나 모바일 전체 화면.



media feature : 미디어 쿼리에서 사용할수 잇는 여러가지 속성

피처1 : 

​	width, height

​	( max-, min-, ) + (device- ) + ( width, height )

​	min-device-height = 300px;



​	aspect-ratio : 화면 비율 ( width / height )

​	( max-, min-, ) + (device- ) + ( aspect-ratio )	

​	min- aspect-ratio = 5/4 => 가로로 5/4 비율 이상 더 커질수 있다.



​	resolution : 이 화면의 해상도, dpi 인치당 몇개의 픽셀이 들어간다. 

​	픽셀은 가짜로 쓰는경우가 많아서 resolution으로 체크하는 경우가 많다.



​	orientation

​		portrait, landscape ( 이것은 디바이스가 정하기 나름이다. 가로 길이 비율 별 상관 없다.)

피처2 : 

​	칼라 ( 칼라, 칼라 인덱스 등등 가능 )

​	모노크롬 : 회색, 검정, 흰색 등등.. 음영 처리 가능함.(리디북스 이펍 등에 사용되기도)

​	scan : 티비 매체에 많이 사용될수 잇었다. 티비에서도 html 문서를 띄울려는 시도가 잇었다.



프로그레시브 스캔 : 화면 한 화소를 전체 화면으로 하나의 프레임 시간에 그려내는 것.

인터레이스 : 2개의 전자총을 사용해서 하나의 화면을 그림. 세로줄 가로줄을 각각 그려냄. 즉 가로라인, 세로라인..

그리드 : 화면이 픽셀이 아니라 그리드로 그리는 것. 그리드로 css 할경우에는 글자폭이 일정하다.

스캔은 거의 안쓰는 속성이다.



미디어쿼리 적용방법

1. link tag 

```css
<link rel="stylesheet" media="query" href="css"/>
```

2. @media

```css
@media query{rules}
```

3. @import

```css
@import url(xx.css) query
```



모바일 사파리, 크롬에서.. 본인에게 합당한 것만 로딩한다. 왜냐면 모바일 화면은 바뀌지 않을 것이므로.

따라서 모바일에서는.. 1번을 많이 씀. 아직까지는 피씨브라우저에서는 전부 로딩하므로 미디어 씀

피씨에서는 import도 일단은 비효율적이다.



조건, 에서 and , or을 많이 쓴다.



or ==,
screen, print == screen or print ( , ==> or )

and
screen and resolution > 90dpi

print, screen and resolution > 90dpi
print, (screen and resolution) > 90dpi <== 왼쪽부터 해석되므로...
미디어 쿼리는 괄호를 지원한다. 그러므로 헷갈리지 않게 괄호를 쓰라.

괄호 안에는 하나의 피쳐가 들어갈수도 있고, 쿼리가 들어갈 수도 있다.



피씨용, 모바일용 웹 사이트가 따로 있다.

모바일용 페이지는 반응형, 플렉서블하다.  디바이스 별로 나뉘어진 것으로는 유연하다.
플렉서블 UI 라고 한다. 굉장히 데이터가 많이 나올수 있기 때문이다.



반응형 페이지 템플릿

전체 디바이스 크기를 커버하는 템플릿이다.

```css
// 모바일 퍼스트 템플릿, 일단 모바일용을 만들고 그 이후 큰화면을 미디어 쿼리로 만든다.
// 일단 작은 사이즈를 만들고 그 이후 큰 것을 만든다.

/* all */

/* mobile */
모바일에서는 미디어 쿼리를 지원하지 않는 경우가 많다.


@media ( max-width:768px ) {
  /* 타플랫 portrait  */
}

@media ( min-width:768px ) and (max-width:1024px){
  /* 13인치, 아이패드, 타블렛 랜드스케이프, 데탑 */
}

@media (min-width:1025px) {
  /* desctop */
}
```



