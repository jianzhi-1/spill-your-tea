var animationInterval;
var spriteSheet = document.getElementById("sprite-image");
console.log(spriteSheet);
var widthOfSpriteSheet = 256; //TODO
var widthOfEachSprite = 64; //TODO

function stopAnimation() {
  clearInterval(animationInterval);
}

function startAnimation() {
  var position = widthOfEachSprite; //start position for the image
  const speed = 100; //in millisecond(ms) //TODO
  const diff = widthOfEachSprite; //difference between two sprites

  animationInterval = setInterval(() => {
    spriteSheet = document.getElementById("sprite-image");
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

function startAnimationPatronus() {
    var position = widthOfEachSprite; //start position for the image
    const speed = 100; //in millisecond(ms)
    const diff = widthOfEachSprite; //difference between two sprites
  
    animationInterval = setInterval(() => {
      spriteSheet = document.getElementById("sprite-image-patronus");
      spriteSheet.style.backgroundPosition = `-${position}px -73px`;
  
      if (position < widthOfSpriteSheet) {
        position = position + diff;
      } else {
        //increment the position by the width of each sprite each time
        position = widthOfEachSprite;
      }
      //reset the position to show first sprite after the last one
    }, speed);
  }

  function startAnimationPatronusGM() {
    var position = widthOfEachSprite; //start position for the image
    const speed = 100; //in millisecond(ms)
    const diff = widthOfEachSprite; //difference between two sprites
  
    animationInterval = setInterval(() => {
      spriteSheet = document.getElementById("sprite-image-patronus-GM"); //TODO
      spriteSheet.style.backgroundPosition = `-${position}px -73px`;
  
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
startAnimation();
startAnimationPatronus();
startAnimationPatronusGM();

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
        body: JSON.stringify({"name": name.value, "sender":"ash", "receiver":"pikachu" })
    }).then(response => {
        console.log(response)
        return response.json()
    })
    .then(response => response)
    .then((data) => {
        console.log(data);
        var senderMood = data["senderMood"]
        var receiverMood = data["receiverMood"]
        data = data["list"]
        console.log(senderMood, receiverMood, data)
        var obj = document.getElementById('chatbox');
        var str = '<div id="chatbox" class="imessage">'
        for (var i in data){
            str += '<div class="flex-container">'
            str += '<div class="sendername flex-child">'
            str += data[i].sender
            str += ':'
            str += '</div>'
            str += '<div class="contentname flex-child">'
            
            if (data[i].sender == "ash"){
                str += '<p class="from-them">'
            } else {
                str += '<p class="from-me">'
            }
            str += data[i].content
            str += '</p>'
            str += '</div>'
            str += '</div>'
        }
        str += '</div>'
        obj.outerHTML=str;

        if (senderMood[0] == 0 && senderMood[1] == 0 && senderMood[2] == 0){

        } else {
            /* changing attributes */
            var moodbar = document.getElementById('mood-bar');
            var strmood = '<div id="mood-bar">'
            strmood += '<label for="disk_c">Mood 😊</label>'
            strmood += '<meter id="disk_c" value="' + senderMood[0].toString() + '" min="0" max="100"></meter><br>'
            strmood += '</div>'
            moodbar.outerHTML=strmood;

            var energybar = document.getElementById('energy-bar');
            var strenergy = '<div id="energy-bar">'
            strenergy += '<label for="disk_c">Energy ⚡</label>'
            strenergy += '<meter id="disk_c" value="' + senderMood[1].toString() + '" min="0" max="100"></meter><br>'
            strenergy += '</div>'
            energybar.outerHTML=strenergy;

            var kindnessbar = document.getElementById('kindness-bar');
            var strkindness = '<div id="kindness-bar">'
            strkindness += '<label for="disk_c">Kindness ❤️</label>'
            strkindness += '<meter id="disk_c" value="' + senderMood[2].toString() + '" min="0" max="100"></meter><br>'
            strkindness += '</div>'
            kindnessbar.outerHTML=strkindness;
        }

        if (receiverMood[0] == 0 && receiverMood[1] == 0 && receiverMood[2] == 0){

        } else {
            var moodbarpatron = document.getElementById('mood-bar-patronus');
            var strmoodpatron = '<div id="mood-bar-patronus">'
            strmoodpatron += '<label for="disk_c">Mood 😊</label>'
            strmoodpatron += '<meter id="disk_c" value="' + receiverMood[0].toString() + '" min="0" max="100"></meter><br>'
            strmoodpatron += '</div>'
            moodbarpatron.outerHTML=strmoodpatron;
    
            var energybarpatron = document.getElementById('energy-bar-patronus');
            var strenergypatron = '<div id="energy-bar-patronus">'
            strenergypatron += '<label for="disk_c">Energy ⚡</label>'
            strenergypatron += '<meter id="disk_c" value="' + receiverMood[1].toString() + '" min="0" max="100"></meter><br>'
            strenergypatron += '</div>'
            energybarpatron.outerHTML=strenergypatron;
    
            var kindnessbarpatron = document.getElementById('kindness-bar-patronus');
            var strkindnesspatron = '<div id="kindness-bar-patronus">'
            strkindnesspatron += '<label for="disk_c">Kindness ❤️</label>'
            strkindnesspatron += '<meter id="disk_c" value="' + receiverMood[2].toString() + '" min="0" max="100"></meter><br>'
            strkindnesspatron += '</div>'
            kindnessbarpatron.outerHTML=strkindnesspatron;
        }
      })
});