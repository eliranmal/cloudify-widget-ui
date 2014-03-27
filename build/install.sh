# use this script by running
# yum -y install dos2unix && wget --no-cache --no-check-certificate -O - http://get.gsdev.info/cloudify-widget-ui/1.0.0/install.sh | dos2unix | bash


install_main(){

    eval "`wget --no-cache --no-check-certificate -O - http://get.gsdev.info/gsat/1.0.0/install_gsat.sh | dos2unix`"

    SYSCONFIG_FILE=widget-ui read_sysconfig

    install_mongo

    install_node

    upgrade_main


}

upgrade_main(){
     eval "`wget --no-cache --no-check-certificate -O - http://get.gsdev.info/gsat/1.0.0/install_gsat.sh | dos2unix`"

    SYSCONFIG_FILE=widget-ui read_sysconfig

     mkdir -p /opt/cloudify-widget-ui
     npm install http://get.gsdev.info/cloudify-widget-ui/1.0.0/cloudify-widget-ui-1.0.0.tgz -g --prefix /opt/cloudify-widget-ui

     dos2unix /opt/cloudify-widget-ui/**/*.sh
     chmod +x /opt/cloudify-widget-ui/**/*.sh

    INSTALL_LOCATION=/opt/cloudify-widget-ui/lib/node_modules/cloudify-widget-ui
    echo "installing service script under widget-pool"
    SERVICE_NAME=widget-ui SERVICE_FILE=$INSTALL_LOCATION/build/service.sh install_initd_script

    check_exists ME_CONF_URL;
    check_exists SYSCONF_URL;


    mkdir -p $INSTALL_LOCATION/conf/dev
    run_wget -O $INSTALL_LOCATION/conf/dev/me.json $ME_CONF_URL
    dos2unix $INSTALL_LOCATION/conf/dev/me.json

    echo "upgrading sysconfig file"
    SYSCONFIG_FILE=/etc/sysconfig/widget-ui.sh
    run_wget -O $SYSCONFIG_FILE $SYSCONF_URL
    dos2unix  $SYSCONFIG_FILE
    chmod +x $SYSCONFIG_FILE

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