@echo off
cd /d %~dp0

:: Mở 2 cửa sổ command song song: 1 cho Flask, 1 cho ngrok
start cmd /k "python app.py"
timeout /t 3 >nul
start cmd /k "ngrok http 5000"
