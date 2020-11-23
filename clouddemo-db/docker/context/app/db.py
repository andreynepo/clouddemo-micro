from __future__ import print_function

import os
import cx_Oracle
import requests
import socket
import datetime
import json
import io
import logging
import sys

#import httplib2

from flask import Flask, request, Response, abort, jsonify, url_for, redirect
#from flask_cors import CORS

app = Flask(__name__)
#CORS (app)

try:
    dbuser = os.environ['DBUSER']
except:
    dbuser="demo"

try:
    dbpw = os.environ['DBPW']
except:
    dbpw="myWSPassword_01"

try:
    connstr=os.environ['CONNSTR']
except:
    connstr="clouddemo_tp"

try:
    db_id=os.environ['DBID']
except:
    db_id=""

try:
    wallet_folder=os.environ['TNS_ADMIN']
except:
    wallet_folder="/opt/oracle/instantclient_19_8/network/admin/"

os.environ['ORACLE_HOME'] = os.path.abspath(os.path.join(wallet_folder, '../..'))
signer = oci.auth.signers.InstancePrincipalsSecurityTokenSigner()
db_client = oci.database.DatabaseClient({}, signer=signer)
wallet_password="Wallet123"

def get_wallet(db_client, atp_id, password):
    atp_wallet = oci.database.models.GenerateAutonomousDatabaseWalletDetails()
    atp_wallet.password = wallet_password

    atp_wallet_response = db_client.generate_autonomous_database_wallet(
        autonomous_database_id = atp_id,
        generate_autonomous_database_wallet_details = atp_wallet,
    )

    output = io.BytesIO ()

    for data in atp_wallet_response.data:
        output.write (data)

    with ZipFile(output, 'r') as zipObj:
        zipObj.extractall(wallet_folder)

def dbconnect (dbuser, dbpw, connstr):
    if not (os.path.isfile(os.path.join(wallet_folder, 'tnsnames.ora'))):
        get_wallet(db_client, db_id, wallet_password)

    cx_Oracle.init_oracle_client(config_dir=wallet_folder)

    connection = cx_Oracle.connect(dbuser, dbpw, connstr, encoding="UTF-8")
    return connection

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

connection = dbconnect(dbuser, dbpw, connstr)

hostname = socket.gethostname()

def now ():
    return datetime.datetime.now ().strftime ('%Y-%m-%d %H:%M:%S')

def dbcheck (connection):
    try:
        connection.ping ()
    except:
         connection = dbconnect(dbuser, dbpw, connstr)
    return connection

@app.route('/db/v1/list', methods=['GET', 'POST'])
def getlist():

    if request.method == 'POST':
        content=request.get_json()

        try:
            token = content['token']
        except:
            token = ""
    else:
        try:
            token = request.args.get ('token')
        except:
            token = ""

    print (hostname, now (), '/db/v1/list: Token:', token, file=sys.stderr)
    
    cursor = dbcheck (connection).cursor()
    table = cursor.execute ("SELECT id, hostname, filename, link, text, duration, ipaddr FROM ocr WHERE token=:token ORDER BY ID DESC FETCH NEXT 10 ROWS ONLY", token=token)
    rows = [dict((cursor.description[i][0], value) \
               for i, value in enumerate(row)) for row in cursor.fetchall()]

    if not rows:
        rows = [dict ({"ID": 0, "HOSTNAME": "", "FILENAME" : "", "LINK": "", "TEXT": "", "DURATION": "", "IPADDR": ""})]

    print (hostname, now (), '/db/v1/list: Returning', table.rowcount, 'rows.', file=sys.stderr)
    json_data = json.dumps (rows, indent=4)

    return Response (json_data, mimetype='application/json')

@app.route('/db/v1/gettext', methods=['GET', 'POST'])
def gettext():

    if request.method == 'POST':
        content=request.get_json()

        try:
            token = content['token']
        except:
            token = ""
    else:
        try:
            token = request.args.get ('token')
        except:
            token = ""

    cursor = dbcheck (connection).cursor()
    cursor.execute("SELECT id, text FROM ocr WHERE token=:token ORDER BY ID DESC FETCH NEXT 10 ROWS ONLY", token=token)

    fulltext = ""
    for row in cursor.fetchall ():
        fulltext = fulltext + ' ' + str (row [1])
    
    data = {'text': fulltext}

    print (hostname, now (), '/db/v1/gettext: Text len', len (fulltext), file=sys.stderr)

    json_data = json.dumps (data)
    return Response (json_data, mimetype='application/json')


@app.route('/db/v1/insert', methods=['POST'])
def insert():
    try:
        content = json.loads (request.get_json())
        cursor = dbcheck (connection).cursor()

        cursor.execute("INSERT INTO ocr (hostname, finished, starttime, endtime, duration, text, filename, token, link, ipaddr, useragent) VALUES (:hostname, 1, TO_DATE (:starttime, 'YYYY-MM-DD HH24:MI:SS'), TO_DATE (:endtime, 'YYYY-MM-DD HH24:MI:SS'), :duration, :text, :filename, :token, :link, :ipaddr, :useragent)", \
            hostname=content['hostname'], starttime=content['starttime'], endtime=content['endtime'], duration=content['duration'], text=content['text'], filename=content['filename'], token=content['token'], link=content['link'], ipaddr=content['ipaddr'], useragent=content['useragent'])
        connection.commit ()

        print (hostname, now (), '/db/v1/insert: Inserting row.', file=sys.stderr)
        return "OK", 200
    except:
        print (hostname, now (), '/db/v1/insert: Inserting row failed.', file=sys.stderr)
        return "Error", 500



if __name__ == "__main__":
    app.run(host = '0.0.0.0', port = 8080)
