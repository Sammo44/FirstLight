# Runs the FirstLight test suites in headless Microsoft Edge.
# Each test page is index.html with a test script (and, where needed, a stand-in for Claude) added at the end.
param([switch]$SkipCrawl, [string[]]$Only)

$root  = Split-Path $PSScriptRoot -Parent
$out   = Join-Path $PSScriptRoot "out"
$edge  = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { Write-Error "Microsoft Edge wasn't found."; exit 1 }

New-Item -ItemType Directory -Force $out | Out-Null
Copy-Item "$PSScriptRoot\*.js" $out -Force
$fixture = Join-Path $PSScriptRoot "fixtures\statements.js"
if (Test-Path $fixture) { Copy-Item $fixture $out -Force }
$app = [IO.File]::ReadAllText((Join-Path $root "index.html"), [Text.Encoding]::UTF8)
$utf8 = [Text.UTF8Encoding]::new($false)

function Run-Page($name, $before, $after, $attr, $budget) {
  $page = Join-Path $out "$name.html"
  [IO.File]::WriteAllText($page, $before + $app + $after, $utf8)
  $profile = Join-Path $out "profile-$name"
  # Edge profiles have paths longer than Windows' usual limit, so remove them with the long-path prefix.
  if (Test-Path $profile) { cmd /c "rd /s /q ""\\?\$profile""" 2>$null | Out-Null }
  $url = "file:///" + ($page -replace '\\', '/')
  $dom = & $edge --headless=new --disable-gpu --user-data-dir="$profile" --allow-file-access-from-files --virtual-time-budget=$budget --dump-dom $url 2>$null | Out-String
  if ($dom -match "$attr=""([^""]*)""") { return [Net.WebUtility]::HtmlDecode($matches[1]) }
  return "NO RESULT"
}

$mock  = "<script src='mockclaude.js'></script>"
$mock2 = "<script src='mockclaude2.js'></script>"
$failed = 0

if ($Only) { $SkipCrawl = $true }
if (-not $SkipCrawl) {
  # Each crawl runs in two parts: the test browser stops after a few thousand clicks in one page.
  $runs = @()
  foreach ($m in @(@('example',''), @('fresh',''), @('parent',''), @('ai',$mock2))) {
    $mode = if ($m[0] -eq 'ai') { 'example' } else { $m[0] }
    $runs += ,@("crawl-$($m[0])-1", $m[1], "<script>window.__SITMODE='$mode';window.__SITFROM=0;window.__SITTO=45;</script>")
    $runs += ,@("crawl-$($m[0])-2", $m[1], "<script>window.__SITMODE='$mode';window.__SITFROM=45;window.__SITTO=999;</script>")
  }
  foreach ($run in $runs) {
    $r = Run-Page $run[0] $run[1] ($run[2] + "<script src='sit.js'></script>") 'data-sit' 3000000
    if ($r -notmatch '"errors":0') { $failed++ }
    "{0,-14} {1}" -f $run[0], $r
  }
}

$suites = @(@('regression','', "<script src='harness2.js'></script>", 'data-test'),
            @('capture', $mock2, "<script src='talk.js'></script>", 'data-r'),
            @('words', $mock, "<script src='words.js'></script>", 'data-r'),
            @('letters', '', "<script src='letters.js'></script>", 'data-r'),
            @('family', '', "<script src='fam.js'></script>", 'data-r'),
            @('walk', '', "<script src='walk.js'></script>", 'data-r'),
            @('people', '', "<script src='people.js'></script>", 'data-r'),
            @('legacy', "<script src='legacy.js'></script>", '', 'data-r'),
            @('ux', '', "<script src='ux.js'></script>", 'data-r'),
            @('billedit', '', "<script src='billedit.js'></script>", 'data-r'),
            @('points', '', "<script src='points.js'></script>", 'data-r'),
            @('handover', '', "<script src='handover.js'></script>", 'data-r'))
if (Test-Path $fixture) { $suites += ,@('bills', '', "<script src='statements.js'></script><script src='bq.js'></script>", 'data-r') }
else { "bills          skipped: add tests/fixtures/statements.js to run it" }
if ($Only) { $suites = @($suites | Where-Object { $Only -contains $_[0] }) }

foreach ($t in $suites) {
  $r = Run-Page $t[0] $t[1] $t[2] $t[3] 200000
  $bad = ($r -eq 'NO RESULT') -or ($r -match '(^|\n)ERR ') -or ($r -match '"errs":\[[^\]]')
  if ($bad) { $failed++ }
  "{0,-14} {1}" -f $t[0], $(if ($bad) { "FAILED`n$r" } else { "passed" })
}

if ($failed) { "`n$failed suite(s) failed."; exit 1 } else { "`nAll suites passed." }
