$(document).ready(function() {
  if (Modernizr.getusermedia) {

    // Subscribe to the entries channel
    var channel = pusher.subscribe('entries');
    channel.bind('emotion_wanted', function(data) {
       // TODO: react to this
      console.log(data.emotion);
    });

    var startVideo = function(video) {
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
        video = document.querySelector('video');
        video.srcObject = mediaStream;
        video.onloadedmetadata = function() {
          video.play();
        };
      }).catch(function(err) {
        alert(err);
      });
    };

    var stopVideo = function(video) {
      video.srcObject.getTracks()[0].stop();
    };

    $('#start-camera').click(function(event) {
      startVideo(document.querySelector('video'));
      event.stopImmediatePropagation();
      event.preventDefault();
    });

    $('#stop-camera').click(function(event) {
      stopVideo(document.querySelector('video'));
      event.stopImmediatePropagation();
      event.preventDefault();
    });

    // Enter the player using their twitter handle when we get it
    $('#twitter-btn').click(function(event) {
      // Tell the server who is joining
      var payload = {
        player: {
          twitter: $('#twtter-handle').val()
        }
      };
      $.ajax({
        method: 'POST',
        url: '/players',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function() {
          $('#capture-btn').attr('disabled', false);
        }
      });
      event.stopImmediatePropagation();
      event.preventDefault();
    });

    // Capture the screenshot
    $('#capture-btn').click(function(event) {
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
      $('#capture-btn').attr('disabled', true);
      $('#photo').show();
      performPost();
      event.stopImmediatePropagation();
      event.preventDefault();
    });

    // Submit the screenshot
    var performPost = function(event) {
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
        data: JSON.stringify(payload),
        success: function () {
          $('#emotion').hide();
          $('#success-alert').show();
          $('#photo').hide();
          $('#video').show();
          $('#capture-btn').attr('disabled', false);
        },
        error: function () {
          $('#emotion').hide();
          $('#error-alert').show();
          $('#capture-btn').attr('disabled', false);
        }
      });
    };

  } else {
    alert('Sorry, you need modern web browser to play this game. I hear edge is OK');
  }
});
