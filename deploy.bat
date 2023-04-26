@echo off
set /p commit-comments = "Commiting changes"

::if [%1] NEQ [] ( 
::   set /p commit-comments =  %1
::)

::echo %commit-comments%
@echo commit-comments
::@echo Adding files to staging
git add --all
::@echo Commit changes
:echo %commit-comments%
git commit -m /"%commit-comments%/"

@echo Pushing to remote server
git push