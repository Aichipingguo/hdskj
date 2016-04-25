# -*- encoding : utf-8 -*-
class Admin::ArticleCategoriesController < AdminController
  before_filter  :per_load ,  :only => [:edit,:update,:destroy]
  skip_before_action :verify_authenticity_token

  def index
    @article_categories = ArticleCategory.order("position")
    @rs = @article_categories.to_ztree_node(:is_menu => :is_menu).each do |h|
      h.merge!(:open => true)
    end
  end

  def new
    @article_category = ArticleCategory.new(parent_id: params[:parent_id])
    render layout: false
  end

  def edit
    @article_category = ArticleCategory.find(params[:id])  if params[:id]
     render layout: false
  end

   def destroy
    @article_category.destroy
    respond_back @article_category
  end

  def create
    @article_category = ArticleCategory.new(location_params)
    @article_category.save ? flash_msg(:success) : flash_msg(:error, @article_category.error_msg)
    respond_back @article_category
  end

  def update
    @article_category.update_attributes(location_params) ? flash_msg(:success) : flash_msg(:error)
    @article_category.children.map{|p| p.update(usable: @article_category.usable)} if @article_category.has_children?
    respond_with @article_category, :location => admin_article_categories_path(:cid => @article_category.id)
  end

  def location_params
    params.require(:article_category).permit!
  end

  private
    def per_load
      @article_category = ArticleCategory.find(params[:id])  if params[:id]
    end

end
