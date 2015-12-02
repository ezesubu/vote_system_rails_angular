class UsersController < ApplicationController

  def index
    respond_to do |format|
      format.json { render json: User.where(identification: params[:identification]).first  }
      format.html
    end
  end
  def update

    user = User.where(identification: params[:id]).first
    if user
      user_response= user.update(user_params)
      response = {response: user_response , user_name: user.name}
    else
      response = {response: 'NOT_FOUND'}
    end
    respond_to do |format|
      format.json { render json: response }
    end

  end
  private
  def user_params
    params.require(:user).permit(:name,:email, :identification, :presence)
  end
end
