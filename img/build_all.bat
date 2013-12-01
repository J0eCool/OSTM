@echo off

rmdir /s /q build
mkdir build

call make_spritesheet.bat Enemies build\enemies.png