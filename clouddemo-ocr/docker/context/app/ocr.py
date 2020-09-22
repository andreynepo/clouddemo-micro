from __future__ import print_function

import os
import requests
import socket
import time
import datetime
from datetime import date
import json
import oci
import io
import pytesseract
#import PIL
import logging
import sys

#import httplib2

from flask import Flask, request, Response, abort, jsonify
#from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
#CORS (app)

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

hostname = socket.gethostname()

microtime = lambda: int(round(time.time() * 1000))

os.environ['OMP_THREAD_LIMIT'] = '1'

config = oci.config.from_file(file_location="../.oci/config")
compartment_id = config["tenancy"]
#compartment_id = "ocid1.compartment.oc1..aaaaaaaaaphk36ry5vghub24nzdnwuy3chkm4t26mejxf4ah6rufy3fw2ywa"
#signer = oci.auth.signers.get_resource_principals_signer()
object_storage = oci.object_storage.ObjectStorageClient(config)
#object_storage = oci.object_storage.ObjectStorageClient({}, signer=signer)
namespace = object_storage.get_namespace().data
bucket_name = "clouddemo-public"
object_name = ""
#downloadLink="https://objectstorage.eu-frankfurt-1.oraclecloud.com/n/cloudstarscee/b/clouddemo-public/o/"
downloadLink="https://objectstorage.eu-frankfurt-1.oraclecloud.com/n/" + namespace + "/b/" + bucket_name + "/o/"

def getDownloadLink (namespace, bucket):
    return "https://objectstorage.eu-frankfurt-1.oraclecloud.com/n/" + namespace + "/b/" + bucket + "/o/"

def now ():
    return datetime.datetime.now ().strftime ('%Y-%m-%d %H:%M:%S')

@app.route('/ocr', methods=['POST'])
def ocr():
    content=request.get_json()

    fileName = content['filename']
    bucketName = content['bucket']

    startmtime = microtime()
    obj = object_storage.get_object(namespace, bucketName, fileName)
    input_file = io.BytesIO ()
    input_file.write (obj.data.content)

    input_image = Image.open (input_file)
    endmtime = microtime()
    duration = round ((endmtime - startmtime) / 1000, 3)

    print (hostname, now(), '/api/v1/ocr: Reading image from object storage:', duration, 's.', file=sys.stderr)

    startmtime = microtime()

    if input_image:
        print (hostname, now(), '/api/v1/ocr: Image size:', input_image.width, input_image.height, file=sys.stderr)

        text = (pytesseract.image_to_string (input_image, config = '--psm 1', lang='eng+rus'))

        endmtime = microtime()
        duration = round ((endmtime - startmtime) / 1000, 3)

        print (hostname, now(), '/api/v1/ocr: Recognized text:', len (text), 'bytes,', duration, 's.', file=sys.stderr)

        data = {'text': text}

        json_data = json.dumps (data)

        return Response (json_data, mimetype='application/json')

    else:
        print (hostname, now(), '/api/v1/ocr: Error processing image: not an image.', file=sys.stderr)
        return ('Error', 500)

    input_image.close()
    input_file.close()

#    return "OK", 200

if __name__ == "__main__":
    app.run(host = '0.0.0.0', port = 8080)
