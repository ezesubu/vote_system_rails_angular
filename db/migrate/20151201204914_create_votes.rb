class CreateVotes < ActiveRecord::Migration
  def change
    create_table :votes do |t|
      t.integer :nominate_id
      t.integer :user_identification
      t.integer :category

      t.timestamps null: false
    end
  end
end
