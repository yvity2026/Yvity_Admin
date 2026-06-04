# Sync production (remote) Supabase DATA into local Supabase - READ ONLY on remote.
# Run from YVITY-Dashboard: npm run supabase:sync-from-remote
# Does NOT modify the live/global database.

$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")

function Import-DotEnv($path) {
  if (-not (Test-Path $path)) {
    throw "Missing $path - copy .env.local.example and fill in values."
  }
  Get-Content $path | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq "" -or $line.StartsWith("#")) { return }
    $eq = $line.IndexOf("=")
    if ($eq -lt 1) { return }
    $key = $line.Substring(0, $eq).Trim()
    $val = $line.Substring($eq + 1).Trim()
    if ($val.StartsWith('"') -and $val.EndsWith('"')) {
      $val = $val.Substring(1, $val.Length - 2)
    }
    Set-Item -Path "env:$key" -Value $val
  }
}

function Invoke-SupabaseCli {
  param([string[]]$CliArgs)
  $prev = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  & npx supabase@latest @CliArgs 2>&1 | ForEach-Object {
    if ($_ -is [System.Management.Automation.ErrorRecord]) { Write-Host $_.ToString() }
    else { Write-Host $_ }
  }
  $exit = $LASTEXITCODE
  $ErrorActionPreference = $prev
  return $exit
}

function Get-DbContainerName {
  if ($env:SUPABASE_LOCAL_DB_CONTAINER) {
    return $env:SUPABASE_LOCAL_DB_CONTAINER
  }
  $projectId = if ($env:SUPABASE_LOCAL_PROJECT_ID) { $env:SUPABASE_LOCAL_PROJECT_ID } else { "YVITY-Dashboard" }
  $name = "supabase_db_$projectId"
  $found = docker ps --filter "name=$name" --format "{{.Names}}" 2>$null | Select-Object -First 1
  if ($found) { return $found.Trim() }
  throw "Local Supabase DB is not running (expected container like $name). Run: npm run supabase:start"
}

Import-DotEnv (Join-Path $Root ".env.local")

$remoteUrl = $env:SUPABASE_REMOTE_DB_URL
if ([string]::IsNullOrWhiteSpace($remoteUrl)) {
  throw "SUPABASE_REMOTE_DB_URL is not set in .env.local."
}

$localApiPort = if ($env:SUPABASE_LOCAL_API_PORT) { $env:SUPABASE_LOCAL_API_PORT } else { "54321" }
$localStudioPort = if ($env:SUPABASE_LOCAL_STUDIO_PORT) { $env:SUPABASE_LOCAL_STUDIO_PORT } else { "54323" }
$tempDir = Join-Path $Root "supabase\.temp"
$dumpFile = Join-Path $tempDir "remote-data.sql"
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

Write-Host ""
Write-Host "=== YVITY-Dashboard: Remote to Local sync (remote is READ ONLY) ===" -ForegroundColor Cyan
Write-Host ""

Push-Location $Root

Write-Host "[1/5] Checking local Supabase..."
$dbContainer = Get-DbContainerName
Write-Host "  Container: $dbContainer" -ForegroundColor DarkGray

Write-Host "[2/5] Dumping DATA from REMOTE (read-only)..."
$dumpExit = Invoke-SupabaseCli -CliArgs @(
  "db", "dump", "--db-url", $remoteUrl, "--data-only",
  "--schema", "public", "--schema", "auth", "--use-copy", "-f", $dumpFile
)
if ($dumpExit -ne 0 -or -not (Test-Path $dumpFile)) {
  throw "Remote dump failed. Check SUPABASE_REMOTE_DB_URL."
}

Write-Host "[3/5] Resetting LOCAL database (migrations)..."
$resetExit = Invoke-SupabaseCli -CliArgs @("db", "reset", "--yes")
if ($resetExit -ne 0) {
  throw "Local db reset failed."
}

$dbContainer = Get-DbContainerName

Write-Host "[4/5] Preparing data import (public schema matches live baseline)..."
$importFile = $dumpFile

Write-Host "[5/5] Importing live DATA into LOCAL (read-only source)..."
$prev = $ErrorActionPreference
$ErrorActionPreference = "Continue"
Get-Content $importFile -Raw | docker exec -i $dbContainer psql -U postgres -d postgres -v ON_ERROR_STOP=0 -q 2>&1 | ForEach-Object { Write-Host $_ }
$importExit = $LASTEXITCODE
$ErrorActionPreference = $prev

Write-Host ""
if ($importExit -ne 0) {
  Write-Warning "Import completed with some errors (often harmless auth/storage rows)."
} else {
  Write-Host "Import complete." -ForegroundColor Green
}

Write-Host ""
Write-Host "Done. Live DB untouched. Apps use local only:" -ForegroundColor Green
Write-Host "  API    -> http://127.0.0.1:$localApiPort"
Write-Host "  Studio -> http://127.0.0.1:$localStudioPort"
Write-Host ""
Write-Host "Schema baseline: supabase/migrations/20260530120000_live_public_schema.sql"
Write-Host "Re-dump baseline from live when production schema changes (read-only pg_dump)."
Write-Host ""

Pop-Location
