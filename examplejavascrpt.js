
{/* 在html用<script src="路徑去連接"></script> */}

$('#login-form').submit(function(e) {
  e.preventDefault();
  var username = $('#username').val();
  var password = $('#password').val();
  $.post('/login', { username: username, password: password }, function(data) {
      if (data.result) {
          $('#result').text(data.result);
      } else {
          $('#data-form').show();
      }
  });
});

$('#data-form').submit(function(e) {
  e.preventDefault();
  var a = $('#a').val();
  var b = $('#b').val();
  $.post('/calculate', { a: a, b: b }, function(data) {
      $('#result').text(data.result);
  });
});
