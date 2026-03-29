param(
  [Parameter(Mandatory = $true)]
  [string]$Prompt,

  [Parameter(Mandatory = $true)]
  [string]$AssistantSummary,

  [string]$LogPath = (Join-Path $PSScriptRoot "..\prompt_response_log.md")
)

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

if (-not (Test-Path $LogPath)) {
  "# Prompt + Response Log`n" | Out-File -FilePath $LogPath -Encoding UTF8
}

Add-Content -Path $LogPath -Encoding UTF8 -Value "`n## [$timestamp]"
Add-Content -Path $LogPath -Encoding UTF8 -Value "Prompt: $Prompt"
Add-Content -Path $LogPath -Encoding UTF8 -Value "Assistant explanation/solution: $AssistantSummary"
