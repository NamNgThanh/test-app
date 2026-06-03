import fs from 'fs';
const file = "src/features/cskh/components/AddCskhSheet.tsx";
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'className="absolute bottom-0 left-0 right-0 border-t',
  'className="sticky bottom-0 -mx-6 -mb-6 mt-6 z-10 border-t'
);
content = content.replace('rounded-b-lg"', '"');

fs.writeFileSync(file, content);
console.log("Done");
