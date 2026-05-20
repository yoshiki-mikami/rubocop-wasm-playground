
require 'prism'

Dir.glob('/bundle/*').each do |dir|
  $LOAD_PATH << "#{dir}/lib"
end

# RuboCop::Runner が require するファイルが bundle/lib 以下にあるため、この場所で require する
require 'rubocop/runner'
require 'parser/all'
require 'prism/translation/parser'
require 'prism/translation/parser/builder'

# RuboCop が内部で socket/resolv を require しようとするが
# wasm 環境では C拡張のため利用不可。空の stub で読み込みをスキップする
# 既にrequire済みだと偽装するための処理（モック）
%w[socket io/wait resolv].each do |lib|
  $LOADED_FEATURES << lib
  $LOADED_FEATURES << "#{lib}.rb"
  $LOADED_FEATURES << "/usr/local/lib/ruby/3.4.0/#{lib}.rb"
end

require 'rubocop'
