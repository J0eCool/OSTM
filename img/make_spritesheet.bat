@echo off
setlocal

if not "%1"=="" (
if not "%2"=="" (
	del %2
	montage -background transparent -geometry +4+4 %~dp0%1\*.png %2
))
