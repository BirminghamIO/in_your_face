class GetPhotoEmotion

  def self.call(image_url)
    require 'net/http'

    uri       = URI('https://api.projectoxford.ai/emotion/v1.0/recognize')
    uri.query = URI.encode_www_form({})

    request                              = Net::HTTP::Post.new(uri.request_uri)
    # Request headers
    request['Content-Type']              = 'application/json'
    # Request headers
    request['Ocp-Apim-Subscription-Key'] = ENV.fetch('EMOTION_KEY')
    # Request body
    request.body                         = "{ 'url': '#{image_url}' }"

    response = Net::HTTP.start(uri.host, uri.port, :use_ssl => uri.scheme == 'https') do |http|
      http.request(request)
    end

    response.body
  end
end
