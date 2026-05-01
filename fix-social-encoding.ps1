$content = Get-Content -Path "src/views/SocialView.vue" -Raw -Encoding UTF8

# 修复标题行
$content = $content -replace '<h1>社交酒馆</h1>', '<h1>社交酒馆</h1>'

# 修复动态标签
$content = $content -replace "{ label: '动, value: 'feed', icon: '' }", "{ label: '动态', value: 'feed', icon: '' }"

# 修复接受/拒绝按钮
$content = $content -replace '">?接受</button>', '">接受</button>'
$content = $content -replace '">?拒绝</button>', '">拒绝</button>'

# 修复在线/离线状态
$content = $content -replace ": '?离线'", ": '离线'"

# 修复接受/拒绝按钮
$content = $content -replace '">?接受</button>', '">接受</button>'
$content = $content -replace '">?拒绝</button>', '">拒绝</button>'

# 修复接受/拒绝按钮
$content = $content -replace '">?接受</button>', '">接受</button>'
$content = $content -replace '">?拒绝</button>', '">拒绝</button>'

Set-Content -Path "src/views/SocialView.vue" -Value $content -Encoding UTF8 -NoNewline

Write-Host "SocialView.vue encoding fixed"