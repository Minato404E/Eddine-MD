Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")
root = fso.GetParentFolderName(fso.GetParentFolderName(WScript.ScriptFullName))
shell.Run "powershell.exe -NoProfile -ExecutionPolicy Bypass -File """ & root & "\scripts\supervisor.ps1""", 0, False
