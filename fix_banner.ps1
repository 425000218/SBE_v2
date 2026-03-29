$headerHtml = @"
    <!-- Banner (phần header) -->
    <header class="banner" aria-label="Banner">
      <div class="banner__logo" aria-hidden="true">
        <img src="../image/figma/logo.png" alt="Logo Trường">
      </div>

      <div class="banner__titles">
        <p class="banner__school">TRƯỜNG TRUNG HỌC CƠ SỞ LỘC AN</p>
        <p class="banner__name">HỆ THỐNG MƯỢN/TRẢ THIẾT BỊ ( SEB)</p>
      </div>

      <div class="banner__actions" aria-label="Hành động">
        <a href="login.html" class="banner__action" type="button" aria-label="Đăng nhập">
          <span class="icon icon--user" aria-hidden="true">
            <img class="icon__v" src="../image/figma/v9.svg" alt="">
            <img class="icon__v" src="../image/figma/v10.svg" alt="">
          </span>
        </a>
        <button class="banner__action" type="button" aria-label="Tùy chỉnh">
          <span class="icon icon--brush" aria-hidden="true">
            <img class="icon__v" src="../image/figma/v7.svg" alt="">
            <img class="icon__v" src="../image/figma/v8.svg" alt="">
          </span>
        </button>
      </div>
    </header>
"@

$files = Get-ChildItem -Path "c:\LEARN\SBE_v2\pages" -Filter "*.html" | Select-Object -ExpandProperty FullName

$utf8NoBom = New-Object System.Text.UTF8Encoding $False

foreach ($f in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($f)
    $content = [System.Text.Encoding]::UTF8.GetString($bytes)
    
    # Replace the old <header> block entirely
    $content = $content -replace '(?s)    <!-- Banner \(phần header\) -->\s*<header class="banner">.*?</header>', $headerHtml
    $content = $content -replace '(?s)    <!-- Banner \(ph.*?\) -->\s*<header class="banner".*?</header>', $headerHtml
    $content = $content -replace '(?s)\s*<header class="banner">.*?</header>', "`n`n$headerHtml"

    $outBytes = $utf8NoBom.GetBytes($content)
    [System.IO.File]::WriteAllBytes($f, $outBytes)
}
Write-Host "Replaced Banner in all pages"
