import { DefaultRubyVM } from "https://cdn.jsdelivr.net/npm/@ruby/wasm-wasi@2.9.4-2026-05-19-a/dist/browser/+esm";

const output = document.getElementById('output');
const btn = document.getElementById('run-btn');
const loadingOverlay = document.getElementById('loading-overlay');

async function initVM() {
  const response = await fetch('/wasm/rubocop-ruby.wasm');
  const module = await WebAssembly.compileStreaming(response);
  const { vm } = await DefaultRubyVM(module);

  const setupRuby = await fetch('/ruby/rubocop/setup.rb');
  vm.eval(await setupRuby.text());

  return vm;
}

async function execRubocop(vm) {
  const renderOffenses = (offenses) => {
    const hasOffense = offenses.length > 0;
    output.className = hasOffense ? 'offense' : 'success';
    output.textContent = hasOffense
      ? offenses.map(o => `${o.line}行目: ${o.message}`).join('\n')
      : 'no offenses detected';
  };

  const code = document.getElementById('code').value;
  globalThis.rubyCode = code;

  try {
    const res = await fetch('/ruby/rubocop/runner.rb');
    const offenses = JSON.parse(vm.eval(await res.text()).toString());
    renderOffenses(offenses);
  } catch (e) {
    output.className = '';
    output.textContent = 'エラー: ' + e.message;
    console.error(e);
  }
}

const vm = await initVM();

loadingOverlay.classList.add('hidden');
btn.addEventListener('click', () => execRubocop(vm));

