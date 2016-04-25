class CreateArticleCategories < ActiveRecord::Migration
  def change
    create_table :article_categories do |t|
      t.string :name, :comment => '名称'
      t.string :ancestry
      t.integer :ancestry_depth, :default => 0
      t.float :position, :comment => '排序'
      t.boolean :usable, :default => 1
      t.timestamps null: false
    end
    add_index :article_categories, :ancestry
    add_index :article_categories, :usable
  end

end
