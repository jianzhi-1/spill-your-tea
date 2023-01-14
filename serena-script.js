var animationInterval;
var spriteSheet = document.getElementById("sprite-image");
console.log(spriteSheet);
var widthOfSpriteSheet = 256;
var widthOfEachSprite = 64;

function stopAnimation() {
  clearInterval(animationInterval);
}

function startAnimationGIRL() {
  var position = widthOfEachSprite; //start position for the image
  const speed = 100; //in millisecond(ms)
  const diff = widthOfEachSprite; //difference between two sprites

  animationInterval = setInterval(() => {
    spriteSheet = document.getElementById("sprite-image-girl");
    spriteSheet.style.backgroundPosition = `-${position}px -128px`;

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
        body: JSON.stringify({"name": name.value, "sender":"serena", "receiver":"ash"})
    }).then(response => {
      console.log(response)
      return response.json()
  })
  .then(response => response)
  .then((data) => {
      console.log(data);
      var senderMood = data["senderMood"]
      var receiverMood = data["receiverMood"]
      var senderDeltaMood = data["senderDeltaMood"]
      var receiverDeltaMood = data["receiverDeltaMood"]

      data = data["list"]
      console.log(senderMood, receiverMood, data)
      var obj = document.getElementById('chatbox');
      var str = '<div id="chatbox" class="imessage">'
      for (var i = data.length - 1; i >= 0; i--){
          str += '<div class="flex-container">'
          str += '<div class="sendername flex-child">'
          str += data[i].sender
          str += ':'
          str += '</div>'
          str += '<div class="contentname flex-child">'
          
          if (data[i].sender == "serena"){
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

      var attributeDelta = document.getElementById('attributedelta');
      var strAttributeDelta = '<div id="attributedelta" class="center">'

      if (senderDeltaMood[0] > 0){
          strAttributeDelta += '<div>😊 + ' + senderDeltaMood[0].toString() + '</div>'
      } else if (senderDeltaMood[0] < 0){
          strAttributeDelta += '<div>😊 - ' + (-senderDeltaMood[0]).toString() + '</div>'
      } else {
          strAttributeDelta += '<div>😊 = ' + senderDeltaMood[0].toString() + '</div>'
      }

      if (senderDeltaMood[1] > 0){
          strAttributeDelta += '<div>⚡ + ' + senderDeltaMood[1].toString() + '</div>'
      } else if (senderDeltaMood[1] < 0){
          strAttributeDelta += '<div>⚡ - ' + (-senderDeltaMood[1]).toString() + '</div>'
      } else {
          strAttributeDelta += '<div>⚡ = ' + senderDeltaMood[1].toString() + '</div>'
      }

      if (senderDeltaMood[2] > 0){
          strAttributeDelta += '<div>❤️ + ' + senderDeltaMood[2].toString() + '</div>'
      } else if (senderDeltaMood[2] < 0){
          strAttributeDelta += '<div>❤️ - ' + (-senderDeltaMood[2]).toString() + '</div>'
      } else {
          strAttributeDelta += '<div>❤️ = ' + senderDeltaMood[2].toString() + '</div>'
      }
      
      strAttributeDelta += '</div>'
      attributeDelta.outerHTML = strAttributeDelta;

      var patronusAttributeDelta = document.getElementById('patronusattributedelta');
      var strPatronusAttributeDelta = '<div id="patronusattributedelta" class="center">'

      if (receiverDeltaMood[0] > 0){
          strPatronusAttributeDelta += '<div>😊 + ' + receiverDeltaMood[0].toString() + '</div>'
      } else if (receiverDeltaMood[0] < 0){
          strPatronusAttributeDelta += '<div>😊 - ' + (-receiverDeltaMood[0]).toString() + '</div>'
      } else {
          strPatronusAttributeDelta += '<div>😊 = ' + receiverDeltaMood[0].toString() + '</div>'
      }

      if (receiverDeltaMood[1] > 0){
          strPatronusAttributeDelta += '<div>⚡ + ' + receiverDeltaMood[1].toString() + '</div>'
      } else if (receiverDeltaMood[1] < 0){
          strPatronusAttributeDelta += '<div>⚡ - ' + (-receiverDeltaMood[1]).toString() + '</div>'
      } else {
          strPatronusAttributeDelta += '<div>⚡ = ' + receiverDeltaMood[1].toString() + '</div>'
      }

      if (receiverDeltaMood[2] > 0){
          strPatronusAttributeDelta += '<div>❤️ + ' + receiverDeltaMood[2].toString() + '</div>'
      } else if (receiverDeltaMood[2] < 0){
          strPatronusAttributeDelta += '<div>❤️ - ' + (-receiverDeltaMood[2]).toString() + '</div>'
      } else {
          strPatronusAttributeDelta += '<div>❤️ = ' + receiverDeltaMood[2].toString() + '</div>'
      }
      strPatronusAttributeDelta += '</div>'
      patronusAttributeDelta.outerHTML = strPatronusAttributeDelta;

      attributeDelta = document.getElementById('attributedelta');
      console.log(attributeDelta)
      patronusAttributeDelta = document.getElementById('patronusattributedelta');
      console.log(patronusAttributeDelta)
      attributeDelta.classList.remove("attributeDelta"); 
      patronusAttributeDelta.classList.remove("attributeDelta"); 
      void attributeDelta.offsetWidth;
      void patronusAttributeDelta.offsetWidth;
      attributeDelta.classList.add("attributeDelta");
      patronusAttributeDelta.classList.add("attributeDelta");
    })
});