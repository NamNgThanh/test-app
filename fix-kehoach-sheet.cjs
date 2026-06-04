const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/features/cskh/components/AddKeHoachSheet.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/res\.message/g, 'res.error');
content = content.replace(/res\.data\.ID_LH/g, '(res.data as any).ID_LH');
content = content.replace(/res\.data\.ID_DD/g, '(res.data as any).ID_DD');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed AddKeHoachSheet.tsx');
