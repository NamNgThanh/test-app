const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/layouts/SettingsSheet.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace res.message with res.error
content = content.replace(/res\.message/g, 'res.error');

// Replace setItems(res.data); with setItems(res.data as any[]);
content = content.replace(/setItems\(res\.data\);/g, 'setItems(res.data as any[]);');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed SettingsSheet.tsx');
