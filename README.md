This is my first development project and you ARE GOING TO FIND bad programming pratices. I'm sorry about that, please help me increase my development skills by sharing suggestions / reporting bugs. Enough talk, let's check the requisites to start using the extension.

The Flask server have two endpoints to this service: /createToken, /connectCall.

Create an API key, which will allow our extension connecting with Twilio: https://www.twilio.com/console/voice/settings/api-keys/create. Store both Key SID (SKXXXXXXXXXXXXXXXXXXX) and the API Secret before the next step.

Go to https://www.twilio.com/console/phone-numbers/ and select the number that you want to use to receive incoming calls in your extension. In the field "A CALL COMES IN", change to function, select the service you just created and in the "FUNCTION PATH" field select the /incomingCall endpoint.

Go back to the service page. Now we'll create four environment variables that will grant some data to our application at Twilio's side:

KEY: CALLER_ID VALUE: +111111111111111

KEY: APP_SID VALUE: APXXXXXXXXXXXXXXXXXXXXXXX

KEY: API_SECRET VALUE: XXXXXXXXXXXXXXXXXXXXXXXXXX

KEY: API_KEY VALUE: SKXXXXXXXXXXXXXXXXXXXXXXXXX

