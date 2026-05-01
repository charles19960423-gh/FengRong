$files = Get-ChildItem -Path "src" -Recurse -Filter "*.vue" | Select-Object -ExpandProperty FullName

foreach ($file in $files) {
    $content = Get-Content -Path $file -Raw -Encoding UTF8
    
    # 修复常见的乱码模式
    $content = $content -replace '([\u4e00-\u9fff])\?/([a-z])', '$1$2>'
    $content = $content -replace '([\u4e00-\u9fff])\?', '$1'
    $content = $content -replace '\?/span>', '></span>'
    $content = $content -replace '\?/p>', '></p>'
    $content = $content -replace '\?/h3>', '></h3>'
    $content = $content -replace '\?/label>', '></label>'
    
    Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
    Write-Host "Fixed: $file"
}

Write-Host "All files processed."