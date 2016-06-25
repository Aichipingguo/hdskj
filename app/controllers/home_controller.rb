
class HomeController < ApplicationController

   layout  'admin_out'

   def index
       category = ArticleCategory.find_by(name: '网站简介')
       if category.present?
         @profile = Article.find_by(category_id: category.id)
       end
       @hyzx = Article.publish.get_articles("行业资讯",10)
       @knowledge = Article.publish.get_articles("百科知识",15)
       @cultivation_method = Article.publish.get_articles("培植技巧",15)
   	end


     # 通用级联下拉框
     def selects
       clazz = params[:otype].to_s.singularize.camelize.constantize
       @objects = params[:id].blank? ? clazz.order("position").all : clazz.order("position").children_of(params[:id])
       @objects.delete_if{|obj| params[:reject_ids].to_s.split(",").include?(obj.id.to_s) } if params[:reject_ids].present? && @objects.present?
       if params[:otype].blank? or @objects.empty? or params[:id].blank?
         render :nothing => true
       else
         render :partial => "/shared/selects", :layout => false
       end
     end


end
