import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const config=readFileSync(new URL('../supabase/config.toml',import.meta.url),'utf8');
const project=config.match(/^project_id\s*=\s*"([a-zA-Z0-9_-]+)"/m)?.[1];
if(!project) throw new Error('Missing local project_id.');
function sql(query){
  const result=spawnSync('docker',['exec','-i',`supabase_db_${project}`,'psql','-U','postgres','-d','postgres','-At','-v','ON_ERROR_STOP=1'],{cwd:root,input:query,encoding:'utf8'});
  if(result.status!==0) throw new Error('Local cleanup database operation failed.');
  return result.stdout.trim();
}
const result=spawnSync(process.execPath,[fileURLToPath(new URL('../node_modules/supabase/dist/supabase.js',import.meta.url)),'status','--output','json'],{cwd:root,encoding:'utf8'});
if(result.status!==0) throw new Error('Local Supabase status unavailable.');
const status=JSON.parse(result.stdout);
if(!status.SERVICE_ROLE_KEY||!/^https?:\/\/(127\.0\.0\.1|localhost):\d+$/.test(status.API_URL)) throw new Error('Local stack required.');
sql("UPDATE asgard_private.documents SET status='failed', failure_code='timeout', evidence='[]', purge_due_at=statement_timestamp() WHERE (status IN ('uploading','analyzing') AND deadline_at<statement_timestamp()) OR (status='uploaded' AND created_at<statement_timestamp()-interval '24 hours');");
const due=JSON.parse(sql("SELECT coalesce(json_agg(x),'[]'::json) FROM (SELECT id::text,object_key FROM asgard_private.documents WHERE purge_due_at<=statement_timestamp() AND purged_at IS NULL ORDER BY purge_due_at LIMIT 50) x;"));
let failed=0;
for(const item of due){
  if(!/^[a-f0-9-]{36}$/.test(item.id)||!/^([a-f0-9-]{36})\/([a-f0-9-]{36})\.pdf$/.test(item.object_key)) {failed++;continue;}
  try {
    const response=await fetch(status.API_URL+'/storage/v1/object/asgard-documents/'+item.object_key,{method:'DELETE',headers:{Authorization:'Bearer '+status.SERVICE_ROLE_KEY,apikey:status.SERVICE_ROLE_KEY},signal:AbortSignal.timeout(20000)});
    if(!response.ok&&response.status!==404){failed++;continue;}
    sql(`UPDATE asgard_private.documents SET purged_at=statement_timestamp() WHERE id='${item.id}'::uuid AND purge_due_at IS NOT NULL;`);
  } catch {failed++;}
}
const pending=sql('SELECT count(*) FROM asgard_private.documents WHERE purge_due_at<=statement_timestamp() AND purged_at IS NULL;');
console.log(JSON.stringify({processed:due.length-failed,failed,pending:Number(pending)}));
if(failed) process.exitCode=1;
