class CreatePermissions < ActiveRecord::Migration
  def change
    create_table :permissions do |t|
      t.string :name, :comment => "菜单名称"
      t.string :url, :comment => "url"
      t.string :ancestry, :comment => "层级关系"
      t.integer :ancestry_depth, :comment => "层级"
      t.integer :position, :default => 0, :comment => "排序"
      t.integer :hide, :default => 0, :comment => "是否隐藏"
      t.integer :blank, :default => 0, :comment => "是否新窗口打开"
      t.boolean :is_menu, :default => 0, :comment => "是否菜单"
      t.timestamps
    end
  end
end
