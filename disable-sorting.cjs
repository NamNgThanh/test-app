const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/features/employees/components/columns.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const keysToDisable = ['"code"', '"info"', '"phone"', '"USER_NAME"', '"email"', '"CHUC_VU"', '"PHONGBAN"', '"actions"'];

keysToDisable.forEach(key => {
  const accessorStr = `accessorKey: ${key},`;
  const idStr = `id: ${key},`;
  
  if (content.includes(accessorStr)) {
    content = content.replace(accessorStr, `${accessorStr}\n      enableSorting: false,`);
  } else if (content.includes(idStr)) {
    content = content.replace(idStr, `${idStr}\n      enableSorting: false,`);
  }
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Updated columns.tsx sorting config');
