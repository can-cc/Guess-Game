import redis
import json

setting = {
    'db_host': 'localhost',
    'db_port': '6379',
    'scheme': 'GuessGameEntity'
}

r = redis.StrictRedis(host='localhost', port=6379, db=0)

def initDB():
    #insert root key
    r.hset(setting['scheme'], 'root', json.dumps({
        'isLeaf': 'false',
        'question': 'Is a thing?',
        'yesKey': 'bro',
        'nopeKey': 'sister',
        'parent': 'null',
    }))
    r.hset(setting['scheme'], 'bro', json.dumps({
        'isLeaf': 'true',
        'object': 'Rock',
        'yesKey': "null",
        'nopeKey': "null",
        'parent': 'root'
    }))
    r.hset(setting['scheme'], 'sister', json.dumps({
        'isLeaf': 'true',
        'object': 'Dog',
        'yesKey': 'null',
        'nopeKey': 'null',
        'parent': 'root'
    }))

if __name__ == '__main__':
    initDB()
    print 'successful'
