Rails.application.routes.draw do

  devise_for :users, controllers: {
    sessions: "user/sessions",
    registrations: "user/registrations",
    passwords: "user/passwords",
    omniauth_callbacks: "omniauth_callbacks"
  }

  root :to=>'home#index'

  get 'main' => 'admin/main#index'

  get  'users/auth/tqq/callback'  => "user/omniauth_callbacks#all"

  mount UeditorRails::Engine => '/ueditor'
  post 'ueditor/file', :to => 'ueditor/assets#file'
  post 'ueditor/image', :to => 'ueditor/assets#image'

  get  'recruitment'  => 'other_tabs#recruitment'
  get  'contract_us'  => 'other_tabs#contract_us'
  get  'article_list' => 'other_tabs#article_list'
  get  'knowledge_list' => 'other_tabs#knowledge_list'
  get  'method_list' => 'other_tabs#method_list'
  get  'message'  => 'other_tabs#message_board'
  get  'about'  => 'other_tabs#about_us'


  namespace :admin do

    resources :articles do

    end

    resources :permissions do

    end

    resources :article_categories do

    end
  end

    resources  :articles

end
