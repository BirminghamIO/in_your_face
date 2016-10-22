Rails.application.routes.draw do
  get 'pages/player' => 'high_voltage/pages#show', id: 'player'
  get 'pages/game' => 'high_voltage/pages#show', id: 'game'

  resources :entries
end
