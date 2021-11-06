// 解决 refresh me 不见了的问题
// use   window.performance.navigation.type
// It will be 0 if you are coming through a URL. It will be 1 if you are refreshing,
//and it will be 2 if you are coming using the forwards/backwards buttons in your web browser.



if (window.performance.navigation.type === 1) {
  rollDice();
}


function rollDice() {

var randomNum1 = Math.floor(Math.random()*6+1);
var randomNum2 = Math.floor(Math.random()*6+1);

document.querySelector("img.img1").setAttribute("src","images/dice"+randomNum1+".png");
document.querySelector("img.img2").setAttribute("src","images/dice"+randomNum2+".png");




  if (randomNum1>randomNum2) {
    document.querySelector("h1").innerHTML="🚩Player 1 wins!";
  }

  else if (randomNum1<randomNum2) {
    document.querySelector("h1").innerHTML="Player 2 wins!🚩";
  }

  else {
    document.querySelector("h1").innerHTML="Draw!";
  }

}
