require 'js'
require 'prism'

Dir.glob('/bundle/*').each do |dir|
  $LOAD_PATH << "#{dir}/lib"
end

require 'parser/all'
require 'prism/translation/parser'
require 'prism/translation/parser/builder'

# RuboCop が内部で socket/resolv を require しようとするが
# wasm 環境では C拡張のため利用不可。空の stub で読み込みをスキップする
class BasicSocket; end
class Socket < BasicSocket
  AF_UNSPEC = 0; AF_INET = 2; AF_INET6 = 10
  SOCK_STREAM = 1; SOCK_DGRAM = 2
end
class IPSocket < BasicSocket; end
class UDPSocket < IPSocket; end
class TCPSocket < IPSocket; end

%w[socket io/wait resolv].each do |lib|
  $LOADED_FEATURES << lib
  $LOADED_FEATURES << "#{lib}.rb"
  $LOADED_FEATURES << "/usr/local/lib/ruby/3.4.0/#{lib}.rb"
end
module Resolv; end

require 'rubocop'
