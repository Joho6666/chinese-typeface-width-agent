param(
  [string]$OutputDir = (Join-Path (Split-Path $PSScriptRoot -Parent) "output"),
  [string]$ClassName = "班级名称"
)
$ErrorActionPreference = "Stop"
$project = Split-Path $PSScriptRoot -Parent
$jsx = Join-Path $project "illustrator\generate_typography.jsx"
# Ensure output/config encoding is UTF-8 without BOM (ExtendScript compatible).
$cfg = Join-Path $project ".run-config.txt"
[System.IO.File]::WriteAllText($cfg, "$OutputDir`n$ClassName`n", (New-Object System.Text.UTF8Encoding($false)))
try {
  $ai = New-Object -ComObject Illustrator.Application
} catch {
  throw "无法创建 Illustrator COM 实例。请在装有 Adobe Illustrator 的 Windows 电脑上执行。$($_.Exception.Message)"
}
try {
  # COM bridge: use DoJavaScriptFile when available; else DoJavaScript with evaluation.
  try { $ai.DoJavaScriptFile($jsx) }
  catch { 
    $src = [System.IO.File]::ReadAllText($jsx, [System.Text.Encoding]::UTF8)
    $ai.DoJavaScript($src)
  }
} catch {
  throw "Illustrator 脚本运行失败：$($_.Exception.Message)"
}
Write-Host "检查导出目录: $OutputDir\$ClassName"
