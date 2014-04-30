# use this script by running
# yum -y install dos2unix && wget --no-cache --no-check-certificate -O - http://get.gsdev.info/cloudify-widget-ui/1.0.0/install.sh | dos2unix | bash


install_main(){

    eval "`wget --no-cache --no-check-certificate -O - http://get.gsdev.info/gsat/1.0.0/install_gsat.sh | dos2unix`"

    SYSCONFIG_FILE=widget-ui read_sysconfig

    install_mongo

    install_nginx

    install_node

    upgrade_main


}

upgrade_main(){
    echo "start upgrade_main"
     eval "`wget --no-cache --no-check-certificate -O - http://get.gsdev.info/gsat/1.0.0/install_gsat.sh | dos2unix`"

    echo "upgrade_main, before SYSCONFIG_FILE"
    SYSCONFIG_FILE=widget-ui read_sysconfig



     echo "installing ui npm package from [ $PACKAGE_URL ]"
    PACKAGE_URL=http://get.gsdev.info/cloudify-widget-ui/1.0.0/cloudify-widget-ui-1.0.0.tgz
     mkdir -p /var/www/cloudify-widget-ui
     npm install $PACKAGE_URL -g --prefix /var/www/cloudify-widget-ui

    echo "converting files to unix format"
     find /var/www/cloudify-widget-ui -name "*.sh" -type f -print0 | xargs -0 dos2unix

     echo "chmodding shell scripts for execution"
     find /var/www/cloudify-widget-ui -name "*.sh" -type f -print0 -exec chmod +x {} \;


    echo "installing initd script"
    INSTALL_LOCATION=/var/www/cloudify-widget-ui/lib/node_modules/cloudify-widget-ui
    echo "installing service script under widget-pool"
    SERVICE_NAME=widget-ui SERVICE_FILE=$INSTALL_LOCATION/build/service.sh install_initd_script

    echo "installing me.conf"
    check_exists ME_CONF_URL;



    mkdir -p $INSTALL_LOCATION/conf/dev
    run_wget -O $INSTALL_LOCATION/conf/dev/me.json $ME_CONF_URL
    dos2unix $INSTALL_LOCATION/conf/dev/me.json

    echo "installing/upgrading cloudify from [ $CLOUDIFY_URL ]"
    install_cloudify

    echo "service widget-ui"
    service widget-ui

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