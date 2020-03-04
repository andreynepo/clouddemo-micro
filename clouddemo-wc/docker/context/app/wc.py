import wordcloud
import socket
import datetime
import io
import logging
import sys
import random

from flask import Flask, request, Response
from wordcloud import WordCloud

app = Flask(__name__)

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

hostname = socket.gethostname()

def now ():
    return datetime.datetime.now ().strftime ('%Y-%m-%d %H:%M:%S')

def color_func (word, font_size, position, orientation, random_state=None, **kwargs):
    red = random.randint (40, 100)
    green = random.randint (0, 40)
    blue = random.randint (0, 40)
    return "rgb(%d%%, %d%%, %d%%)" % (red, green, blue)

def genwordcloud (fulltext):
    try:
        wordcloud = WordCloud (max_font_size=60, max_words=30, background_color="white", collocations=False).generate(fulltext)
        wordcloud.recolor (color_func=color_func, random_state=3)
        image = wordcloud.to_image ()
        output = io.BytesIO ()
        image.save (output, format="PNG")
        print (hostname, now(), '/wordcloud: Generated wordcloud image.', file=sys.stderr)
        return output.getvalue ()
    except:
        print (hostname, now(), '/wordcloud: Error generating wordcloud image.', file=sys.stderr)
        return None


@app.route('/wordcloud', methods=['POST'])
def wordcloud ():
    content = request.get_json()
    fulltext = content['text']
    return Response (genwordcloud (fulltext), mimetype="image/png")

if __name__ == "__main__":
    app.run(host = '0.0.0.0', port = 8080)
