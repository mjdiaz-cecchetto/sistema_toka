const fs = require('fs');
const path = require('path');
const replacements = [
  { regex: /background:\s*#ffffff;/gi, replace: 'background: var(--card-bg);' },
  { regex: /background:\s*white;/gi, replace: 'background: var(--card-bg);' },
  { regex: /background:\s*#f8fafc;/gi, replace: 'background: var(--bg-surface-hover);' },
  { regex: /background:\s*#fafafa;/gi, replace: 'background: var(--bg-surface);' },
  { regex: /background:\s*#f1f5f9;/gi, replace: 'background: var(--bg-element);' },
  { regex: /background:\s*#e2e8f0;/gi, replace: 'background: var(--bg-element-hover);' },
  { regex: /background:\s*#fef2f2;/gi, replace: 'background: var(--danger-light);' },
  { regex: /background:\s*#fee2e2;/gi, replace: 'background: var(--danger-light);' },
  { regex: /background:\s*#dcfce7;/gi, replace: 'background: var(--success-light);' },
  { regex: /background:\s*#f0fdf4;/gi, replace: 'background: var(--success-bg);' },
  { regex: /border:\s*([0-9.]+px)\s+solid\s+#e2e8f0;/gi, replace: 'border: $1 solid var(--border);' },
  { regex: /border-bottom:\s*([0-9.]+px)\s+solid\s+#e2e8f0;/gi, replace: 'border-bottom: $1 solid var(--border);' },
  { regex: /border-top:\s*([0-9.]+px)\s+solid\s+#f1f5f9;/gi, replace: 'border-top: $1 solid var(--border);' },
  { regex: /color:\s*#0f172a;/gi, replace: 'color: var(--text-primary);' },
  { regex: /color:\s*#475569;/gi, replace: 'color: var(--text-secondary);' },
  { regex: /color:\s*#64748b;/gi, replace: 'color: var(--text-muted);' },
  { regex: /color:\s*#94a3b8;/gi, replace: 'color: var(--text-muted);' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      processDir(filePath);
    } else if (filePath.endsWith('.scss')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;
      for (const {regex, replace} of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replace);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
      }
    }
  }
}

processDir(process.argv[2]);
