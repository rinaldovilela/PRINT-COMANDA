param (
    [string]$filePath,
    [string]$printerName
)

Start-Process -FilePath $filePath -ArgumentList "/p /h /t$printerName" -NoNewWindow -Wait
