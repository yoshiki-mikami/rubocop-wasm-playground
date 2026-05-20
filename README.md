# rubocop-wasm-playground
rubocopをブラウザ上で動かしてみる実験

## wasmのビルド

`rbwasm build` ではなく `rbwasm pack` を使う。理由は以下の通り：

- `rbwasm build` はゼロからCRubyをビルドするが、生成されたwasmが `DefaultRubyVM`（ブラウザ向けJS API）と ABI 互換でない

- `js` gem はC拡張のため通常の `bundle install` ではwasm向けにコンパイルできない
※CDNの `ruby+stdlib.wasm` には `js` gem がwasm32向けにビルド済みで内蔵されている

- RuboCopはpure Rubyなので、CDNのwasmをベースに gem ファイルを追加するだけで動く

```bash
cd wasm-build
bundle install --path vendor/bundle
curl -L https://cdn.jsdelivr.net/npm/@ruby/3.4-wasm-wasi@2.9.4-2026-05-19-a/dist/ruby+stdlib.wasm -o base.wasm
rbwasm pack base.wasm --dir vendor/bundle/ruby/3.3.0/gems::/bundle -o ../src/wasm/rubocop-ruby.wasm
```

> ※ `vendor/bundle/ruby/3.3.0/gems` のパスはローカルの Ruby バージョンによって異なる場合があります。

## サーバー起動方法

```bash
./serve.sh
```

http://localhost:8080 をブラウザで開く。
