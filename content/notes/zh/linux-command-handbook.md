---
locale: zh
translationKey: linux-command-handbook
title: Linux 常用命令速查手册
excerpt: 按使用场景分类，涵盖日常运维与开发中最常用的命令。
publishedAt: 2026-08-30
updatedAt: 2026-08-30
order: 22
category: design
tags: []
draft: false
readingMinutes: 12
---
> 按使用场景分类，涵盖日常运维与开发中最常用的命令。

---

## 一、文件与目录操作

| 命令 | 说明 | 示例 |
|------|------|------|
| `ls` | 列出目录内容 | `ls -la`（显示隐藏文件+详细信息） |
| `cd` | 切换目录 | `cd /home` / `cd ..` / `cd ~` |
| `pwd` | 显示当前工作目录 | `pwd` |
| `mkdir` | 创建目录 | `mkdir -p a/b/c`（递归创建） |
| `rmdir` | 删除空目录 | `rmdir dirname` |
| `rm` | 删除文件或目录 | `rm -rf dirname`（递归强制删除） |
| `cp` | 复制文件或目录 | `cp -r src dst` |
| `mv` | 移动/重命名 | `mv old new` |
| `touch` | 创建空文件/更新时间戳 | `touch file.txt` |
| `ln` | 创建链接 | `ln -s target linkname`（软链接） |
| `tree` | 树形显示目录结构 | `tree -L 2` |

---

## 二、文件查看与编辑

| 命令 | 说明 | 示例 |
|------|------|------|
| `cat` | 查看文件全部内容 | `cat file.txt` |
| `more` | 分页查看（向下翻） | `more file.txt` |
| `less` | 分页查看（上下翻，功能更强） | `less file.txt` |
| `head` | 查看文件开头 | `head -n 20 file.txt` |
| `tail` | 查看文件结尾 | `tail -f log.txt`（实时跟踪） |
| `wc` | 统计行数/字数/字节数 | `wc -l file.txt` |
| `vim` / `vi` | 终端文本编辑器 | `vim file.txt` |
| `nano` | 简易文本编辑器 | `nano file.txt` |
| `grep` | 在文件中搜索文本 | `grep -rn "keyword" .` |
| `sed` | 流编辑器，批量替换 | `sed -i 's/old/new/g' file.txt` |
| `awk` | 文本处理与分析 | `awk '{print $1}' file.txt` |

---

## 三、权限管理

| 命令 | 说明 | 示例 |
|------|------|------|
| `chmod` | 修改文件权限 | `chmod 755 script.sh` / `chmod +x file` |
| `chown` | 修改文件所有者 | `chown user:group file.txt` |
| `chgrp` | 修改文件所属组 | `chgrp groupname file.txt` |
| `umask` | 设置默认权限掩码 | `umask 022` |
| `sudo` | 以超级用户权限执行 | `sudo apt update` |
| `su` | 切换用户 | `su - username` |

**权限数字说明：** `r=4, w=2, x=1`，如 `755` = `rwxr-xr-x`。

---

## 四、进程管理

| 命令 | 说明 | 示例 |
|------|------|------|
| `ps` | 查看进程快照 | `ps aux` / `ps -ef` |
| `top` | 实时查看进程与资源 | `top` |
| `htop` | 增强版 top（需安装） | `htop` |
| `kill` | 终止进程 | `kill -9 PID`（强制终止） |
| `killall` | 按名称终止进程 | `killall nginx` |
| `pkill` | 按模式终止进程 | `pkill -f "python"` |
| `bg` | 将任务放到后台 | `bg %1` |
| `fg` | 将任务调到前台 | `fg %1` |
| `jobs` | 查看后台任务 | `jobs` |
| `nohup` | 忽略挂断信号运行 | `nohup ./app &` |
| `&` | 后台运行命令 | `./script.sh &` |

---

## 五、网络相关

| 命令 | 说明 | 示例 |
|------|------|------|
| `ifconfig` | 查看/配置网络接口（旧） | `ifconfig` |
| `ip` | 网络配置工具（新） | `ip addr` / `ip link` |
| `ping` | 测试网络连通性 | `ping -c 4 google.com` |
| `netstat` | 查看网络连接与端口 | `netstat -tlnp` |
| `ss` | 查看网络连接（替代 netstat） | `ss -tlnp` |
| `curl` | 发送 HTTP 请求 | `curl -I https://example.com` |
| `wget` | 下载文件 | `wget https://example.com/file.zip` |
| `ssh` | 远程登录 | `ssh user@host -p 22` |
| `scp` | 远程复制文件 | `scp file.txt user@host:/path/` |
| `rsync` | 远程/本地文件同步 | `rsync -avz src/ dst/` |
| `dig` | DNS 查询 | `dig example.com` |
| `nslookup` | DNS 查询 | `nslookup example.com` |
| `traceroute` | 追踪路由路径 | `traceroute example.com` |
| `telnet` | 测试端口连通性 | `telnet host 8080` |

