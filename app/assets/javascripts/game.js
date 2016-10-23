$(document).ready(function () {
    var channel = pusher.subscribe('entries');
    channel.bind('player_joined', function (data) {
        var avatarUrl = 'https://avatars.io/twitter/' + data.twitter;
        // TODO: why is this firing twice?
        if ($('#' + data.twitter).length === 0) {
            $('#grid .row').append('<div class="col-xs-3">' +
                '<img id="' + data.twitter + '" class="img-rounded img-responsive" src="' + avatarUrl + '"/>' +
                '<p class="text-warning emotion-result"><b>' + data.twitter + '</b></p>' +
                '</div>');
        }
    });

    channel.bind('emotion_ready', function (data) {
        console.log(data);
        if (data.success === true) {
            var twitter = data.twitter;
            var imgUrl = data.url;
            $('#' + twitter).attr('src', imgUrl);
            $('#' + twitter).next().html('<b>' + data.twitter + ' ' + $('#emotion_select  option:selected').text() + ': ' + data[$('#emotion_select').val()] + '</b>');
        }
    });

    $('#emotion_select').change(function (event) {
        var $this = $(this);
        if ($this.val() !== '0') {
            var payload = {
                game: {
                    emotion: $this.val()
                }
            };

            $.ajax({
                method: 'POST',
                url: '/games',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                error: function (error) {
                    console.log(error);
                }
            });
        }

        event.stopImmediatePropagation();
        event.preventDefault();
    });
});
