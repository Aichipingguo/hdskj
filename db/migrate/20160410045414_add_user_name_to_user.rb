class AddUserNameToUser < ActiveRecord::Migration
  def change
    add_column  :users,  :user_name ,  :string , :comment=> '登录名'
  end
end
