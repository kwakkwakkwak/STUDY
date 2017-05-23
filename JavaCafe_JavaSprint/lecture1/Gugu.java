class Gugu {

  public static void main(String[] args) {
    for(int second = 1; second < 10; second++) {
      for(int first = 2; first < 10; first ++) {
        System.out.printf("\t%d X %d = %d", first, second, first * second);
      }
      System.out.println();
    }
  }
}
