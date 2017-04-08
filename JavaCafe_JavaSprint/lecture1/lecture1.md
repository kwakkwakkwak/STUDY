# 자바까페 자바 스터디 1번째 시간



```java

// for 문 대신에 IntStream으로도 가능하다.
IntStream.range(2, 10).mapToObj( a => a * a);

// 이렇게 하면 range안에 있는 것들을 실행되어서 mapToObj안의 함수 결과값으로 배열 값을 반환한다.
```
