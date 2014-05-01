cd "$(dirname "$0")"
echo `pwd`
source /etc/sysconfig/widget-ui
node server.js $PORT &
echo $! > /var/run/widgetui.pid