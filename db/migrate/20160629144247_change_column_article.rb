class ChangeColumnArticle < ActiveRecord::Migration
  def change
    remove_column   :articles  , :published
    remove_column   :articles  , :position
    remove_column   :articles  , :cover
    create_table :departments do |t|
      t.string :name                   , :comment => "单位名称", :null => false
      t.string :ancestry               , :comment => "祖先节点"
      t.integer :ancestry_depth        , :comment => "层级"
      t.integer :status                , :comment => "状态", :limit => 2, :default => 0 ,:null => false
      t.string :short_name             , :comment => "单位简称"
      t.string :legal_name             , :comment => "单位管理员"
      t.string :address                , :comment => "详细地址"
      t.string :tel                    , :comment => "电话"
      t.string :fax                    , :comment => "传真"
      t.text :summary                  , :comment => "单位介绍"
      t.text :logs                     , :comment => "日志"
      t.timestamps
    end
  end
end
