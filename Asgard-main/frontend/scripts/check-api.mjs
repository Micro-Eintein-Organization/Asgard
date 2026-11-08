import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const path = new URL('../src/api/generated/schema.d.ts', import.meta.url)
const before = readFileSync(path, 'utf8').replaceAll('\r\n', '\n')
const temporaryDirectory = mkdtempSync(join(tmpdir(), 'asgard-contract-'))
try {
  const output = join(temporaryDirectory, 'schema.d.ts')
  const result = spawnSync(process.execPath, [
    'node_modules/openapi-typescript/bin/cli.js', '../backend/openapi.json', '-o', output,
  ], { stdio: 'inherit' })
  if (result.status !== 0) process.exitCode = result.status ?? 1
  else if (readFileSync(output, 'utf8').replaceAll('\r\n', '\n') !== before) {
    console.error('Generated API types are stale; regenerate the API contract before review.')
    process.exitCode = 1
  }
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true })
}
