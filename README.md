This is my first development project and YOU ARE GOING TO FIND bad programming pratices. I'm sorry about that, please help me increase my development skills by sharing suggestions / reporting bugs. Enough talk, let's check the requisites to start using the extension.

The Flask server have two endpoints: /createToken, /connectCall.

The /createToken endpoint will be requested at javascript.js.
The /connectCall endpoint must be configured into a TwiML Application: https://www.twilio.com/console/voice/twiml/apps/create. 

Create an API key, which will allow the client connecting with Twilio: https://www.twilio.com/console/voice/settings/api-keys/create. Store both Key SID (SKXXXXXXXXXXXXXXXXXXX) and the API Secret before the next step.


Create four environment variables that will feed some data to server.py. Use the SIDs you created above.

export CALLER_ID=+111111111111111

export APP_SID=APXXXXXXXXXXXXXXXXXXXXXXX

export API_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXX

export API_KEY=SKXXXXXXXXXXXXXXXXXXXXXXXXX

IMPORTANT: IF YOU WANT TO RECEIVE INCOMING CALLS, YOU MUST CREATE A TWIML BIN OR ANOTHER ENDPOINT WITH THE FOLLOWING INSTRUCTIONS:

<Response>
  <Dial><Client>*here you will add your client identity name, found in server.py*</Client></Dial>
</Response>


