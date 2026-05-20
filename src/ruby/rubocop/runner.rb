require 'fileutils'
require 'js'
require 'json'

code = JS.global[:rubyCode].to_s

FileUtils.mkdir_p('/tmp')
File.write('/tmp/main.rb', code)
output_path = '/tmp/output.json'

config_store = RuboCop::ConfigStore.new
options = {
  cache: 'false',
  formatters: [['json', output_path]],
}

runner = RuboCop::Runner.new(options, config_store)
runner.run(['/tmp/main.rb'])

result = JSON.parse(File.read(output_path))
offenses = result['files'][0]['offenses'].map do |o|
  { line: o['location']['start_line'], message: o['message'] }
end

offenses.to_json
