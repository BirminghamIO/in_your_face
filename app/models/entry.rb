class Entry < ApplicationRecord
  attr_accessor :content_type, :original_filename, :image_data
  has_attached_file :photo, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png"
  validates_attachment_content_type :photo, content_type: /\Aimage\/.*\z/

  before_save :normalize_twitter_handle
  before_create :decode_base64_image
  after_create :process_entry

  def normalize_twitter_handle
    self.twitter = self.twitter.gsub('@', '')
  end

  def decode_base64_image
    if image_data && content_type && original_filename
      decoded_data = Base64.decode64(image_data)

      data = StringIO.new(decoded_data)
      data.class_eval do
        attr_accessor :content_type, :original_filename
      end

      data.content_type = content_type
      data.original_filename = File.basename(original_filename)

      self.image = data
    end
  end

  def process_entry
    ProcessEntryJob.perform_later self.id
  end
end
