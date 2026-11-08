import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const envPath=new URL('../.env',import.meta.url);
const result=spawnSync(process.execPath,[fileURLToPath(new URL('../node_modules/supabase/dist/supabase.js',import.meta.url)),'status','--output','json'],{cwd:root,encoding:'utf8'});
if(result.status!==0) throw new Error('Local Supabase status unavailable.');
const status=JSON.parse(result.stdout);
if(!status.SERVICE_ROLE_KEY || !/^https?:\/\/(127\.0\.0\.1|localhost):\d+$/.test(status.API_URL)) throw new Error('Only a running local Supabase stack is supported.');
let env=readFileSync(envPath,'utf8');
for(const [key,value] of Object.entries({ASGARD_DOCUMENTS_ENABLED:'true',ASGARD_DOCUMENTS_REAL_DATA_APPROVED:'false',ASGARD_STORAGE_SERVICE_KEY:status.SERVICE_ROLE_KEY})) {
  const expression=new RegExp('^'+key+'=.*$','m');
  env=expression.test(env)?env.replace(expression,key+'='+value):env+'\n'+key+'='+value+'\n';
}
writeFileSync(envPath,env);
console.log('Synthetic-only document configuration saved in ignored .env. Recreate backend to activate. Credentials were not printed.');
