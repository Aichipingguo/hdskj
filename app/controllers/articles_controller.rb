class ArticlesController < ApplicationController
  layout  'admin_out'
 def show
 	  @article = Article.find_by(id: params[:id])
 end

end
