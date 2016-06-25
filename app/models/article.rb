class Article < ActiveRecord::Base
  belongs_to :category, class_name: 'ArticleCategory', :foreign_key => :category_id

   belongs_to :user

  scope  :publish  , -> {where(status: 1)}

  STATUS = {1 => '已发布', 0 => '暂存'  }

  # 根据名字进行查询，返回num条
  def self.get_articles(name, num)
    record = ArticleCategory.find_by_name(name)
    conditions = []
    if record.present? && record.has_children?
      children_ids = record.descendant_ids
      children_ids.each do |cid|
        conditions << "find_in_set(#{cid},category_id)"
      end
      conditions = conditions.join(' or ')
      where(conditions).limit(num)
    else
      return where("find_in_set(#{record.id},category_id)").order("id desc").limit(num) if (record.present? && num > 0)
      return where("find_in_set(#{record.id},category_id)").order("id desc") if record
    end
  end
end
