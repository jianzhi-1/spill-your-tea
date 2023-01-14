from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import sqlite3
import re

app = Flask(__name__)
CORS(app)

openAIEnabled = False
#openai.api_key = ""

def getAllMessage():
    args = request.args
    conn = sqlite3.connect('backend/db.db')
    cursor = conn.execute("""SELECT ID, NAME, ISPATRONUS, PATRONUS, MOOD, ENERGY, KINDNESS from USER""")
    userMap = dict()
    invUserMap = dict()
    for row in cursor:
        userMap[row[0]] = row[1]
        invUserMap[row[1]] = row[0]
    
    a = invUserMap[args["sender"]]
    b = invUserMap[args["receiver"]]
    cursor = conn.execute("""SELECT id, senderid, receiverid, time, content from MESSAGE WHERE senderid={} AND receiverid={} OR senderid={} AND receiverid={}""".format(a, b, b, a))
    content = []
    for row in cursor:
        content.append({
            "sender" : userMap[row[1]],
            "receiver" : userMap[row[2]],
            "content": row[4]
        })
    conn.close()
    return content

def getSomeMessage(sender, receiver):
    conn = sqlite3.connect('backend/db.db')
    cursor = conn.execute("SELECT ID,NAME,ISPATRONUS,PATRONUS, MOOD, ENERGY, KINDNESS from USER")
    userMap = dict()
    invUserMap = dict()
    for row in cursor:
        userMap[row[0]] = row[1]
        invUserMap[row[1]] = row[0]
    
    a = invUserMap[sender]
    b = invUserMap[receiver]

    cursor = conn.execute("""SELECT id, senderid, receiverid, time, content from MESSAGE WHERE senderid={} AND receiverid={} OR senderid={} AND receiverid={}""".format(a, b, b, a))
    content = []
    for row in cursor:
        content.append({
            "sender" : userMap[row[1]],
            "receiver" : userMap[row[2]],
            "content": row[4]
        })
    conn.close()
    return content

@app.route('/getMessage')
def getMessage():
    content = getAllMessage()
    resp = jsonify(content)
    return resp

def promptGen(ls, responder):
    prompt = """Here is a conversation between {} and {}\n""".format("ash", responder)
    for row in ls:
        prompt += """{}: {}\n""".format(row["sender"], row["content"])
    prompt += """{}:""".format(responder)
    return prompt

def complete(prompt):
    if openAIEnabled:
        completion = openai.Completion.create(engine="text-curie-001", prompt=prompt)
        app.logger.warning("in completion - {}".format(completion))
        return completion.choices[0].text
    else:
        return "i'm fine, the nap was good"

def insertMessage(msg, senderid, receiverid):
    conn = sqlite3.connect('backend/db.db')
    cursor = conn.execute("""SELECT MAX(ID) FROM MESSAGE""")
    maxid = 0
    for row in cursor:
        maxid = row[0]
    conn.execute("""INSERT INTO MESSAGE (ID, SENDERID, RECEIVERID, TIME, CONTENT) \
      VALUES ({}, {}, {}, '2023-01-14-16:59:34', "{}")""".format(maxid + 1, senderid, receiverid, msg))
    conn.commit()
    conn.close()

def extractNumber(s):
    x = re.findall("-?\d+", s)
    if len(x) == 0: return 0
    x = int(x[0])
    if x <= -10 or x >= 10: return 0
    return x


def promptGenStats(ls, person):

    prompt = """Here is a conversation between {} and {}\n""".format("ash", person)
    for row in ls:
        prompt += """{}: {}\n""".format(row["sender"], row["content"])
    prompt += """\n"""
    prompt += """\n"""
    prompt += """\n"""
    moodprompt = prompt +  """After this conversation, {}'s mood changed by (enter a number from -10 to 10):""".format(person)

    if openAIEnabled:
        moodcompletion = openai.Completion.create(engine="text-curie-001", prompt=moodprompt).choices[0].text
        app.logger.warning("mood completion - {}".format(moodcompletion))
    else:
        moodcompletion = """It increased by 2"""
    mooddelta = extractNumber(moodcompletion)
    
    energyprompt = prompt +  """After this conversation, {}'s energy changed by (enter a number from -10 to 10):""".format(person)
    if openAIEnabled:
        energycompletion = openai.Completion.create(engine="text-curie-001", prompt=energyprompt).choices[0].text
        app.logger.warning("energy completion - {}".format(energycompletion))
    else:
        energycompletion = """-3"""
    energydelta = extractNumber(energycompletion)

    kindnessprompt = prompt + """After this conversation, {}'s kindess changed by (enter a number from -10 to 10):""".format(person)
    if openAIEnabled:
        kindnesscompletion = openai.Completion.create(engine="text-curie-001", prompt=kindnessprompt).choices[0].text
        app.logger.warning("kindness completion - {}".format(kindnesscompletion))
    else:
        kindnesscompletion = """delta 2"""
    kindnessdelta = extractNumber(kindnesscompletion)

    return mooddelta, energydelta, kindnessdelta

