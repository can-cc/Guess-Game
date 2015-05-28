from flask import Flask, request, redirect, url_for, send_from_directory
import redis
import hashlib
import json

app = Flask(__name__, static_url_path='/static', static_folder='dest')

setting = {
    'db_host': 'localhost',
    'db_port': 6379,
    'scheme': 'GuessGameEntity'
}

r = redis.StrictRedis(host='localhost', port=6379, db=0)

@app.route('/')
def root():
    return app.send_static_file('index.html')


def hello():
    return u'Hello, I\' m Yes or No Guess-Game Server,' + \
           u' Dont\' attack me ^_^'

@app.route('/entity', methods=['POST'])
def postEntity():
    try:
        print request.form
        questionKey = hashlib.md5(request.form['question']).hexdigest()
        parentEntity = json.loads(r.hget(setting['scheme'], request.form['figureKey']))
        thinkingKey = hashlib.md5(request.form['thinkingThing']).hexdigest()
        parentEntity['nopeKey'] = questionKey
        print parentEntity
        print json.dumps(parentEntity)
        r.hset(setting['scheme'], request.form['figureKey'], json.dumps(parentEntity))
        r.hset(setting['scheme'], questionKey, json.dumps({
            'question': request.form['question'],
            'isLeaf': 'false',
            'parent': request.form['figureKey'],
            'yesKey': thinkingKey,
            'nopeKey': 'null'
        }))
        r.hset(setting['scheme'], thinkingKey, json.dumps({
            'object': request.form['thinkingThing'],
            'isLeaf': 'true',
            'parent': questionKey,
            # 'yesKey': 'null', Object Leaf Node needn't yesKey beacuse yes will won
            'nopeKey': 'null'
        }))
        return json.dumps({'success': 'thank you for you knowledge!'})
    except:
        return json.dumps({'error': 'nuknown!'})


@app.route('/entity', methods=['GET'])
def getEntity():
    entityKey = request.args.get('key')
    print entityKey
    if(entityKey == 'null'):
        return json.dumps({'miss': 'not found'})
    return r.hget(setting['scheme'], entityKey)



if __name__ == '__main__':
    app.debug = True
    app.run('0.0.0.0')
