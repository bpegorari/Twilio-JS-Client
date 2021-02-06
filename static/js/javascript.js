var device;
var incomingConnection; //Foi necessário declarar esta variavel para armazenar uma chamada recebida no escopo global, fora do handler device incoming


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
        enableHangupCallButton();
        checkStatus();
      });

      device.on("disconnect", function(conn) {
        console.log("Disconnect");
        enablePlaceAcceptCallButton();
        disableHangupCallButton();
        checkStatus();
      });

      device.on("incoming", function(conn) {
        console.log("Incoming support call");
        enableIncomingCallButton();
        enableHangupCallButton();
        incomingConnection = conn;
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
  var status = device.status();
  updateText(status);
}

/* Função para reescrever a barra de status */
function updateText(status) {
  document.getElementById("status").textContent=status;
}

/* Função que controla o botão de iniciar/antemner chamada */
$("#call").on('click', function(){
  // Ao ser clicado, botão será desabitado
  disablePlaceAcceptCallButton();

  //Caso haja uma incoming connection, a chamada será atendida. Caso constrário, o client fará uma discagem com os valores no cmapo de inpu
  if (incomingConnection){
    incomingConnection.accept();
    incomingConnection = '';
  } 
  else {
    var destino = document.getElementById("stringDestino").textContent;
    var destinoFormatado = "+" + destino;
    var params = {"phoneNumber": destinoFormatado};
    device.connect(params);
  }

});

/* Função que controla o botão de encerrar chamada, tanto para chamadas realizadas quanto para chamadas recebidas */
$("#hangup").on('click', function(){

  if (incomingConnection){
    incomingConnection.reject();
    incomingConnection = '';
    enablePlaceAcceptCallButton();
    disableHangupCallButton();
  } else {
    device.disconnectAll();
    enablePlaceAcceptCallButton();
  }

});

/* Funções a seguir alteram a cor e a disponibilidade dos botões de controle de chamada. */

function enablePlaceAcceptCallButton(){
  $('.call').css("background-color","green");
  $('.call').attr("disabled", false);
}

function disablePlaceAcceptCallButton(){
  $('.call').css("background-color","grey");
  $('.call').attr("disabled", true);
}

function enableIncomingCallButton(){
  $('.call').css("background-color","blue");
}

function enableHangupCallButton(){
  $('.hangup').css("background-color","red");
  $('.hangup').attr("disabled", false);
}

function disableHangupCallButton(){
  $('.hangup').css("background-color","grey");
  $('.hangup').attr("disabled", true);
}

function triggerMuteButton(){
  if (device.activeConnection().isMuted() == false){
    document.getElementById("muteImg").className='fas fa-volume-mute';
    device.activeConnection().mute(true);
  } else {
    document.getElementById("muteImg").className='fas fa-volume-up';
    device.activeConnection().mute(false);
  }
}

/* Ação do botão de mutar chamada */
$("#mute").on('click', function(){
  triggerMuteButton();
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

