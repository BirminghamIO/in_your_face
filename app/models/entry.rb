class Entry < ApplicationRecord
  attr_accessor :content_type, :original_filename, :image_data
  has_attached_file :photo, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png"
  validates_attachment_content_type :photo, content_type: /\Aimage\/.*\z/

  serialize :emotion

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

      data.content_type      = content_type
      data.original_filename = File.basename(original_filename)

      self.image = data
    end
  end

  def process_entry
    ProcessEntryJob.perform_later self.id
  end

  def push_emotion
    Pusher.trigger('entries', 'emotion_ready', self.format_push_data)
  end

  def format_push_data
    return self.fail_data unless self.emotion.try(:first)['scores']
    {
        success:   true,
        twitter:   self.twitter,
        url:       self.photo.url(:medium),
        anger:     self.format_score('anger'),
        contempt:  self.format_score('contempt'),
        disgust:   self.format_score('disgust'),
        fear:      self.format_score('fear'),
        happiness: self.format_score('happiness'),
        neutral:   self.format_score('neutral'),
        sadness:   self.format_score('sadness'),
        surprise:  self.format_score('surprise'),
    }
  end

  def fail_data
    {
        success: false,
        twitter: self.twitter,
        url:     self.photo.url,
    }
  end

  def format_score(emotion)
    (self.emotion.first['scores'][emotion].round(5) * 100).round(2)
  end
end
