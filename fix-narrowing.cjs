const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/layouts/SettingsSheet.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the buggy if statement pattern
const badPattern = /if \(res\.success && res\.data\) \{\s+setItems\(res\.data as any\[\]\);\s+\} else \{\s+toast\.error\(res\.error\);\s+\}/g;
const goodPattern = `if (res.success) {
      if (res.data) setItems(res.data as any[]);
    } else {
      toast.error(res.error);
    }`;

content = content.replace(badPattern, goodPattern);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed typescript union narrowing issue in SettingsSheet.tsx');
