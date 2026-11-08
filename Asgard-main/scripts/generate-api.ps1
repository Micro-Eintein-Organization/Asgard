[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
& node (Join-Path $PSScriptRoot 'dev.mjs') 'generate-api'
if ($LASTEXITCODE -ne 0) { throw 'Asgard generate-api failed; see the message above.' }