def isPatronus(person):
    conn = sqlite3.connect('backend/db.db')
    cursor = conn.execute("""SELECT ID, NAME, ISPATRONUS, PATRONUS, MOOD, ENERGY, KINDNESS from USER""")
    for row in cursor:
        if row[1] == person:
            conn.close()
            return int(row[2]) == 1
    conn.close()
    return False

def updateStats(name, deltamood, deltaenergy, deltakindness):
    conn = sqlite3.connect('backend/db.db')
    cursor = conn.execute("""SELECT ID, NAME, ISPATRONUS, PATRONUS, MOOD, ENERGY, KINDNESS from USER""")
    curmood = -1000
    curenergy = -1000
    curkindness = -1000
    for row in cursor:
        if row[1] == name:
            curmood = int(row[4])
            curenergy = int(row[5])
            curkindness = int(row[6])
    if curmood == -1000:
        return
    curmood += deltamood
    curmood = min(100, curmood)
    curmood = max(0, curmood)

    curenergy += deltaenergy
    curenergy = min(100, curenergy)
    curenergy = max(0, curenergy)

    curkindness += deltakindness
    curkindness = min(100, curkindness)
    curkindness = max(0, curkindness)

    cursor = conn.execute("""UPDATE USER SET mood={}, energy={}, kindness={} WHERE name='{}'""".format(curmood, curenergy, curkindness, name))
    conn.commit()
    conn.close()
    return curmood, curenergy, curkindness

def getId(sendername, receivername):
    conn = sqlite3.connect('backend/db.db')
    cursor = conn.execute("""SELECT ID, NAME, ISPATRONUS, PATRONUS, MOOD, ENERGY, KINDNESS from USER""")
    userMap = dict()
    invUserMap = dict()
    for row in cursor:
        userMap[row[0]] = row[1]
        invUserMap[row[1]] = row[0]
    
    a = invUserMap[sendername]
    b = invUserMap[receivername]
    conn.close()
    return a, b

@app.route('/sendMessage', methods = ['POST'])
def sendResponse():
    data = request.json
    app.logger.info("received {}".format(data['name']))
    resp = jsonify(success=True)
    resp.headers.add("Access-Control-Allow-Origin", "*")

    senderid, receiverid = getId(data['sender'], data['receiver'])
    insertMessage(data['name'], senderid, receiverid)

    curlist = getSomeMessage(data['sender'], data['receiver'])
    
    prompt = promptGen(curlist, data['receiver']) # need to do if else here
    completion = complete(prompt)

    # insert to DB
    curlist.append({
        "sender":data['receiver'],
        "receiver":data['sender'],
        "content":completion
    })
    insertMessage(completion, receiverid, senderid)

    senderMood = [0, 0, 0]
    receiverMood = [0, 0, 0]
    receiverDeltaMood = [0, 0, 0]
    senderDeltaMood = [0, 0, 0]
    # update attribute values
    if not isPatronus(data['sender']):
        deltamood, deltaenergy, deltakindness = promptGenStats(curlist, data['sender'])
        senderDeltaMood = [deltamood, deltaenergy, deltakindness]
        deltamood, deltaenergy, deltakindness = updateStats(data['sender'], deltamood, deltaenergy, deltakindness)
        senderMood = [deltamood, deltaenergy, deltakindness]
        # update

    if not isPatronus(data['receiver']):
        deltamood, deltaenergy, deltakindness = promptGenStats(curlist, data['receiver'])
        receiverDeltaMood = [deltamood, deltaenergy, deltakindness]
        deltamood, deltaenergy, deltakindness = updateStats(data['receiver'], deltamood, deltaenergy, deltakindness)
        receiverMood = [deltamood, deltaenergy, deltakindness]
        # update

    # return new list for update on the frontend
    resp = jsonify({
        "list": curlist,
        "senderMood": senderMood,
        "receiverMood": receiverMood,
        "senderDeltaMood": senderDeltaMood,
        "receiverDeltaMood": receiverDeltaMood
    })
    return resp

if __name__ == '__main__':
    app.run(debug=True)