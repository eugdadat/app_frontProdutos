@echo off
REM ==========================================================
REM CONFIGURAÇÕES
REM ==========================================================
SET MYSQL_EXE="C:\Program Files\MySQL\MySQL Server 9.4\bin\mysql.exe"
SET DB_NAME=aulajdbc
SET MYSQL_USER=root
SET MYSQL_PASSWORD=987123
SET SETUP_FILE=aulajdbc.sql

echo.
echo ==========================================================
echo  Iniciando o provisionamento do BD MySQL
echo ==========================================================

REM 1. Verifica se o executavel do MySQL existe
if not exist %MYSQL_EXE% (
    echo [ERRO] O executavel do MySQL nao foi encontrado no caminho:
    echo %MYSQL_EXE%
    echo Por favor, edite este script (init_db.bat) com o caminho correto.
    pause
    goto :EOF
)

REM 2. Tenta deletar e criar o banco de dados
echo.
echo -> Excluindo BD antigo (%DB_NAME%) e criando novo...
%MYSQL_EXE% -u%MYSQL_USER% -p%MYSQL_PASSWORD% -e "DROP DATABASE IF EXISTS %DB_NAME%;"
%MYSQL_EXE% -u%MYSQL_USER% -p%MYSQL_PASSWORD% -e "CREATE DATABASE %DB_NAME% CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

IF ERRORLEVEL 1 (
    echo [ERRO] Falha ao criar o banco de dados. Verifique a senha ou o status do MySQL Server.
    pause
    goto :EOF
)

REM 3. Importa o arquivo SQL único (Estrutura + Dados)
echo.
echo -> Importando Estrutura e Dados do arquivo %SETUP_FILE%...
%MYSQL_EXE% -u%MYSQL_USER% -p%MYSQL_PASSWORD% %DB_NAME% < %SETUP_FILE%

IF ERRORLEVEL 1 (
    echo [ERRO] Falha ao importar o arquivo SQL. Verifique o conteudo de %SETUP_FILE%.
    pause
    goto :EOF
)

echo.
echo ==========================================================
echo  Banco de dados '%DB_NAME%' inicializado com sucesso!
echo ==========================================================

pause