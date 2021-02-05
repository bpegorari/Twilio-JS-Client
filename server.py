import os
from flask import Flask, render_template, request
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VoiceGrant
from twilio.twiml.voice_response import Dial, VoiceResponse
from dotenv import load_dotenv


account_sid = os.getenv("ACCOUNT_SID")
api_key = os.getenv("API_KEY")
api_secret = os.getenv("API_SECRET")

app = Flask(__name__)
app.static_folder = 'static'

@app.route('/client', methods=['GET'])
def client():
    return render_template('index.html')

@app.route('/createToken', methods=['GET'])
def get_token():
    # required for Voice grant
    outgoing_application_sid = os.getenv("APP_SID")

    # Create access token with credentials
    token = AccessToken(account_sid, api_key, api_secret, identity="teste")

    # Create a Voice grant and add to token
    voice_grant = VoiceGrant(outgoing_application_sid=outgoing_application_sid)
    token.add_grant(voice_grant)
    return (token.to_jwt())

@app.route('/connectCall', methods=['POST'])
def connectCall():
    destino = request.form.get("phoneNumber")
    response = VoiceResponse()
    response.dial(destino, caller_id='+14708656214')
    return str(response)

if __name__ == "__main__":
    app.run(debug=True)
