# -*- encoding : utf-8 -*-

class User::RegistrationsController < Devise::RegistrationsController

  # prepend_before_filter :captcha_valid, :only => [ :create]


  def new
    super
  end

  def create
    super
  end

  private
  # def captcha_valid
  #   unless captcha_valid? params[:captcha]
  #     build_resource
  #     flash[:error] = "验证码输入错误，请重新输入"
  #     return respond_with_navigational(resource) { render :new }
  #   end
  # end

  def after_sign_in_path_for(resource)
    super
  end


end
