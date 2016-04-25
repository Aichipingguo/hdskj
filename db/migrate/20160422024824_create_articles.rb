class CreateArticles < ActiveRecord::Migration
  def change
    create_table :articles do |t|
      t.string :title # 标题
      t.text :quote # 摘要
      t.integer :category_id #类别
      t.text :content # 内容
      t.boolean :published, :default => false # 发布
      t.datetime :publish_time
      t.float :position, :default => 0.0
      t.string :cover# 封面图片
      t.integer :user_id
      t.integer :status ,:default => 0
      t.timestamps null: false
    end
    add_index :articles, :category_id
  end
end



