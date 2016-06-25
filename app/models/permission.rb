# -*- encoding : utf-8 -*-
class Permission < ActiveRecord::Base
  # has_many :permission_roles, :dependent => :delete_all
  # has_many :roles, :through => :permission_roles
  #
  # has_many :permission_users, :dependent => :delete_all
  # has_many :users, :through => :permission_users

  validates :name, presence: true

  has_ancestry :cache_depth => true

  scope :menus,  -> { where(:is_menu => true)}

  # 排序
  # def self.sort_items(menus)
  #   menus.each_with_index do |item,index|
  #     menu = Permission.find_by_id(item)
  #     menu.order_num = index
  #     menu.save
  #   end
  # end

  #获取子菜单
  # def get_submenus
  #   self.children.where(is_menu: true).order(:order_num)
  # end

end
