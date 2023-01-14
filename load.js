fetch('http://localhost:5000/getMessage')
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    var obj = document.getElementById('chatbox');
    var str = '<div id="chatbox">'
    for (var i in data){
        str += '<div>'
        str += data[i].sender
        str += ':'
        str += data[i].content
        str += '</div>'
    }
    str += '</div>'
    obj.outerHTML=str;
  });