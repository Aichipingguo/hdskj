class OtherTabsController < ApplicationController

  layout  'admin_out'
  
 def recruitment
 	 category = ArticleCategory.find_by(name: '人才招聘')
 	 @recruit = Article.publish.find_by(category_id: category.id)
 end

 def  about_us
 	 category = ArticleCategory.find_by(name: '关于我们')
 	 @about_us = Article.publish.find_by(category_id: category.id)
 end

 def  article_list
 	  find_obj('行业资讯')
 	  if @category.present?
	 		@q = Article.publish.where(category_id: @category.id).ransack(params[:q])
	 	  @hyzx = @q.result.order('created_at desc').page(params[:page]).per(10)
	 	end
 end

  def  knowledge_list
  	find_obj('百科知识')
  	if @category.present?
	    @q = Article.publish.where(category_id: @category.id).ransack(params[:q])
	 	  @knowledge = @q.result.order('created_at desc').page(params[:page]).per(10)
 	 end
 end
  def  method_list
  	find_obj('培植技巧')
    if @category.present?
    @q = Article.publish.where(category_id: @category.id).ransack(params[:q])
 	  @cultivation_method = @q.result.order('created_at desc').page(params[:page]).per(10)
 	end
 end


  def find_obj(obj)
  	 @category = ArticleCategory.find_by(name: obj)
  end

end
