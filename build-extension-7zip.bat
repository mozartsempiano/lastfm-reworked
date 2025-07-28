@echo off

:: Get version from manifest.mv3.json
for /f "tokens=2 delims=:" %%i in ('findstr /r "\"version\"" manifest.mv3.json') do (
    set VERSION=%%i
)
:: Remove quotes and spaces
set VERSION=%VERSION:"=%
set VERSION=%VERSION: =%
set VERSION=%VERSION:,=%

:: Allow override via command line
if not "%1"=="" set VERSION=%1

echo Building Last.fm Reworked v%VERSION% with 7-Zip...

:: Create build directory
if exist build rmdir /s /q build
mkdir build

:: Build Chrome (MV3)
mkdir build\chrome-mv3
copy content.css build\chrome-mv3\
copy content.js build\chrome-mv3\
copy popup.html build\chrome-mv3\
copy popup.js build\chrome-mv3\
copy variables.css build\chrome-mv3\
copy LICENSE build\chrome-mv3\
copy README.md build\chrome-mv3\
powershell -Command "Copy-Item -Path 'icons' -Destination 'build\chrome-mv3\icons' -Recurse"
copy manifest.mv3.json build\chrome-mv3\manifest.json

:: Build Firefox (MV2)
mkdir build\firefox-mv2
copy content.css build\firefox-mv2\
copy content.js build\firefox-mv2\
copy popup.html build\firefox-mv2\
copy popup.js build\firefox-mv2\
copy variables.css build\firefox-mv2\
copy LICENSE build\firefox-mv2\
copy README.md build\firefox-mv2\
powershell -Command "Copy-Item -Path 'icons' -Destination 'build\firefox-mv2\icons' -Recurse"
copy manifest.mv2.json build\firefox-mv2\manifest.json

:: Create ZIP files using 7-Zip (more compatible)
if exist "lastfm-reworked-v%VERSION%.mv3.zip" del "lastfm-reworked-v%VERSION%.mv3.zip"
if exist "lastfm-reworked-v%VERSION%.mv2.zip" del "lastfm-reworked-v%VERSION%.mv2.zip"

:: Try 7-Zip first, fallback to PowerShell
where 7z >nul 2>&1
if %errorlevel% == 0 (
    echo Using 7-Zip...
    7z a -tzip "lastfm-reworked-v%VERSION%.mv3.zip" ".\build\chrome-mv3\*" -r
    7z a -tzip "lastfm-reworked-v%VERSION%.mv2.zip" ".\build\firefox-mv2\*" -r
) else (
    echo 7-Zip not found, using PowerShell...
    powershell -Command "Compress-Archive -Path 'build\chrome-mv3\*' -DestinationPath 'lastfm-reworked-v%VERSION%.mv3.zip' -CompressionLevel Optimal"
    powershell -Command "Compress-Archive -Path 'build\firefox-mv2\*' -DestinationPath 'lastfm-reworked-v%VERSION%.mv2.zip' -CompressionLevel Optimal"
)

:: Cleanup
rmdir /s /q build

echo.
echo Build completed!
echo Chrome (MV3): lastfm-reworked-v%VERSION%.mv3.zip
echo Firefox (MV2): lastfm-reworked-v%VERSION%.mv2.zip
