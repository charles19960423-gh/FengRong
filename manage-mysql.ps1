# 枫榕管理平台 - MySQL数据库管理脚本
# 保存为: manage-mysql.ps1

function Show-Menu {
    Clear-Host
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "     枫榕管理平台 - MySQL 数据库管理    " -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host " [1] 查看MySQL容器状态" -ForegroundColor Yellow
    Write-Host " [2] 查看所有表" -ForegroundColor Yellow
    Write-Host " [3] 查看用户数据" -ForegroundColor Yellow
    Write-Host " [4] 查看任务数据" -ForegroundColor Yellow
    Write-Host " [5] 查看评论数据" -ForegroundColor Yellow
    Write-Host " [6] 查看参与者数据" -ForegroundColor Yellow
    Write-Host " [7] 执行自定义SQL" -ForegroundColor Yellow
    Write-Host " [8] 备份数据库" -ForegroundColor Yellow
    Write-Host " [9] 重启MySQL容器" -ForegroundColor Yellow
    Write-Host "[10] 查看容器日志" -ForegroundColor Yellow
    Write-Host " [0] 退出" -ForegroundColor Yellow
    Write-Host ""
}

function Check-MySQLStatus {
    Write-Host "`n=== MySQL 容器状态 ===" -ForegroundColor Cyan
    docker ps --filter "name=fr-tavern-mysql"
}

function Show-AllTables {
    Write-Host "`n=== 数据库表 ===" -ForegroundColor Cyan
    docker exec fr-tavern-mysql mysql -uroot -proot fr_tavern -e "SHOW TABLES;"
}

function Show-Users {
    Write-Host "`n=== 用户数据 ===" -ForegroundColor Cyan
    docker exec fr-tavern-mysql mysql -uroot -proot fr_tavern -e "SELECT id, username, nickname, prestige, level, tier, status FROM user;"
}

function Show-Tasks {
    Write-Host "`n=== 任务数据 ===" -ForegroundColor Cyan
    docker exec fr-tavern-mysql mysql -uroot -proot fr_tavern -e "SELECT id, title, status, reward, created_by, created_at FROM task LIMIT 20;"
}

function Show-Comments {
    Write-Host "`n=== 评论数据 ===" -ForegroundColor Cyan
    docker exec fr-tavern-mysql mysql -uroot -proot fr_tavern -e "SELECT tc.id, t.title, u.nickname, LEFT(tc.content, 30) as content, tc.created_at FROM task_comment tc JOIN task t ON tc.task_id = t.id JOIN user u ON tc.user_id = u.id LIMIT 20;"
}

function Show-Participants {
    Write-Host "`n=== 参与者数据 ===" -ForegroundColor Cyan
    docker exec fr-tavern-mysql mysql -uroot -proot fr_tavern -e "SELECT tp.id, t.title, u.nickname, tp.status, tp.joined_at FROM task_participant tp JOIN task t ON tp.task_id = t.id JOIN user u ON tp.user_id = u.id LIMIT 20;"
}

function Execute-CustomSQL {
    Write-Host "`n=== 自定义SQL执行 ===" -ForegroundColor Cyan
    $sql = Read-Host "请输入要执行的SQL语句"
    docker exec fr-tavern-mysql mysql -uroot -proot fr_tavern -e "$sql"
}

function Backup-Database {
    Write-Host "`n=== 数据库备份 ===" -ForegroundColor Cyan
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $filename = "backup_fr_tavern_$timestamp.sql"
    docker exec fr-tavern-mysql mysqldump -uroot -proot fr_tavern > $filename
    Write-Host "✅ 数据库已备份到: $filename" -ForegroundColor Green
}

function Restart-MySQL {
    Write-Host "`n=== 重启MySQL容器 ===" -ForegroundColor Cyan
    docker restart fr-tavern-mysql
    Write-Host "✅ MySQL容器已重启" -ForegroundColor Green
}

function Show-Logs {
    Write-Host "`n=== MySQL容器日志 (最后50行) ===" -ForegroundColor Cyan
    docker logs --tail 50 fr-tavern-mysql
}

# 主程序循环
do {
    Show-Menu
    $choice = Read-Host "请选择操作 (0-10)"
    
    switch ($choice) {
        "1" { Check-MySQLStatus }
        "2" { Show-AllTables }
        "3" { Show-Users }
        "4" { Show-Tasks }
        "5" { Show-Comments }
        "6" { Show-Participants }
        "7" { Execute-CustomSQL }
        "8" { Backup-Database }
        "9" { Restart-MySQL }
        "10" { Show-Logs }
        "0" { break }
        default { Write-Host "❌ 无效选择！" -ForegroundColor Red }
    }
    
    if ($choice -ne "0") {
        Write-Host ""
        Read-Host "按 Enter 继续..."
    }
} while ($choice -ne "0")

Write-Host "`n👋 再见！" -ForegroundColor Cyan
