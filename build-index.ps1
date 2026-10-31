# Builds index.html for GitHub Pages from the prototype source (the Claude artifact file, app/firstlight.html).
# The artifact host adds a standard page head (doctype, charset, viewport) around the file; on its own the page
# needs that head, or phones render it at desktop width.
$root = $PSScriptRoot
$src  = [IO.File]::ReadAllText((Join-Path $root "app\firstlight.html"), [Text.Encoding]::UTF8)
$head = "<!doctype html>`n<html lang=""en-AU"">`n<head>`n<meta charset=""utf-8"">`n<meta name=""viewport"" content=""width=device-width, initial-scale=1, viewport-fit=cover"">`n<meta name=""theme-color"" content=""#1E3E52"">`n"
[IO.File]::WriteAllText((Join-Path $root "index.html"), $head + $src + "`n</html>`n", [Text.UTF8Encoding]::new($false))
"index.html built"
