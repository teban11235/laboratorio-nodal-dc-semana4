@echo off
chcp 65001 >nul
title Laboratorio Nodal DC - Circuitos Electricos Semana 4
cd /d "%~dp0"
echo ====================================================================
echo   Iniciando Laboratorio Nodal DC - Circuitos Electricos (Semana 4)
echo ====================================================================
echo.
if not exist "node_modules\" (
    echo Instalando dependencias por primera vez...
    call npm install
)
echo Abriendo navegador en http://localhost:3000 ...
start "" "http://localhost:3000"
call npm run dev
pause
