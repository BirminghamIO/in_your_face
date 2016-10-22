class ChangeEmotionToTextOnEntry < ActiveRecord::Migration[5.0]
  def change
    change_column :entries, :emotion, :text
  end
end
