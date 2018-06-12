const cardsList = [
  'leaf', 'leaf', 
  'cube', 'cube', 
  'anchor', 'anchor', 
  'paper-plane-o', 'paper-plane-o', 
  'bomb', 'bomb', 
  'diamond', 'diamond', 
  'bolt', 'bolt', 
  'bicycle', 'bicycle'
];
const deck = document.querySelector('.deck');
const moves = document.querySelector('.moves');
const timer = document.querySelector('.timer');
const stars = document.querySelectorAll('.fa-star');
const restart = document.querySelector('.restart');
let matchedCards = [];
let selectedCards = [];
let second = 0;
let startTimer;
let movesCount = 0;
var starsCount = 3;

//Set the timer
function setTimer (){
  startTimer = setInterval(function(){
    timer.innerHTML = second;
    second++;
  }, 1000); 	
}

function timerReset (time){
  clearInterval(time);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}


//create and append cards to html.Create random cards.Flipping cards

function renderCards(deck, list) {
  list.forEach((elem, index) => {
    
    let li = document.createElement('li');
    let i = document.createElement('i');
    li.className = 'card';
    deck.appendChild(li);
    li.appendChild(i);
    i.className = "fa fa-" + list[index];

    li.addEventListener('click', e => {
    //e.target.classList.add('open', 'show');
      addToSelectedCards(index);
    })
    
  });
};

//Pushing the selected cards to the selected cards array

function addToSelectedCards(index){
  
  if (includes(selectedCards, index) || includes(matchedCards, index)) {
    return;
  }
  
  if(selectedCards.length < 2){
    selectedCards.push(index);
  } else {
    selectedCards = [];
    selectedCards.push(index);
  }
  updateNodes();
  if (selectedCards.length === 2){
    movesCount++;
    blankStars(movesCount);
    moves.innerHTML = movesCount;
   
    if(isMatched(selectedCards)){
      matchedCards = matchedCards.concat(selectedCards);
      selectedCards = [];
      updateNodes();
    }
  }
}

//Checking the matched cards
function isMatched(flippedCards){
  const first = flippedCards[0];
  const second = flippedCards[1];
  console.log('matched: ', cardsList[first] === cardsList[second]);

  return  cardsList[first] === cardsList[second];
}

function includes(list, item) {
  return list.indexOf(item) > -1;
};

function updateNodes() {
    
  console.log('>>> open:', matchedCards);
  console.log('>>> selected:', selectedCards);
  const children = deck.childNodes;
  children.forEach((c, index) => { 
    if (includes(selectedCards, index)) {  
      c.classList.add('open', 'show');
      if (!includes(matchedCards, index) && selectedCards.length === 2) { 
        c.classList.add('wrong', 'animated','infinite', 'wobble'); 
        setTimeout(function () {
          c.classList.remove('open', 'show', 'wrong','animated','infinite', 'wobble');  
        }, 500); 
      }
    } else {
      if(includes(matchedCards, index)){
        c.classList.remove('wrong');
       
        
          c.classList.add('match', 'animated','infinite', 'rubberBand');
       
        setTimeout(function () {
       c.classList.remove('animated','infinite', 'rubberBand'); 
       }, 500);
        if(matchedCards.length === 16){
          //const PlayTime = timer.value;
          second;
          winner();
          timerReset (startTimer);
          blankStars(movesCount);
        }
      }
      // else if (!includes(matchedCards, index)) {
      //       c.classList.remove('open', 'show');  
      // }
    }
  });
};

//Making blank stars
function blankStars(movesCount){
	if(movesCount > 12 && movesCount < 18){
    starsCount = 2;
	  stars[0].classList.remove('fa-star');
	  stars[0].classList.add('fa-star-o');
	} else if(movesCount > 18 && movesCount < 25){
    starsCount = 1;
	  stars[1].classList.remove('fa-star');
	  stars[1].classList.add('fa-star-o');
	}else if(movesCount > 25){
	  starsCount = 1;
	}
  return starsCount;
 }

 //Making full stars
function fullStars(){
  stars[0].classList.remove('fa-star-o');
  stars[0].classList.add('fa-star');
  stars[1].classList.remove('fa-star-o');
  stars[1].classList.add('fa-star');
};

function startOver(){
  deck.innerHTML = '';
  updateNodes();
  renderCards(deck,shuffle(cardsList));
  second = 0;
  timerReset (startTimer );
  movesCount = 0;
  moves.innerHTML = movesCount;
  timer.innerHTML = second;
  matchedCards = [];
  selectedCards = [];
  fullStars();
  
}

restart.addEventListener('click', e => {
  startOver();
  setTimer();
});

function winner(){
  swal({
    closeOnEsc: false,
	  allowOutsideClick: false,
    title: "congratulations! You Won!",
    text: 'With ' + movesCount + ' Moves and ' + starsCount + ' Stars in ' + second+ ' Seconds.\n Woooooo!',
    icon: "success",
    button: "Play again!",
  }).then(function (isConfirm) {
		if (isConfirm) {
      startOver();
      setTimer();
    };
  })
}

renderCards(deck,shuffle(cardsList));
setTimer();





