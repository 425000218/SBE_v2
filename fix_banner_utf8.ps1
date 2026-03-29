$utf8NoBom = New-Object System.Text.UTF8Encoding $False

# Read replacement snippet correctly
$snippetBytes = [System.IO.File]::ReadAllBytes("c:\LEARN\SBE_v2\banner_snippet.txt")
$headerHtml = [System.Text.Encoding]::UTF8.GetString($snippetBytes)

$files = Get-ChildItem -Path "c:\LEARN\SBE_v2\pages" -Filter "*.html" | Select-Object -ExpandProperty FullName

foreach ($f in $files) {
    if (-not (Test-Path $f)) { continue }

    $bytes = [System.IO.File]::ReadAllBytes($f)
    $content = [System.Text.Encoding]::UTF8.GetString($bytes)

    # Note: Using \r?\n and capturing the wrapper nicely
    $content = $content -replace '(?s)\s*<!-- Banner \(ph.*?\) -->\s*<header class="banner".*?</header>', "`n`n    <!-- Banner (phần header) -->`n$headerHtml"
    
    # If no comment is present, just replace header
    if ($content -match '<header class="banner"') {
         $content = $content -replace '(?s)\s*<header class="banner".*?</header>', "`n`n    $headerHtml"
    }

    $outBytes = $utf8NoBom.GetBytes($content)
    [System.IO.File]::WriteAllBytes($f, $outBytes)
}
Write-Host "Updated with UTF8 correctly without string literal issues."
