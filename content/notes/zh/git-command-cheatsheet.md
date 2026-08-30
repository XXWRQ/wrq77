---
locale: zh
translationKey: git-command-cheatsheet
title: Git 常用命令速查表
excerpt: 覆盖日常开发 90% 场景的 Git 命令，按使用频率与工作流分组整理。
publishedAt: 2026-08-30
updatedAt: 2026-08-30
order: 21
category: design
tags: []
draft: false
readingMinutes: 10
---
> 覆盖日常开发 90% 场景的 Git 命令，按使用频率与工作流分组整理。

---

## 一、配置与帮助

```bash
# 查看当前配置
git config --list

# 设置用户名与邮箱（首次使用必做）
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"

# 设置默认分支名为 main
git config --global init.defaultBranch main

# 设置命令别名（可选，提升效率）
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit

# 查看某命令的帮助
git help <命令>
git <命令> --help
```

---

## 二、创建与克隆仓库

```bash
# 在当前目录初始化一个新仓库
git init

# 在指定目录初始化仓库
git init <项目名>

# 克隆远程仓库到本地
git clone <仓库地址>

# 克隆并指定本地目录名
git clone <仓库地址> <本地目录名>

# 克隆指定分支
git clone -b <分支名> <仓库地址>
```

---

## 三、基本操作（工作区 → 暂存区 → 本地仓库）

```bash
# 查看工作区状态
git status

# 查看简短状态
git status -s

# 添加单个文件到暂存区
git add <文件名>

# 添加所有修改和新增文件到暂存区
git add .

# 添加所有修改（不含新增文件）
git add -u

# 提交暂存区内容
git commit -m "提交说明"

# 跳过暂存，直接提交所有已跟踪文件的修改
git commit -am "提交说明"

# 修改上一次提交（未推送时使用）
git commit --amend -m "新的提交说明"

# 查看工作区与暂存区的差异
git diff

# 查看暂存区与最近一次提交的差异
git diff --cached
git diff --staged

# 查看两个提交之间的差异
git diff <提交1> <提交2>
```

---

## 四、远程仓库操作

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin <仓库地址>

# 修改远程仓库地址
git remote set-url origin <新仓库地址>

# 移除远程仓库
git remote remove origin

# 从远程获取最新信息（不合并）
git fetch origin

# 拉取远程分支并合并到当前分支
git pull origin <分支名>

# 拉取并使用 rebase 方式合并（保持线性历史）
git pull --rebase origin <分支名>

# 推送本地分支到远程
git push origin <分支名>

# 首次推送并建立跟踪关系
git push -u origin <分支名>

# 强制推送（慎用，会覆盖远程历史）
git push --force origin <分支名>

# 安全强制推送（仅当远程没有别人新提交时才覆盖）
git push --force-with-lease origin <分支名>

# 删除远程分支
git push origin --delete <分支名>
```

---

## 五、分支管理

```bash
# 查看本地分支
git branch

# 查看所有分支（含远程）
git branch -a

# 查看远程分支
git branch -r

# 创建新分支
git branch <分支名>

# 切换分支
git checkout <分支名>
git switch <分支名>

# 创建并切换到新分支
git checkout -b <分支名>
git switch -c <分支名>

# 基于指定分支创建新分支
git checkout -b <新分支名> <基准分支>

# 删除已合并的分支
git branch -d <分支名>

# 强制删除分支（未合并也删）
git branch -D <分支名>

# 重命名当前分支
git branch -m <新分支名>

# 查看分支合并情况
git branch --merged
git branch --no-merged

# 查看每个分支最后一次提交
git branch -v
```

---

## 六、合并与变基

```bash
# 将指定分支合并到当前分支
git merge <分支名>

# 合并时不自动提交（便于检查）
git merge --no-commit <分支名>

# 取消合并（冲突后想放弃）
git merge --abort

# 将当前分支的提交变基到目标分支之上
git rebase <目标分支>

# 交互式变基（可合并/修改/删除提交）
git rebase -i HEAD~n

# 中止变基
git rebase --abort

# 继续变基（解决冲突后）
git rebase --continue

# 跳过当前冲突提交
git rebase --skip

# 挑选某个提交应用到当前分支
git cherry-pick <提交哈希>
```

---

## 七、撤销与回退

```bash
# 丢弃工作区某个文件的修改（恢复到最近一次提交状态）
git checkout -- <文件名>
git restore <文件名>

# 取消暂存（从暂存区移回工作区，修改保留）
git reset HEAD <文件名>
git restore --staged <文件名>

