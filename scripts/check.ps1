[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
& node (Join-Path $PSScriptRoot 'dev.mjs') 'check'
if ($LASTEXITCODE -ne 0) { throw 'Asgard check failed; see the message above.' }
