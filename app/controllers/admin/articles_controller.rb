class Admin::ArticlesController < AdminController
  before_filter :find_article, :only => [:edit, :update, :destroy,:commit]

    skip_before_action :verify_authenticity_token


  def  index
    @q = Article.ransack(params[:q])
    @articles = @q.result.order('created_at desc').page(params[:page]).per(10)
  end


  def new
    @article = Article.new
  end

  def create
    @article = Article.new(article_params)
    @article.user_id = current_user.id
    @article.save ? flash_msg(:success) : flash_msg(:error)
    respond_back @article
  end

  def commit
    @article.status = 1
    @article.published=1
    @article.publish_time = Time.now
    @article.save
    flash_msg("已发布")
    respond_back @article

  end

  def update
    @article.update_attributes(article_params) ? flash_msg(:success) : flash_msg(:error)
    respond_back @article
  end

  def destroy
    @article.destroy ? flash_msg(:success) : flash_msg(:error)
    respond_back @article
  end

  private

  def find_article
    @article = Article.find(params[:id])
  end

  def article_params
    params.require(:article).permit(:title, :quote, :content, :published, :cover, :category_id)
  end
end