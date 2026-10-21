const fs = require('node:fs');
const vm = require('node:vm');
const file = 'content/vi.js';
let source = fs.readFileSync(file, 'utf8');
const edits = fs.readFileSync('tmp/update-product-ui.py', 'utf8');
vm.runInNewContext(edits.slice(edits.indexOf("add_object('deviceStatus'"), edits.lastIndexOf('p.write_text')), {
  replace(old, value) {
    if (!source.includes(old)) throw new Error('Missing source: ' + old);
    source = source.replace(old, value);
  },
  add_object(name, value) {
    source = source.replace('SV.content = {', 'SV.content = {\n  ' + JSON.stringify(name) + ': ' + JSON.stringify(value, null, 2).replaceAll('\n', '\n  ') + ',');
  }
});
fs.writeFileSync(file, source);
