[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
& node (Join-Path $PSScriptRoot 'dev.mjs') 'start'
if ($LASTEXITCODE -ne 0) { throw 'Asgard start failed; see the message above.' }
