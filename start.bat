@echo off

rem Verifica se a pasta node_modules existe
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install
) else (
    echo As dependencias ja estao instaladas.
)

rem Inicia o aplicativo
echo Iniciando aplicativo...
npm start

rem Captura o código de saída do aplicativo
set exitCode=%errorlevel%
echo Código de saída: %exitCode%

rem Pausa para visualizar mensagens de erro
pause
