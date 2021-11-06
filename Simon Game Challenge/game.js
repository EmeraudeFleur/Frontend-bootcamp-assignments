var gamePattern = [];
var userPattern = [];
var buttonColors = ['red', 'green', 'yellow', 'blue'];

//Start the game: call the following function when a key is pressed for the first time.
var keyPressed = false;
var level = 0;

$(document).keydown(function() { //注意要用$(document),因为检测整个键盘敲击。不然点击键盘界面没反应。

  if (!keyPressed) { //if(keyPressed) --> if(keyPressed==true)
    nextSequence();
    keyPressed = true;
  }
});


// Creat new pattern

function nextSequence() {

  userPattern = []; //位置关键，放在trigger nextSequence() 之后的话，当nextSequence 被触发后，
  //这一句却不被触发，即userPattern不会清楚，所以restart 后总是game over.

  var randomNum = Math.floor(Math.random() * 4);
  var randomChosenColor = buttonColors[randomNum];
  gamePattern.push(randomChosenColor);

  //show the sequence to the user with animation:
  $('#' + randomChosenColor).fadeOut(100).fadeIn(100);
  playSound(randomChosenColor);

  level++;
  $('h1').text('Level ' + level);
};


//check which button is pressed:
$('.btn').click(function() {
  var userChosenColor = this.id;
  userPattern.push(userChosenColor);

  //Check answer 最后一个方块，每次点击都要核对。
  checkAnswer(userChosenColor);

  //then check that they have finished their sequence with another if statement. once done, reset userPattern array
  if (userPattern.length === gamePattern.length) {
    setTimeout(nextSequence(), 1000);
  }

});


function checkAnswer(currentLevel) {
  //use if statement check if （the most recent user answer） is the same as the game pattern.
  // the moset recent answer = userPattern.length-1
  currentLevel = userPattern.length - 1;
  if (userPattern[currentLevel] !== gamePattern[currentLevel]) {
    playSound('wrong');
    $('body').addClass('game-over');
    setTimeout(function() {
      $('body').removeClass('game-over');
    }, 200);
    $('h1').text('Game Over, Press Any Key to Restart');
    startOver();
  }
};


// Restart
function startOver() {
  gamePattern = [];
  level = 0;
  keyPressed = false;
};


//add sounds to buttons clicked
$('.btn').click(function() {
  playSound(this.id);
  animatePress(this.id);
});


//add animation to user clicks 也是一个带参数的通用函数：
function animatePress(currentColor) {
  $('.' + currentColor).addClass('pressed');
  setTimeout(function() {
    $('.' + currentColor).removeClass('pressed');
  }, 100);
};


//* 通用的播放声音的函数
function playSound(name) {
  var audio = new Audio('sounds/' + name + ".mp3");
  audio.play();
};
