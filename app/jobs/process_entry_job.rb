class ProcessEntryJob < ApplicationJob
  queue_as :default

  def perform(id)
    entry = Entry.find id
    entry.update!({ emotion: GetPhotoEmotion.call(entry.photo.url) })
    entry.push_emotion
  end
end
