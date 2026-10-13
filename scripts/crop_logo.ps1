Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Projects\galaxy heritage world\public\media\galaxy-heritage-world\faq\images\GHW_New_logo__1_-removebg-preview.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

$w = $bmp.Width
$h = $bmp.Height

$minX = $w
$minY = $h
$maxX = 0
$maxY = 0

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.A -gt 15) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Output "Bounds: minX=$minX, minY=$minY, maxX=$maxX, maxY=$maxY"
$cropW = $maxX - $minX + 1
$cropH = $maxY - $minY + 1
Write-Output "Cropped Size: $cropW x $cropH"

# Create tight cropped bitmap with slight padding
$pad = 4
$targetRect = New-Object System.Drawing.Rectangle(
    [Math]::Max(0, $minX - $pad),
    [Math]::Max(0, $minY - $pad),
    [Math]::Min($w - $minX, $cropW + ($pad * 2)),
    [Math]::Min($h - $minY, $cropH + ($pad * 2))
)

$cropped = $bmp.Clone($targetRect, $bmp.PixelFormat)

$dest1 = "C:\Projects\galaxy heritage world\public\media\galaxy-heritage-world\shared\logos\ghw-logo-transparent.png"
$dest2 = "C:\Projects\galaxy heritage world\apps\web\public\media\galaxy-heritage-world\shared\logos\ghw-logo-transparent.png"
$dest3 = "C:\Projects\galaxy heritage world\apps\web\public\media\galaxy-heritage-world\shared\logos\ghw-new-logo-e17899330439.png"

$cropped.Save($dest1, [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Save($dest2, [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Save($dest3, [System.Drawing.Imaging.ImageFormat]::Png)

$cropped.Dispose()
$bmp.Dispose()
Write-Output "Successfully saved tightly cropped logo!"
