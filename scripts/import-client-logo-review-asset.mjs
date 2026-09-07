// Import a public logo exported by the browser's pageAssets capability.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
const [id,sourceFile]=process.argv.slice(2);
const out='docs/revisao-logotipos-clientes-2026-09-02';
const data=JSON.parse(await fs.readFile(path.join(out,'fontes.json'),'utf8'));
const item=data.clients.find(c=>c.id===id);
if(!item || !sourceFile)throw new Error('Client or file missing');
const bytes=await fs.readFile(sourceFile);
if(!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw new Error('Only PNG imports supported');
item.candidateFile=`assets/${id}-referencia.png`;
await fs.writeFile(path.join(out,item.candidateFile),bytes);
item.status='official-source-file';item.acquisition='Exported from image loaded on official page using browser pageAssets';
item.bytes=bytes.length;item.sha256=crypto.createHash('sha256').update(bytes).digest('hex');
delete item.error; delete item.httpStatus;
await fs.writeFile(path.join(out,'fontes.json'),JSON.stringify(data,null,2));
