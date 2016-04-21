Rails.application.routes.draw do

  devise_for :users, controllers: {
    sessions: "user/sessions",
    registrations: "registrations",
    passwords: "user/passwords",
    omniauth_callbacks: "omniauth_callbacks"
  }

  root :to=>'home#index'

  get 'main' => 'admin/main#index'

  get  'users/auth/tqq/callback'  => "user/omniauth_callbacks#all"


  namespace :admin do

    resources :articles do

    end

    resources :article_categories do

    end
  end

end


