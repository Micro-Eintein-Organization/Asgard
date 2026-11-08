import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { publicationSQL } from './content-publication.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const config = readFileSync(new URL('../supabase/config.toml', import.meta.url), 'utf8');
const project = config.match(/^project_id\s*=\s*"([a-zA-Z0-9_-]+)"/m)?.[1];
if (!project) throw new Error('Local Supabase project_id is missing.');
const sql = publicationSQL(root);
const result = spawnSync('docker', ['exec','-i',`supabase_db_${project}`,'psql','-U','postgres','-d','postgres','-v','ON_ERROR_STOP=1'], {cwd:root,input:sql,encoding:'utf8'});
if (result.error || result.status !== 0) {
  console.error('Local content publication failed. Review migration state and content conflicts.');
  if (result.stderr) console.error(result.stderr);
  process.exitCode=1;
} else console.log('Starter content publication completed. Existing user state was preserved.');
