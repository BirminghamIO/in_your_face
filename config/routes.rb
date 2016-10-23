Rails.application.routes.draw do
  get 'game/create'

  get 'pages/player' => 'high_voltage/pages#show', id: 'player'
  get 'pages/game' => 'high_voltage/pages#show', id: 'game'

  resources :entries
  resources :players
  resources :games
end