---

## 六、系统信息与监控

| 命令 | 说明 | 示例 |
|------|------|------|
| `uname` | 系统信息 | `uname -a` |
| `hostname` | 查看/设置主机名 | `hostname` |
| `uptime` | 系统运行时间与负载 | `uptime` |
| `dmesg` | 内核启动信息 | `dmesg \| tail` |
| `free` | 内存使用情况 | `free -h` |
| `df` | 磁盘使用情况 | `df -h` |
| `du` | 目录/文件大小 | `du -sh /path` |
| `lscpu` | CPU 信息 | `lscpu` |
| `lsblk` | 块设备信息 | `lsblk` |
| `lsof` | 查看打开的文件/端口 | `lsof -i :8080` |
| `vmstat` | 虚拟内存统计 | `vmstat 1` |
| `iostat` | IO 统计 | `iostat -x 1` |
| `sar` | 系统活动报告 | `sar -u 1 5` |
| `date` | 显示/设置时间 | `date` / `date -s "2026-01-01 12:00:00"` |
| `cal` | 显示日历 | `cal 2026` |

---

## 七、压缩与解压

| 命令 | 说明 | 示例 |
|------|------|------|
| `tar` | 打包/解包 | `tar -czvf file.tar.gz dir/`（压缩）<br>`tar -xzvf file.tar.gz`（解压） |
| `zip` | 压缩为 zip | `zip -r file.zip dir/` |
| `unzip` | 解压 zip | `unzip file.zip` |
| `gzip` | gzip 压缩 | `gzip file.txt` |
| `gunzip` | gzip 解压 | `gunzip file.txt.gz` |
| `bzip2` | bzip2 压缩 | `bzip2 file.txt` |
| `bunzip2` | bzip2 解压 | `bunzip2 file.txt.bz2` |
| `xz` | xz 压缩 | `xz -z file.txt` |

**tar 参数速记：** `-c` 创建、`-x` 解压、`-z` gzip、`-j` bzip2、`-J` xz、`-v` 显示过程、`-f` 指定文件。

---

## 八、搜索与查找

| 命令 | 说明 | 示例 |
|------|------|------|
| `find` | 查找文件 | `find / -name "*.log" -type f` |
| `locate` | 快速查找（依赖索引库） | `locate filename` |
| `updatedb` | 更新 locate 索引 | `updatedb` |
| `which` | 查找命令所在路径 | `which python3` |
| `whereis` | 查找命令/手册/源码位置 | `whereis nginx` |
| `grep` | 内容搜索 | `grep -r "error" /var/log/` |
| `rg` | 更快的 grep（ripgrep） | `rg "pattern" .` |

---

## 九、软件包管理

### Debian / Ubuntu（apt）

| 命令 | 说明 |
|------|------|
| `apt update` | 更新软件源索引 |
| `apt upgrade` | 升级所有可更新软件 |
| `apt install pkg` | 安装软件包 |
| `apt remove pkg` | 卸载软件包（保留配置） |
| `apt purge pkg` | 卸载并删除配置 |
| `apt search keyword` | 搜索软件包 |
| `apt show pkg` | 查看包详情 |
| `dpkg -i pkg.deb` | 安装本地 deb 包 |
| `dpkg -l` | 列出已安装包 |

### CentOS / RHEL（yum / dnf）

| 命令 | 说明 |
|------|------|
| `yum install pkg` | 安装软件包 |
| `yum remove pkg` | 卸载软件包 |
| `yum update` | 升级所有软件 |
| `yum search keyword` | 搜索软件包 |
| `yum info pkg` | 查看包详情 |
| `rpm -ivh pkg.rpm` | 安装本地 rpm 包 |
| `rpm -qa` | 列出已安装包 |

### Arch（pacman）

| 命令 | 说明 |
|------|------|
| `pacman -S pkg` | 安装软件包 |
| `pacman -R pkg` | 卸载软件包 |
| `pacman -Syu` | 系统全量升级 |
| `pacman -Ss keyword` | 搜索软件包 |

---

## 十、用户与组管理

| 命令 | 说明 | 示例 |
|------|------|------|
| `useradd` | 创建用户 | `useradd -m -s /bin/bash username` |
| `userdel` | 删除用户 | `userdel -r username`（删除家目录） |
| `usermod` | 修改用户属性 | `usermod -aG sudo username`（追加到组） |
| `passwd` | 修改密码 | `passwd username` |
| `groupadd` | 创建组 | `groupadd groupname` |
| `groupdel` | 删除组 | `groupdel groupname` |
| `id` | 查看用户 ID 与组 | `id username` |
| `whoami` | 显示当前用户名 | `whoami` |
| `w` / `who` | 查看登录用户 | `w` |
| `last` | 查看登录历史 | `last` |

