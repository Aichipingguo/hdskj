# -*- encoding : utf-8 -*-
class Admin::PermissionsController < AdminController

  def index
    @permissions = Permission.to_sorted_nodes
  end

end
