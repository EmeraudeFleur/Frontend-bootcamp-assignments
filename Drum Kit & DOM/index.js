// var audio = new Audio("sounds/crash.mp3");
// audio.play();

//1. play by click

var arr = document.querySelectorAll(".drum");
for (var i=0;i<arr.length;i++){
  arr[i].addEventListener("click",function(){
    makeSound(this.innerHTML);
    btnAnnimation(event.target.innerHTML);
  });
}
/*
下面方法更合适。
keypress event has a key property, whereas click event doesn't. The event property you want is target:

  document.querySelectorAll(".drum")[i].addEventListener("click", function(event) {
    var buttonInnerHtml = event.target.innerHTML;
    makesound(buttonInnerHtml);
  });

event.target is more preferred than this because there are certain conditions
where this points to the window object instead of the calling object (i.e. button).
*/

//2. play by keyboard

document.addEventListener("keydown",function(event){
  makeSound(event.key);
  btnAnnimation(event.key);
});

/* by pressing a key, console outputs the object associated with this key.
event refers to this object triggered by corresponding event.
document.addEventListener("keydown",function(event){
  console.log(event);
});
this object contains a property named key, which identifies the exact key on keyboard.
thus, event.key in order to get this key name. 点击屏幕，或者按某个键盘，console会反馈 mouseEvent,kyeboardEvent.包含很多具体的信息。
疑问：似乎匿名函数 function() 里面可以写 this，or event, 不写的话也可以。

# higher-order function 参数里面那个等待某个event的是callback function.

# arrow parameters:this, event.
通过 constructor function的知识，可以理解到js创建了自己的基层constructor function。这就是为什么我们可以直接initialise array/audio.
eg. var audio = new Audio("url")
    var arr = new Array();
*/

//math characters(w,a,s,d,j,k,l) to sounds
function makeSound(key){
  switch(key){
    case "w":
    var crash = new Audio("sounds/crash.mp3");
    crash.play();
    break;

    case "a":
    var kick = new Audio("sounds/kick-bass.mp3");
    kick.play();
    break;

    case "s":
    var snare = new Audio("sounds/snare.mp3");
    snare.play();
    break;

    case "d":
    var tom1 = new Audio("sounds/tom-1.mp3");
    tom1.play();
    break;

    case "j":
    var tom2 = new Audio("sounds/tom-2.mp3");
    tom2.play();
    break;

    case "k":
    var tom3 = new Audio("sounds/tom-3.mp3");
    tom3.play();
    break;

    case "l":
    var tom4 = new Audio("sounds/tom-4.mp3");
    tom4.play();
    break;
  }
}

//add animation when play certain sound

 function btnAnnimation(currentKey){
   var activeButton = document.querySelector("."+currentKey);
   activeButton.classList.add("pressed");
//到这里，按键或者点击，鼓的图片都有了.pressed灰度效果，但是都不变回去。所有设置一定时间后取消该className.
// setTimeout(function,milliseconds).
  setTimeout(function(){activeButton.classList.remove("pressed");},100);

 }

// 别人写的随机播放30个key的鼓点。研究一下
//
// const numberOfDrumButtons = document.querySelectorAll(".drum").length;
//
// document.querySelector(".random-beat").addEventListener("click", function () {
//   this.classList.add("pressed-beat-generator");
//   let numberOfRandomBeat = 30;
//   let randomPlayer = setInterval(() => {
//     const randomNoteArrayIndex = Math.floor(
//       Math.random() * (numberOfDrumButtons + 1)
//     );
//     const selectedNote = document.querySelectorAll("button")[
//       randomNoteArrayIndex
//     ];
//
//     makeSound(selectedNote.innerHTML);
//     buttonAnimation(selectedNote.innerHTML);
// 
//     numberOfRandomBeat--;
//
//     if (numberOfRandomBeat === 0) {
//       clearInterval(randomPlayer);
//       this.classList.remove("pressed-beat-generator");
//     }
//   }, 120);
// });
