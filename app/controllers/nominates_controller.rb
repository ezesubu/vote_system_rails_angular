class NominatesController < ApplicationController
  respond_to :json

  def index
    respond_to do |format|
      format.json { render json: Nominate.where(category: params[:category])  }
      format.html
    end
  end

  def get_by_category
    respond_to do |format|
      format.json { render json: Nominate.where(category: params[:category]) }
      format.html
    end
  end

  def create
    respond_with Nominate.create(nominate_params)
  end

  def destroy
    respond_with Nominate.destroy(params[:id])
  end

  private
  def nominate_params
    params.require(:nominate).permit(:name, :category)
  end
end

