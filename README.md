# CroutonApp
Creates Chrome App links to programs inside a Crouton chroot.

# Prerequisites
* An internet connection at all times
* Crouton chroot

# Installation
Run `bash <(curl -sL https://raw.githubusercontent.com/MCJack123/CroutonApp/master/CroutonApp-installer.sh)` to install.

# Starting the server
You can run `startappserver` outside the chroot or `startgameserver` inside the chroot to start the server. It must be running for any apps to be able to run.

# Adding a program
`addprogram <name> <path> [-n <app name>] [-i <app icon>] [-w|-f]` (either inside or outside the chroot)
* `name`: The internal name of the app
* `path`: The path of the file inside the chroot
* `app name`: The name of the Chrome App
* `app icon`: The path of the icon  
* `-w|-f`: Specifies to run in xiwi or xorg (windowed or fullscreen)
 
When it finishes, the file will be dropped into your Downloads folder as <name>.crx if you ran it outside the chroot.  
After creating the program, you need to restart the server by running the following (depending on if you installed the startup service):    
     
     With startup service:  
     sudo /sbin/initctl restart crouton
     
     Without startup service:
     sudo killall node
     startappserver
     
     
