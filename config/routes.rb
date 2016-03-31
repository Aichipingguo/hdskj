Rails.application.routes.draw do
  root :to=>'home#index'

  get 'main' => 'admin/main#index'

end
