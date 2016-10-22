$(document).ready(function() {
  var channel = pusher.subscribe('entries');
  channel.bind('player_joined', function(data) {
    var avatarUrl = 'https://avatars.io/twitter/' + data.twitter;
    // TODO: why is this firing twice?
    if($('#' + data.twitter).length === 0) {
      $('#grid .row').append('<div class="col-xs-3"><img id="'+ data.twitter + '" class="img-rounded img-responsive" src="' + avatarUrl + '"/></div>');
    }
  });
});
