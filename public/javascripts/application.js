$(document).ready(function(){
  var socket;
  
  $('#dialog').hide();
  
  $('#start').click(function(){
      socket = io.connect('http://localhost:3000');
      socket.emit('register_user', $('#username').val());
      
      socket.on('get_users', function(data) {
        updateUsers(data);
      });
      
      socket.on('pastie', function (data) {
        promptPastie(data);
      });
  });
  
  $('#send').click(function(){
    socket.emit('send_pastie', {pastie: $('#pastie').val(), user: $('#users').val()});
  });
  
  function promptPastie(data) {
    $('#message').text(data.message);
    $('#pastie_content').text(data.pastie);
    $('#pastie_content').css('background-color', '#FFFFFF');
    $('#dialog').dialog();
    $('#copy').zclip({
      path:'flash/ZeroClipboard.swf',
      copy:$('#pastie_content').val(),
      afterCopy: function() {$('#pastie_content').css('background-color', '#CCFFCC'); }
    });
  }
  
  function updateUsers(data)
  {
    $('#users').html('');
    for (var i=0; i<data.length; i++) {
        $('#users').append(
            $('<option></option>').val(data[i]).html(data[i])
        );
    }
  }
});