---

## 十一、磁盘与文件系统

| 命令 | 说明 | 示例 |
|------|------|------|
| `fdisk` | 磁盘分区工具 | `fdisk -l`（列出分区） |
| `parted` | 高级分区工具 | `parted /dev/sda` |
| `mkfs` | 格式化文件系统 | `mkfs.ext4 /dev/sdb1` |
| `mount` | 挂载文件系统 | `mount /dev/sdb1 /mnt` |
| `umount` | 卸载文件系统 | `umount /mnt` |
| `blkid` | 查看块设备 UUID | `blkid` |
| `fsck` | 检查修复文件系统 | `fsck /dev/sdb1` |
| `swap` | 交换空间管理 | `mkswap /dev/sdb2` / `swapon /dev/sdb2` |

---

## 十二、服务与系统控制（systemd）

| 命令 | 说明 | 示例 |
|------|------|------|
| `systemctl start` | 启动服务 | `systemctl start nginx` |
| `systemctl stop` | 停止服务 | `systemctl stop nginx` |
| `systemctl restart` | 重启服务 | `systemctl restart nginx` |
| `systemctl status` | 查看服务状态 | `systemctl status nginx` |
| `systemctl enable` | 设置开机自启 | `systemctl enable nginx` |
| `systemctl disable` | 取消开机自启 | `systemctl disable nginx` |
| `systemctl daemon-reload` | 重载服务配置 | `systemctl daemon-reload` |
| `journalctl` | 查看系统日志 | `journalctl -u nginx -f` |
| `reboot` | 重启系统 | `reboot` |
| `shutdown` | 关机 | `shutdown -h now` / `shutdown -r +5` |

---

## 十三、其他实用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| `echo` | 输出文本 | `echo "hello"` |
| `alias` | 设置命令别名 | `alias ll='ls -la'` |
| `history` | 查看命令历史 | `history` / `!100`（执行第100条） |
| `clear` | 清屏 | `clear`（快捷键 `Ctrl+L`） |
| `man` | 查看命令手册 | `man grep` |
| `which` | 查找命令路径 | `which docker` |
| `crontab` | 定时任务 | `crontab -e`（编辑）/ `crontab -l`（查看） |
| `watch` | 周期性执行命令 | `watch -n 1 'df -h'` |
| `xargs` | 参数传递 | `cat files.txt \| xargs rm` |
| `tee` | 同时输出到屏幕和文件 | `ls \| tee output.txt` |
| `sort` | 排序 | `sort file.txt` |
| `uniq` | 去重 | `sort file.txt \| uniq -c` |
| `cut` | 截取列 | `cut -d',' -f1 file.csv` |
| `tr` | 字符替换/删除 | `echo "ABC" \| tr 'A-Z' 'a-z'` |
| `diff` | 比较文件差异 | `diff file1 file2` |
| `patch` | 应用补丁 | `patch < diff.patch` |
| `time` | 统计命令执行时间 | `time ./script.sh` |
| `env` | 查看环境变量 | `env` |
| `export` | 设置环境变量 | `export PATH=$PATH:/usr/local/bin` |
| `source` | 加载配置文件 | `source ~/.bashrc` |

---

## 十四、常用快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + C` | 终止当前命令 |
| `Ctrl + Z` | 挂起当前命令（`fg` 恢复） |
| `Ctrl + D` | 退出当前 shell / EOF |
| `Ctrl + L` | 清屏 |
| `Ctrl + A` | 光标移到行首 |
| `Ctrl + E` | 光标移到行尾 |
| `Ctrl + U` | 删除光标前所有内容 |
| `Ctrl + K` | 删除光标后所有内容 |
| `Ctrl + R` | 反向搜索历史命令 |
| `Tab` | 自动补全命令/路径 |
| `!!` | 执行上一条命令 |
| `!$` | 引用上一条命令的最后一个参数 |

---

## 十五、管道与重定向

| 符号 | 说明 | 示例 |
|------|------|------|
| `\|` | 管道，将前一个命令输出作为后一个输入 | `ps aux \| grep nginx` |
| `>` | 覆盖重定向输出 | `ls > file.txt` |
| `>>` | 追加重定向输出 | `echo "line" >> file.txt` |
| `<` | 输入重定向 | `wc -l < file.txt` |
| `2>` | 重定向错误输出 | `cmd 2> error.log` |
| `2>&1` | 错误输出合并到标准输出 | `cmd > output.log 2>&1` |
| `&>` | 全部输出重定向（简写） | `cmd &> output.log` |

---

> **提示：** 不确定命令用法时，随时使用 `man <命令>` 或 `<命令> --help` 查看详细说明。

