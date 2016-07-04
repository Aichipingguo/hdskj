class Department < ActiveRecord::Base
   has_many :users

  validates :name, :presence => true, :uniqueness => { :case_sensitive => false }
  has_ancestry :cache_depth => true
  default_value_for :status, 1

end
