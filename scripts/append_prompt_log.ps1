param(
  [Parameter(Mandatory = $true)]
  [string]$Prompt,

  [string]$LogPath = (Join-Path $PSScriptRoot "..\prompt_log.txt")
)

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

Add-Content -Path $LogPath -Encoding UTF8 -Value "`n[$timestamp]"
Add-Content -Path $LogPath -Encoding UTF8 -Value $Prompt
Add-Content -Path $LogPath -Encoding UTF8 -Value "---"

Write-Host "Appended to $LogPath"