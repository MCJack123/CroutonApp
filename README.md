# CroutonApp
Creates Chrome App links to programs inside a Crouton chroot.

# Requirements
* An internet connection
* Crouton chroot
* Node.js installed inside the chroot (autoinstalls)
* Xiwi installed to the chroot (autoinstalls)

# Installation
Run `bash <(curl -s https://raw.githubusercontent.com/MCJack123/CroutonApp/master/CroutonApp-installer.sh)` to install.

# Starting the server
You can run `startappserver` outside the chroot or `startgameserver` inside the chroot to start the server. It must be running for any apps to be able to run.

# Adding a program
`addprogram <name> <path> <app name> <app icon>` (either inside or outside the chroot)
* `name`: The internal name of the app
* `path`: The path of the file inside the chroot
* `app name`: The name of the Chrome App
* `app icon`: The path of the icon  
If `name` is one of `gnome, lxde, kde, xfce, unity`, the path will automatically be used from the script and it will launch in fullscreen. If you want to have your desktop inside a window, name your app something else and put the path to the launcher as the path.  
When it finishes, the file will be dropped into your Downloads folder as <name>.crx if you ran it outside the chroot.  
After creating the program, you need to restart the server by running the following (use the one depending on if you started the server on boot):
  With startup service:  
    
    sudo /sbin/initctl stop crouton
    sudo /sbin/initctl start crouton
    
  Without startup service:  
    
    sudo killall node
    startappserver
    

