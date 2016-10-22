class PlayersController < ApplicationController
  def create
    handle = player_params[:twitter].gsub('@', '')
    Pusher.trigger('entries', 'player_joined', {
      twitter: handle
    })
  end

  private
  # Only allow a trusted parameter "white list" through.
  def player_params
    params.require(:player).permit(:twitter)
  end
end
