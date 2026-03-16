# Простой HTTP-сервер на PowerShell (без Python/Node)
$Port = 8080
$Root = $PSScriptRoot
if (-not $Root) { $Root = Get-Location }

$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add("http://127.0.0.1:$Port/")
$Listener.Start()

if (-not $Listener.IsListening) {
    Write-Host "Ошибка: не удалось запустить сервер. Возможно, порт занят или нужны права администратора."
    Write-Host "Попробуйте: netsh http add urlacl url=http://127.0.0.1:$Port/ user=Everyone"
    pause
    exit 1
}

Write-Host "Сервер: http://127.0.0.1:$Port/"
Write-Host "Папка: $Root"
Write-Host "Закройте окно для остановки."
Write-Host ""

Add-Type -AssemblyName System.Web

while ($Listener.IsListening) {
    try {
        $Context = $Listener.GetContext()
        $Request = $Context.Request
        $Response = $Context.Response

        $path = [Uri]::UnescapeDataString($Request.Url.LocalPath)
        if ($path -eq "/") { $path = "/save-as-png.html" }

        $filePath = Join-Path $Root ($path.TrimStart("/").Replace("/", [IO.Path]::DirectorySeparatorChar))
        if (-not [IO.Path]::IsPathRooted($filePath)) { $filePath = [IO.Path]::GetFullPath($filePath) }

        if ([IO.File]::Exists($filePath)) {
            $ext = [IO.Path]::GetExtension($filePath).ToLower()
            $mime = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".htm"  { "text/html; charset=utf-8" }
                ".css"  { "text/css" }
                ".js"   { "application/javascript" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".gif"  { "image/gif" }
                ".svg"  { "image/svg+xml" }
                ".ico"  { "image/x-icon" }
                ".woff" { "font/woff" }
                ".woff2"{ "font/woff2" }
                ".ttf"  { "font/ttf" }
                default { "application/octet-stream" }
            }
            $Response.ContentType = $mime
            $bytes = [IO.File]::ReadAllBytes($filePath)
            $Response.ContentLength64 = $bytes.Length
            $Response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $Response.StatusCode = 404
            $msg = [Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $Response.ContentLength64 = $msg.Length
            $Response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $Response.Close()
    } catch {
        Write-Host "Ошибка: $_"
    }
}
