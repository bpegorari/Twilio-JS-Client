
var teste;

/* Função auxiliar para reescrever a barra de status */
function updateText(status) {
  document.getElementById("status").textContent=status;
}

console.log("Requesting Access Token...");

$(document).ready(function() {
  $.get("/createToken")
    .then(function(data) {

      // Setup Twilio.Device
      device = new Twilio.Device(data, {});

      teste = device;

      device.on("ready", function(device) {
        console.log("Twilio.Ready");
        checkStatus()
      });

      device.on("error", function(error) {
        console.log("Twilio.Device Error: " + error.message);
        checkStatus()
      });

      device.on("connect", function(conn) {
        console.log("In call with ");
        checkStatus();
      });

      device.on("disconnect", function(conn) {
        console.log("Disconnect");
        checkStatus()
      });

      device.on("incoming", function(conn) {
        console.log("Incoming support call");
        checkStatus()
      });
      
    })
    .catch(function(err){
      console.log(err);
      console.log("Could not get a token from server!");
    })
});

/* Ação da <Div> que retorna o status da chamada - invocado no HTML */
function checkStatus(){
  console.log('function checkStatus() invoked.');
  var status = device.status();
  updateText(status);
}

/* Ação do botão de realizar chamada - invocado no HTML */
function placeCall() {
  var destino = document.getElementById("output").textContent;
  var destinoFormatado = "+" + destino;
  var params = {"phoneNumber": destinoFormatado};
  device.connect(params);
}

/* Ação do botão de encerrar chamada - invocado no HTML */
function endCall() {
  console.log("Encerrar chamada.");
  device.disconnectAll();
}

/* Ação do botão de mutar chamada - invocado no HTML */
function muteCall() {
  console.log("Mudo ativado.");
  device.activeConnection().mute(true);
}

/* Abaixo está o código do dial pad */
var count = 0;

$(".digit").on('click', function() {
  var num = ($(this).clone().children().remove().end().text());
  if (count < 13) {
    $("#output").append('<span>' + num.trim() + '</span>');

    count++
  }
});

$('.fa-long-arrow-left').on('click', function() {
  $('#output span:last-child').remove();
  count--;
});