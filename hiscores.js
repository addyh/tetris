// call addBestScore if they have entered a name
function submitHiscore() {
  let name = hiscoreInput.value();
  if (name) {
    addBestScore(name, board.score);
  }
  else {
    alert('Enter a name to submit your high score!');
  }
}

// send name and score to high score server, then reload page
function addBestScore(name, score) {
  let scoreUrl = 'https://addy.ml/tetris-host/hiscores.php?add&name='
        + name + '&score=' + score;
  let image = document.createElement('img');
  image.setAttribute('style', 'display:none;');
  image.src = scoreUrl;
  $('body').append(image);
  setTimeout(function() {
    window.location.reload(true);
  }, 2000);
}

// did they get the all-time high score?
function isBestScore() {
  let bestScore = getBestScore();
  return (board.score > bestScore);
}

// set a cookie (mainly high score)
function setCookie(cname, cvalue, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = 'expires='+ d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires;
}

// retrieve a cookie (mainly high score)
function getCookie(cname) {
  let name = cname + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return 0;
}
