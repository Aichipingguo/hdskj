Rails.application.routes.draw do

  devise_for :users, controllers: {
    sessions: "user/sessions",
    registrations: "user/registrations",
    passwords: "user/passwords",
  }
  root :to=>'home#index'

  get 'main' => 'admin/main#index'

end
