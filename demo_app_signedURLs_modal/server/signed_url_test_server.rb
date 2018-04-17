# This is a Ruby command line script that spins up a Sinatra server. It's used 
# to test Zendesk Apps Signed URL feature.
#
# Requirements:
#    Ruby: https://help.zendesk.com/hc/en-us/articles/229489288-Installing-and-using-the-Zendesk-apps-tools#topic_cxd_wqm_1l
#    Gems: gem install <gem name>
#
# After having Ruby and necessary gems installed, run: 
#     ruby signed_url_test_server.rb
#
# See also:
# https://developer.zendesk.com/apps/docs/developer-guide/manifest#signedurls
# https://developer.zendesk.com/apps/docs/support-api/modal
# 
# Setup:
# Before running, search below for 'SETUP TODO' and follow instructions.


# SETUP TODO: 'gem install' each of the below gems.
require 'jwt'
require 'sinatra'
require 'zendesk_api'

set :port, 44000    # see http://www.sinatrarb.com/configuration.html

# Set up authenticated connection to given Zendesk instance.
client = ZendeskAPI::Client.new do |config|
  
  # SETUP TODO: Replace 'myzendesksubdomain' with your own zendesk subdomain.
  config.url = 'https://myzendesksubdomain.zendesk.com/api/v2'

  # SETUP TODO: Set enviornment varialbels for your own username and password.
  # Example: run on terminal command line: 
  #     export ZENDESK_USERNAME=john@zendesk.com 
  config.username = ENV['ZENDESK_USERNAME']
  config.password = ENV['ZENDESK_PASSWORD']
end

# Use https://myzendesksubdomain.zendesk.com/api/v2/apps/installations.json to get Apps and their IDs
# SETUP TODO: Replace app_id with your own app's ID (*not* installation ID)
app_id = 155879

rsa_public_pem = client.connection.get("apps/#{app_id}/public_key.pem").body
puts "Validating against App ID #{app_id} with public key:"
puts rsa_public_pem
rsa_public = OpenSSL::PKey::RSA.new(rsa_public_pem)
post_call_count = 0
get_call_count = 0

set :protection, except: :frame_options


# This is the modal endpoint used in the app's manifest.json.
post '/modal' do
  decoded_token = JWT.decode params[:token], rsa_public, true, algorithm: 'RS256'
  jwt_claims = decoded_token.first

  # This is where you can pull the user information from the JWT object
  # example sub value: "https://myzendesksubdomain.zendesk.com/api/v2/users/1234567890.json"
  puts jwt_claims
  user_info = client.connection.get(jwt_claims["sub"]).body
  user_name = user_info["user"]["name"]
  account_url = jwt_claims["iss"]
  post_call_count += 1
  "POST: MODAL Welcome #{user_name} from #{account_url}!<br/>call count: #{post_call_count}"  
end


# This is the app's parent location endpoint used in the app's manifest.json.
post '/parent' do
  decoded_token = JWT.decode params[:token], rsa_public, true, algorithm: 'RS256'
  jwt_claims = decoded_token.first

  puts jwt_claims
  user_info = client.connection.get(jwt_claims["sub"]).body
  user_name = user_info["user"]["name"]
  account_url = jwt_claims["iss"]
  post_call_count += 1

  # Send back HTML to display in the app's window.
  send_file File.join(settings.public_folder, 'parent.html')
  # Uncomment below line (and comment out above) to instead send simple output
  # "POST: PARENT Welcome #{user_name} from #{account_url}!<br/>call count: #{post_call_count}" 
end


# This GET endpoint will be called if app's manifiest 'signedURLs':false
get '/parent' do
  send_file File.join(settings.public_folder, 'parent.html')
end


# Root endpoint.
get '/' do
  get_call_count += 1
  "GET: Welcome<br/>call count: #{get_call_count}"
end
