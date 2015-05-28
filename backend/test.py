import app
import unittest

class APPTest(unittest.TestCase):
    def setUp(self):
        self.app = app.app.test_client()

    def test_hello(self):
        rv = self.app.get('/')
        print rv.data

    def test_getEntityRoot(self):
        rv = self.app.get('/entity?key=root')
        print rv.data

if __name__ == '__main__':
        unittest.main()
