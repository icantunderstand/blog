git branch | grep ‘dev*’ | xargs git branch -d

## nginx


* 查找nginx进程
ps -ef | grep nginx
* 通过配置文件启动nginx
nginx -c  /etc/nginx/nginx.conf  // nginx配置文件

* scp指令

$scp local_file remote_username@remote_ip:remote_folder
