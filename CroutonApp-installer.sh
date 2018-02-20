echo "Downloading package...";
curl -Lo CroutonApp.tar.gz https://github.com/MCJack123/CroutonApp/raw/master/CroutonAppv1.tar.gz;
mkdir CroutonApp;
cd CroutonApp;
tar -xzf ../CroutonApp.tar.gz;
rm ../CroutonApp.tar.gz;
printf "Please enter the name of the chroot: ";
read NAME;
echo "$NAME" > ~/.croapp_chroot;
if [ "$(sudo edit-chroot -l $NAME | grep xiwi)" == "" ]; then
	printf "Xiwi is missing from your chroot. Would you like to install it? (y/N) ";
	read XIWI;
	if [ "$XIWI" == "Y" || "$XIWI" == "y" ]; then
		if [[ -e "/usr/local/bin/crouton" || -e "/usr/bin/crouton" ]]; then
			crouton -n "$NAME" -t xiwi -u;
		else
			if [ -e "~/Downloads/crouton" ]; then
				sh ~/Downloads/crouton -n "$NAME" -t xiwi -u;
			else
				echo "Cannot find crouton in /usr or in ~/Downloads. Please download crouton and try again.";
				exit;
			fi;
		fi;
	else
		exit;
	fi;
fi;
echo "Checking for nodejs...";
sudo enter-chroot -n "$NAME" sudo apt-get install nodejs;
echo "Copying files...";
sudo cp -n chroot/bin/* "/mnt/stateful_partition/crouton/chroots/$NAME/usr/bin/";
sudo cp -Rn chroot/croutonapp "/mnt/stateful_partition/crouton/chroots/$NAME/usr/share/";
sudo cp -n system/addprogram system/startappserver /usr/local/bin/;
sudo enter-chroot -n "$NAME" initprog;
printf "Would you like to automatically start the server at startup? (y/N)";
read START;
if [ "$START" == "y" || "$START" == "Y" ]; then
    echo "CHROOT=$NAME" > ~/Downloads/crouton.init;
    if [ "$(mount | grep \"on / type\" | grep rw)" == "" ]; then sudo mount -o remount,rw /; fi;
    sudo cp -n system/crouton.conf /etc/init/;
fi;
cd ..;
rm -r CroutonApp;
echo "Installed CroutonApp to chroot $NAME. To start the server manually, run the \"startappserver\" program from a shell. To create an app, run \"addprogram <name> <path> <app name> <app icon path>\" where name is a unique name, path is the path to the program (relative to the chroot), app name is the name of the Chrome App, and app icon is the icon of the Chrome App.";
