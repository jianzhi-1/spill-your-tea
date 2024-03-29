fetch('http://localhost:5000/getMessage?sender=ash&receiver=pikachu')
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    var obj = document.getElementById('chatbox');
    var str = '<div id="chatbox" class="imessage">'
    for (var i = data.length - 1; i >= 0; i--){
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
  });