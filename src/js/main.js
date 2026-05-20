import { DefaultRubyVM } from "https://cdn.jsdelivr.net/npm/@ruby/wasm-wasi@2.9.4-2026-05-19-a/dist/browser/+esm";

const output = document.getElementById('output');
const btn = document.getElementById('run-btn');

async function setupRuby(vm) {
  const evalFile = async (path) => {
    const res = await fetch(path);
    vm.eval(await res.text());
  };

  await evalFile('/ruby/rubocop_setup.rb');
}

async function initVM() {
  const response = await fetch('/wasm/rubocop-ruby.wasm');
  const module = await WebAssembly.compileStreaming(response);
  const { vm } = await DefaultRubyVM(module);

  await setupRuby(vm);

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

btn.disabled = false;
btn.addEventListener('click', () => onClick(vm));
