var onCall = false;
var device;

console.log("Requesting Access Token...");

$(document).ready(function() {
  $.get("/createToken")
    .then(function(data) {

      // Setup Twilio.Device
      device = new Twilio.Device(data, {
        enableRingingState: true,
        codecPreferences: ["opus", "pcmu"],
        fakeLocalDTMF: true,
        allowIncomingWhileBusy: true,
        debug: true,
        warnings: true
      });

      device.on("ready", function(device) {
        console.log("Twilio.Ready");
        checkStatus();
      });

      device.on("error", function(error) {
        console.log("Twilio.Device Error: " + error.message);
        checkStatus();
      });

      device.on("connect", function(conn) {
        console.log("In call with ");
        onCall = true;
        hangupButton();
        checkStatus();
      });

      device.on("disconnect", function(conn) {
        console.log("Disconnect");
        onCall = false;
        enableButton();
        checkStatus();
      });

      device.on("incoming", function(conn) {
        console.log("Incoming support call");
        incomingButton();
        checkStatus();
      });
      
    })
    .catch(function(err){
      console.log(err);
      console.log("Could not get a token from server!");
    })
});

/* Ação da <Div> que retorna o status da chamada */
function checkStatus(){
  console.log('function checkStatus() executado.');
  var status = device.status();
  updateText(status);
}

/* Função para reescrever a barra de status */
function updateText(status) {
  document.getElementById("status").textContent=status;
}

/* Função que controla o botão de iniciar discagem */
$("#call").on('click', function(){

  // Caso o cliente não esteja em chamada, apertar o botão de ligar irá enviar os parametros da chamada
  if (onCall === false){
    disableButton();

    var destino = document.getElementById("stringDestino").textContent;
    var destinoFormatado = "+" + destino;
    var params = {"phoneNumber": destinoFormatado};
    device.connect(params);

  } 
  else {
    device.disconnectAll();
  }

});

/* As funções a seguir alteram a cor do botão phone. */

function disableButton(){
  $('#call').css("background-color","grey");
}

function enableButton(){
  $('#call').css("background-color","green");
}

function hangupButton(){
  $('#call').css("background-color","red");
}

function incomingButton(){
  $('#call').css("background-color","blue");
}

/* Ação do botão de mutar chamada */
$("#mute").on('click', function(){
  console.log("Mudo ativado.");
  device.activeConnection().mute(true);
});

/* Ação do botão de limpar o número */ 
$('#clear').on('click', function() {
  document.getElementById("stringDestino").textContent='';
});

/* Ação dos digitos numéricos do diapad */
$(".digito").on('click', function() {

  // A variável abaixo coleta o valor de dentro dos <span>s "digitos". 
  numInput = $(this).text();

  // A variavel abaixo coleta o valor atual dos digitos no "visor".
  stringDestino = document.getElementById("stringDestino");

  // Aqui garantimos que a string tenha no mázimo 15 digitos (começa em 0)
  if (stringDestino.textContent.length < 15){
   stringDestino.textContent = stringDestino.textContent + numInput;
  }

});

