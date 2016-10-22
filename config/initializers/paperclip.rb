Paperclip::Attachment.default_options[:url]  = ':s3_domain_url'
Paperclip::Attachment.default_options[:path] = '/:class/:attachment/:id_partition/:style/:filename'
Paperclip::Attachment.default_options[:s3_host_name] = 'in-your-face-production.s3-website-eu-west-1.amazonaws.com'
