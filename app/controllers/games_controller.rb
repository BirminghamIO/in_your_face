class GamesController < ApplicationController
  def new
    Pusher.trigger('entries', 'random_emotion_requested', {})
  end

  def create
    emotion = game_params[:emotion]
    Pusher.trigger('entries', 'emotion_wanted', {
        emotion: emotion
    })
  end

  private
  # Only allow a trusted parameter "white list" through.
  def game_params
    params.require(:game).permit(:emotion)
  end
end
