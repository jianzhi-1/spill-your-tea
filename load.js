fetch('http://localhost:5000/getMessage')
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    var obj = document.getElementById('chatbox');
    var str = '<div id="chatbox" class="imessage">'
    for (var i in data){
        str += '<div class="flex-container">'
        str += '<div class="sendername flex-child">'
        str += data[i].sender
        str += ':'
        str += '</div>'
        str += '<div class="contentname flex-child">'
        str += '<p class="from-them">'
        str += data[i].content
        str += '</p>'
        str += '</div>'
        str += '</div>'
    }
    str += '</div>'
    obj.outerHTML=str;
  });