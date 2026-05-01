$files = Get-ChildItem -Path 'src' -Recurse -Filter '*.vue'

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $content = $content -replace '[^\x00-\x7F\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]', ''
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Processed: $($file.FullName)"
    } catch {
        Write-Host "Error processing $($file.FullName): $_"
    }
}

Write-Host "Batch processing completed!"