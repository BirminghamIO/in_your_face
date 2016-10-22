class AddTwitterToEntry < ActiveRecord::Migration[5.0]
  def change
    add_column :entries, :twitter, :string
  end
end
