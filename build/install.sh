upgrade_main(){

    wget --no-cache --no-check-certificate -O - http://get.gsdev.info/gsat/1.0.0/install_gsat.sh | dos2unix | bash

    source /opt/gsat/gsui_functions.sh

    install_mysql

    install_node

    mkdir /opt/cloudify-widget-ui
    run_wget -O /opt/cloudify-widget-ui/cloudify-widget-ui-1.0.0.tgz http://get.gsdev.info/cloudify-widget-ui/1.0.0/cloudify-widget-ui-1.0.0.tgz
}
upgrade_main