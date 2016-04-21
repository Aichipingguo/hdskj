class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable , :omniauthable


  def self.from_omniauth(auth)
      user = find_or_initialize_by(provider: auth.provider, uid: auth.uid)
      user.provider = auth.provider
      user.uid = auth.uid
      user.email = auth.uid.to_i.to_s + 'qq@hdskj.cn'
      user.name = user.user_name = auth.info.nickname
      user.save(:validate => false)
      user
  end

  def self.new_with_session(params, session)
    if session["devise.user_attributes"]
      new(session["devise.user_attributes"], without_protection: true) do |user|
        user.attributes = params
        user.valid?
      end
    else
      super
    end
  end

  def password_required?
    super && provider.blank?
  end

  def update_with_password(params, *options)
    if encrypted_password.blank?
      update_attributes(params, *options)
    else
      super
    end
  end

end