# 回退到指定提交，保留修改在工作区
git reset --soft <提交哈希>

# 回退到指定提交，保留修改在工作区和暂存区（默认）
git reset --mixed <提交哈希>

# 回退到指定提交，彻底丢弃修改（慎用）
git reset --hard <提交哈希>

# 回退到上一次提交
git reset --hard HEAD~1

# 生成一个新提交来撤销指定提交（安全，已推送时推荐）
git revert <提交哈希>

# 撤销合并提交
git revert -m 1 <合并提交哈希>

# 查看所有操作记录（包括已删除的提交，用于找回）
git reflog
```

---

## 八、暂存（Stash）

```bash
# 暂存当前工作区和暂存区的修改
git stash

# 暂存并添加说明
git stash save "说明文字"

# 暂存包含未跟踪文件
git stash -u

# 查看暂存列表
git stash list

# 恢复最近一次暂存（保留暂存记录）
git stash apply

# 恢复指定暂存
git stash apply stash@{n}

# 恢复最近一次暂存并删除该记录
git stash pop

# 删除指定暂存
git stash drop stash@{n}

# 清空所有暂存
git stash clear

# 基于某个暂存创建新分支
git stash branch <分支名> stash@{n}
```

---

## 九、标签（Tag）

```bash
# 查看所有标签
git tag

# 查看匹配的标签
git tag -l "v1.*"

# 创建轻量标签
git tag <标签名>

# 创建带注释的标签（推荐）
git tag -a <标签名> -m "标签说明"

# 给指定提交打标签
git tag -a <标签名> <提交哈希> -m "说明"

# 查看标签详情
git show <标签名>

# 推送单个标签到远程
git push origin <标签名>

# 推送所有标签到远程
git push origin --tags

# 删除本地标签
git tag -d <标签名>

# 删除远程标签
git push origin --delete <标签名>
```

---

## 十、查看历史

```bash
# 查看提交历史
git log

# 单行显示提交历史
git log --oneline

# 图形化显示分支合并历史
git log --graph --oneline --all

# 查看最近 n 条提交
git log -n

# 查看指定作者的提交
git log --author="名字"

# 按关键词搜索提交说明
git log --grep="关键词"

# 查看某个文件的修改历史
git log -- <文件名>

# 查看某个文件每一行是谁在什么时候修改的
git blame <文件名>

# 查看某次提交的详细改动
git show <提交哈希>

# 查看某次提交改了哪些文件
git show --stat <提交哈希>
```

---

## 十一、其他实用命令

```bash
# 查看哪些文件被 Git 跟踪
git ls-files

# 查看未跟踪文件
git ls-files --others --exclude-standard

# 让 Git 忽略对某个已跟踪文件的修改
git update-index --assume-unchanged <文件名>

# 恢复跟踪
git update-index --no-assume-unchanged <文件名>

# 清理未跟踪的文件和目录（先预览再加 -f）
git clean -n      # 预览
git clean -f      # 删除未跟踪文件
git clean -fd     # 删除未跟踪文件和目录

# 查看仓库大小统计
git count-objects -vH

# 打包优化仓库
git gc

# 验证仓库完整性
git fsck
```

---

## 十二、常见工作流示例

### 1. 日常提交流程
```bash
git pull origin main          # 先拉取最新代码
git checkout -b feature/xxx   # 新建功能分支
# ... 写代码 ...
git add .
git commit -m "feat: 完成xxx功能"
git push -u origin feature/xxx
```

### 2. 解决合并冲突
```bash
git merge <分支名>
# 打开冲突文件，手动解决 <<<<<<< ======= >>>>>>> 标记
git add <冲突文件>
git commit -m "merge: 解决冲突"
```

### 3. 撤销已推送的错误提交
```bash
git revert <错误提交哈希>    # 生成反向提交，安全
git push origin main
```

### 4. 把当前未完成工作暂存去修 bug
```bash
git stash                     # 暂存当前工作
git checkout -b hotfix/xxx    # 切到修复分支
# ... 修复并提交 ...
git checkout feature/xxx      # 回到原分支
git stash pop                 # 恢复暂存的工作
```

---

## 十三、.gitignore 常用规则

```bash
# 忽略指定文件
secret.key

# 忽略目录
node_modules/
dist/
build/

# 忽略某类文件
*.log
*.tmp
*.class

# 取反（不忽略）
!important.log

# 忽略根目录下的文件（不递归）
/todo.txt
```

---

> **提示**：记不住命令时，`git help <命令>` 或 `git <命令> -h` 随时查看官方文档。

