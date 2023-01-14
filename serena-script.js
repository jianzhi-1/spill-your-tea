var animationInterval;
var spriteSheet = document.getElementById("sprite-image");
console.log(spriteSheet);
var widthOfSpriteSheet = 256; //TODO
var widthOfEachSprite = 64; //TODO

function stopAnimation() {
  clearInterval(animationInterval);
}

function startAnimationGIRL() {
  var position = widthOfEachSprite; //start position for the image
  const speed = 100; //in millisecond(ms) //TODO
  const diff = widthOfEachSprite; //difference between two sprites

  animationInterval = setInterval(() => {
    spriteSheet = document.getElementById("sprite-image-girl");
    spriteSheet.style.backgroundPosition = `-${position}px -128px`; //TODO

    if (position < widthOfSpriteSheet) {
      position = position + diff;
    } else {
      //increment the position by the width of each sprite each time
      position = widthOfEachSprite;
    }
    //reset the position to show first sprite after the last one
  }, speed);
}

function startAnimation() {
    var position = widthOfEachSprite; //start position for the image
    const speed = 100; //in millisecond(ms)
    const diff = widthOfEachSprite; //difference between two sprites
  
    animationInterval = setInterval(() => {
      spriteSheet = document.getElementById("sprite-image");
      spriteSheet.style.backgroundPosition = `-${position}px -67px`;
  
      if (position < widthOfSpriteSheet) {
        position = position + diff;
      } else {
        //increment the position by the width of each sprite each time
        position = widthOfEachSprite;
      }
      //reset the position to show first sprite after the last one
    }, speed);
  }

//Start animation
startAnimationGIRL();
startAnimation();

const form  = document.getElementById('signup');

form.addEventListener('submit', (event) => {
    // handle the form data
    console.log("PRESSED SUBMIT");
    const name = form.elements['name'];
    console.log(name.value);
    fetch("http://localhost:5000/sendMessage", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({"name": name.value })
    }).then(response => {
        console.log(response)
        return response.json()
    })
    .then(response => response)
    .then((data) => {
        var obj = document.getElementById('chatbox');
        var str = '<div id="chatbox">'
        for (var i in data){
            str += '<div>'
            str += data[i][0]
            str += ':'
            str += data[i][1]
            str += '</div>'
        }
        str += '</div>'
        obj.outerHTML=str;
      })
});