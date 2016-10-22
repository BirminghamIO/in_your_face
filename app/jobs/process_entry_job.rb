class ProcessEntryJob < ApplicationJob
  queue_as :default

  def perform(id)
    entry = Entry.find id
    entry.emotion = GetPhotoEmotion.call(entry.photo.url).to_s
    entry.save
  end
end
