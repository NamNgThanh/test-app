const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/features/employees/components/AddEmployeeSheet.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/optionsRes\.data\.chucVuOptions/g, '(optionsRes.data as any).chucVuOptions');
content = content.replace(/optionsRes\.data\.phongBanOptions/g, '(optionsRes.data as any).phongBanOptions');
content = content.replace(/res\.message/g, 'res.error');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed AddEmployeeSheet.tsx');
