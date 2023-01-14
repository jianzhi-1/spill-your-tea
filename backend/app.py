# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import sqlite3
 
# Flask constructor takes the name of
# current module (__name__) as argument.
app = Flask(__name__)
CORS(app)
 
# The route() function of the Flask class is a decorator,
# which tells the application which URL should call
# the associated function.
@app.route('/')
# ‘/’ URL is bound with hello_world() function.
def hello_world():
    return 'Hello World THERE'

def getAllMessage():
    conn = sqlite3.connect('db.db')
    cursor = conn.execute("SELECT ID,NAME,ISPATRONUS,PATRONUS,ENERGY,INQUISITIVENESS, KINDNESS from USER")
    userMap = dict()
    for row in cursor:
        userMap[row[0]] = row[1]

    cursor = conn.execute("SELECT id, senderid, receiverid, time, content from MESSAGE")
    content = []
    for row in cursor:
        content.append({
            "sender" : userMap[row[1]],
            "receiver" : userMap[row[2]],
            "content": row[4],
            "time": row[3]
        })
    conn.close()
    return content

def getSomeMessage():
    conn = sqlite3.connect('db.db')
    cursor = conn.execute("SELECT ID,NAME,ISPATRONUS,PATRONUS,ENERGY,INQUISITIVENESS, KINDNESS from USER")
    userMap = dict()
    for row in cursor:
        userMap[row[0]] = row[1]

    cursor = conn.execute("SELECT id, senderid, receiverid, time, content from MESSAGE")
    content = []
    for row in cursor:
        content.append((userMap[row[1]], row[4]))
    conn.close()
    return content

@app.route('/getMessage')
def getMessage():
    content = getAllMessage()

    resp = jsonify(content)
    return resp

@app.route('/resource', methods = ['POST'])
def getResponse():
    #data = request
    #app.logger.info(request.form)
    #app.logger.info(request.data)
    #app.logger.info(request.values)
    #app.logger.info(request.json)
    app.logger.info("received {}".format(request.json['name']))
    #app.logger.info(data)
    resp = jsonify(success=True)
    resp.headers.add("Access-Control-Allow-Origin", "*")
    return resp

def promptGen(ls, responder):
    app.logger.info("beginning initialization")

    prompt = "Here is a conversation between {} and {}\n".format("jianzhi", responder)
    
    for name, content in ls:
        prompt += "{}: {}".format(name, content)
    prompt += "{}:".format(responder)
    app.logger.info("completed prompt: ", prompt)
    return prompt

def complete(prompt):
    return "i'm fine, the nap was good"
    completion = openai.Completion.create(engine="text-curie-001", prompt=prompt)
    return completion.choices[0].text

def insertMessage(msg):
    conn = sqlite3.connect('db.db')
    cursor = conn.execute("SELECT MAX(ID) FROM MESSAGE")
    maxid = 0
    for row in cursor:
        maxid = row[0]
    conn.execute("INSERT INTO MESSAGE (ID, SENDERID, RECEIVERID, TIME, CONTENT) \
      VALUES ({}, 2, 1, '2023-01-14-16:59:34', '{}')".format(maxid + 1, msg))
    conn.close()

@app.route('/sendMessage', methods = ['POST'])
def sendResponse():
    app.logger.info("received {}".format(request.json['name']))
    resp = jsonify(success=True)
    resp.headers.add("Access-Control-Allow-Origin", "*")

    curlist = getSomeMessage()
    
    curlist.append(("jianzhi", request.json['name']))
    app.logger.info("curlist ", curlist)
    prompt = promptGen(curlist, "pikachu")
    completion = complete(prompt)

    # insert to DB
    curlist.append(("pikachu", completion))
    #insertMessage(completion)

    # update attribute values
    ### STRETCH GOAL

    # return new list for update on the frontend
    resp = jsonify(curlist)
    return resp

 
# main driver function
if __name__ == '__main__':
 
    # run() method of Flask class runs the application
    # on the local development server.
    app.run(debug=True)