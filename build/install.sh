# use this script by running
# wget --no-cache --no-check-certificate -O - http://get.gsdev.info/cloudify-widget-ui/1.0.0/install.sh | dos2unix | bash


install_main(){

    eval "`wget --no-cache --no-check-certificate -O - http://get.gsdev.info/gsat/1.0.0/install_gsat.sh | dos2unix`"


    install_mongo

    install_node

    upgrade_main


}

upgrade_main(){


     mkdir /opt/cloudify-widget-ui
     npm install http://get.gsdev.info/cloudify-widget-ui/1.0.0/cloudify-widget-ui-1.0.0.tgz -g --prefix /opt/cloudify-widget-ui

     dos2unix /opt/cloudify-widget-ui/**/*.sh
     chmod +x /opt/cloudify-widget-ui/**/*.sh

}

set -e
if [ "$1" = "upgrade" ];then
    echo "upgrading"
    upgrade_main
else
    echo "installing..."
    install_main
fi
set +e