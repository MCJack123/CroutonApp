echo "Downloading package...";
curl http://cppconsole.bruienne.com/counter.php?counter=croutonappinstall&update > /dev/null # for analytics ;)
curl -Lo CroutonApp.tar.gz https://github.com/MCJack123/CroutonApp/raw/master/CroutonAppv2.tar.gz;
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
	if [ "$XIWI" == "y" ] || [ "$XIWI" == "Y" ]; then
		if [ -e "/usr/local/bin/crouton" ] || [ -e "/usr/bin/crouton" ]; then
			crouton -n "$NAME" -t xiwi -u;
		else
			if [ -e "~/Downloads/crouton" ]; then
				sh ~/Downloads/crouton -n "$NAME" -t xiwi -u;
			else
				echo "Could not find existing copy of crouton. Downloading...";
				curl -sL https://github.com/dnschneid/crouton/raw/master/installer/crouton | bash -s -- -n "$NAME" -t xiwi -u;
			fi;
		fi;
		if [ $? -ne 0 ]; then
			echo "A problem occurred while installing xiwi. Exiting...";
			cd ..;
			rm -r CroutonApp;
			exit 2;
		fi;
	else
		echo "Exiting...";
		cd ..;
		rm -r CroutonApp;
		exit 1;
	fi;
fi;
echo "Checking for nodejs...";
sudo enter-chroot -n "$NAME" "curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -; sudo apt-get install -y nodejs";
echo "Copying files...";
sudo cp chroot/bin/* "/mnt/stateful_partition/crouton/chroots/$NAME/usr/bin/";
sudo cp -R chroot/croutonapp "/mnt/stateful_partition/crouton/chroots/$NAME/usr/share/";
sudo cp system/addprogram system/startappserver /usr/local/bin/;
sudo enter-chroot -n "$NAME" initprog;
printf "Would you like to automatically start the server at startup? (y/N)";
read START;
if [ "$START" == "y" ] || [ "$START" == "Y" ]; then
    echo "CHROOT=$NAME" > ~/Downloads/crouton.init;
    if [ "$(mount | grep \"on / type\" | grep rw)" == "" ]; then sudo mount -o remount,rw /; fi;
    sudo cp -n system/crouton.conf /etc/init/;
    echo "If you need to restart the server, you can run 'sudo initctl restart crouton' to restart.";
fi;
cd ..;
rm -r CroutonApp;
echo "Installed CroutonApp to chroot $NAME. To start the server manually, run the \"startappserver\" program from a shell. To create an app, run \"addprogram <name> <path> <app name> <app icon path>\" where name is a unique name, path is the path to the program (relative to the chroot), app name is the name of the Chrome App, and app icon is the icon of the Chrome App.";
