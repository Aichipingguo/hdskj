class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  respond_to :html, :js, :json, :jpg



  def flash_msg(status = :notice, msg = "")
    flash[status] = msg
  end
end
