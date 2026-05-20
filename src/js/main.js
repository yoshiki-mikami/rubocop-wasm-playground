import { DefaultRubyVM } from "https://cdn.jsdelivr.net/npm/@ruby/wasm-wasi@2.9.4-2026-05-19-a/dist/browser/+esm";

const output = document.getElementById('output');
const btn = document.getElementById('run-btn');

async function initVM() {
  const RUBY_WASM_URL = "https://cdn.jsdelivr.net/npm/@ruby/3.4-wasm-wasi@2.9.4-2026-05-19-a/dist/ruby+stdlib.wasm";

  const response = await fetch(RUBY_WASM_URL);
  const module = await WebAssembly.compileStreaming(response);
  const { vm } = await DefaultRubyVM(module);
  return vm;
}

function onClick(vm) {
  try {
    const result = vm.eval(`"Hello from Ruby #{RUBY_VERSION}!"`);
    output.textContent = result.toString();
  } catch (e) {
    output.textContent = 'エラー: ' + e.message;
    console.error(e);
  }
}

btn.disabled = true;
output.textContent = 'ruby.wasm を読み込み中...';

const vm = await initVM();

output.textContent = '準備完了';
btn.disabled = false;
btn.addEventListener('click', () => onClick(vm));
