class CreateNominates < ActiveRecord::Migration
  def change
    create_table :nominates do |t|
      t.string :name
      t.integer :category

      t.timestamps null: false
    end
  end
end
