class AdminController < ApplicationController


  before_filter :authenticate_user!
   def respond_back(object)
      respond_with :admin, object, :location => params[:back].presence || send("admin_#{object.class.to_s.tableize}_url")
    end

end
