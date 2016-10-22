// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs

//= require_tree .

$(document).ready(function() {
  if (Modernizr.getusermedia) {
    // Configure user media
    var gumPromise = navigator.mediaDevices.getUserMedia({
      video: {
        width: {
          ideal: 320
        },
        height: {
          ideal: 320
        },
        facingMode: 'user'
      }
    });

    // Start streaming the video
    gumPromise.then(function(mediaStream) {
      var video = document.querySelector('video');
      video.srcObject = mediaStream;
      video.onloadedmetadata = function() {
        video.play();
      };
    }).catch(function(err) {
      alert(err);
    });

    // Capture the screenshot
    $('#capture-btn').click(function() {
      var video = document.getElementById('video');
      var canvas = document.getElementById('canvas');
      var photo = document.getElementById('photo');

      var context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      var data = canvas.toDataURL('image/png');

      photo.setAttribute('src', data);
      $('#video').hide();
      $('#capture-btn').hide();
      $('#photo').show();
      $('#form').show();
    });

    // Submit the screenshot
    $('#form').submit(function(event) {
      var photo = document.getElementById('photo');
      var payload = {
        entry: {
          twitter: $('#twtter-handle').val(),
          photo: photo.src
        }
      };
      $.ajax({
        method: 'POST',
        url: '/entries',
        contentType: 'application/json',
        data: JSON.stringify(payload)
      });
      event.stopImmediatePropagation();
      event.preventDefault();
    });

  } else {
    alert('Sorry, you need modern web browser to play this game. I hear edge is OK');
  }
});
