class VotesController < ApplicationController
  respond_to :json

  def create
    vote = Vote.where(user_identification: params[:user_identification], category: params[:category])
    if vote.exists?
      response = {errors: 'REPEAT'}
    else
      response = Vote.create(vote_params)
    end
    respond_to do |format|
      format.json { render json: response }
    end
  end

  private
  def vote_params
    params.require(:vote).permit(:nominate_id, :user_identification, :category)
  end
end
