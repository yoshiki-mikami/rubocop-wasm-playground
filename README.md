# rubocop-wasm-playground

rubocopをブラウザ上で動かしてみる実験

## wasmのビルド

`rbwasm build` ではなく `rbwasm pack` を使う。理由は以下の通り：

- `rbwasm build` はゼロからCRubyをビルドするが、生成されたwasmが `DefaultRubyVM`（ブラウザ向けJS API）と ABI 互換でない

- `js` gem はC拡張のため通常の `bundle install` ではwasm向けにコンパイルできない
※CDNの `ruby+stdlib.wasm` には `js` gem がwasm32向けにビルド済みで内蔵されている

- RuboCopはpure Rubyなので、CDNのwasmをベースに gem ファイルを追加するだけで動く

```bash
./build.sh
```

初回ビルドは wasi-vfs ツールチェーンと CRuby のダウンロード・コンパイルが走るため数分かかる。

<details>
<summary>build.sh が行う処理</summary>

1. `wasm-build/` で `bundle install`
2. `bundle exec rbwasm build` で wasi-vfs ツールチェーンをダウンロード
3. CDN から `ruby+stdlib.wasm` を取得
4. `bundle exec rbwasm pack` で RuboCop gem を wasm に同梱し `src/wasm/rubocop-ruby.wasm` を生成
5. 中間ファイル `base.wasm` を削除

</details>

## サーバー起動方法

```bash
./serve.sh
```

http://localhost:8080 をブラウザで開く。
