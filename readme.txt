
Run "Sugar Conflict X Viewer.exe" to play.
Do not run the file "Sugar Conflict X Viewer.html" directly or you will get CORS errors when playing an animated scene since the spine player runtime requires direct file access.

All the viewer's content is in the folder: "package.nw", the rest is a standard nwjs install.
You can download nwjs from: "https://nwjs.io/downloads/", extract it and then copy the folder "package.nw" to the extracted nwjs folder and then run: "nw.exe" to play.
Also download the ffmpeg binary with proprietary codecs from: "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/tag/0.72.0"

If you don't want to use nwjs you can run: "Sugar Conflict X Viewer.html" directly, but you have to pass the argument: "--allow-file-access-from-files" to chrome for it to work correctly.

This is a Windows 7/8/8.1/10/11 64bit install, if you use Linux or MacOS, download nwjs from the link above and copy the "package.nw" folder to the extracted nwjs folder, 
then run: ./nw on linux or nwjs.app/Contents/MacOS/nwjs on MacOS.

If you use Android you can download the app: "Simple HTTP Server", start the server then copy the main folder to your Android device in the location
specified in "Root folder" inside the app which on your computer should be something like: "Android\data\com.phlox.simpleserver\files"
Then you can open chrome in Android and start the viewer by typing in the URL bar the location to the *.html file
Ex: localhost:8080/Sugar Conflict X Viewer/package.nw/Sugar Conflict X Viewer.html

Win 32bit users need to use this nwjs version instead: https://dl.nwjs.io/v0.72.0/nwjs-sdk-v0.72.0-win-ia32.zip
Win XP/Vista is not supported.

To uninstall, delete the main folder plus the folder at: "%localappdata%\sugar_conflict_x_viewer"