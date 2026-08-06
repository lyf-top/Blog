---
title: git配置
description: git学习之路开启
image: 'https://img.f3f3.top/img/2026/05/26/08ab27822845e43eccb51724ba1aaa7d.webp' #文章封面页
tags:
  - git认识与进阶
category:  运维
  #永久连接id
abbrlink: "57575127547"
# 文章置顶
pinned: false #文章置顶
published: 2026-07-24 20:19:03
updated: 2026-07-24 21:43:03
---



认识

### Git

通俗解释：Git 是装在你电脑上的"本地版本日记本"，每次提交就像在日记本上盖一个时间戳，记录"谁在什么时候改了什么"。

技术解释：Git 是一个开源的分布式版本控制系统，完全运行在本地，不需要网络也能追踪文件变更、创建分支、回滚历史。

例子：你改了一段代码，发现改错了，但已经保存了。Git 可以让你回到任意一个之前的版本，而不依靠 Ctrl+Z

### GitHub

通俗解释：GitHub 是互联网上的"共享版本日记柜"，让团队所有人都可以把各自的本地日记本同步到同一个地方，看到彼此的进度。

技术解释：GitHub 是一个基于 Git 的远端代码托管平台，提供仓库存储、分支保护、Pull Request、Issue、代码审查、Actions（自动化）等协作功能。

例子：老师建了一个 GitHub 仓库，你把它 clone 到本地，改完 push 回去，再发一个 PR 请老师 review，就完成了一次完整协作。

### 仓库

通俗解释：仓库是一个文件夹加上这个文件夹里所有文件的完整修改历史。

技术解释：Git 仓库是一个包含 `.git` 隐藏目录的文件夹，`.git` 里存放了所有提交历史、配置和引用信息。

例子：`C:\Users\Firebat\zhongwen-shortdrama-context` 如果里面有 `.git` 目录，它就是一个本地 Git 仓库。

### 本地与远端

通俗解释：本地是你自己电脑上的副本，远端是 GitHub 上的副本。它们不会自动同步，需要手动 push 或 pull。

技术解释：本地仓库（local repository）存在于你的磁盘上，远端仓库（remote repository）存在于 GitHub 等平台上。两者通过 push/pull/fetch 交换数据。

例子：你在本地写了三个 commit，但没有 push，GitHub 上是看不到的。同样，队友 push 了新内容，你本地也看不到，需要 pull 才能同步。

Git 负责本地的版本追踪，GitHub 负责远端的存储和协作。两者角色不同，但配合使用

本地和远端不会自动同步，需要手动 pull

push 之前必须先 commit，commit 之前还要 add。push 只是"上传"，commit 才是"保存版本"

```
你的电脑（本地）
├── Git 追踪文件变化
├── Git 管理分支
└── Git 记录 commit 历史
         ↕  push / pull / fetch
GitHub（远端）
├── 存储代码和历史
├── 展示 PR 和 Review
└── 保护 main 分支
```

```
老师在 GitHub 上创建仓库（远端已有代码）
2. 你 clone 到本地（本地有了一份副本）
3. 你新建一个分支（不影响 main）
4. 你修改文件（本地工作区变化）
5. git add → git commit（保存到本地历史）
6. git push（上传到 GitHub）
7. 在 GitHub 发起 Pull Request（请老师 review）
8. 老师 review 并 merge（代码合进 main）
9. 你 git pull 更新本地（同步最新 main）
```

### git记录

它记录每次提交时哪些行被增加、删除、修改，以及谁提交的、什么时候提交的。

```
commit 3a7b1d9
Author: Firebat <firebat@example.com>
Date:   2026-06-26

    docs: 添加第三周周报

    新增文件 docs/weekly/2026-W26.md
    修改 README.md 第 5 行
```

## 配置git和ssh

### gitconfig

git config 像填写一份工作牌，告诉 Git "我叫什么名字、我的邮箱是什么"，这样每条提交记录都能标注是你写的。

技术解释：git config 命令用来设置 Git 的配置项，`--global` 表示全局生效（对这台电脑上所有仓库有效），不加则只对当前仓库生效。

### 公钥

- 公钥是你家门上挂的"锁"，可以公开给任何人
- 公钥是 SSH 密钥对中可以公开分享的部分，通常是 `.pub` 后缀的文件，添加到 GitHub 账号设置中，让 GitHub 认识你。


例子：文件 `C:\Users\Firebat\.ssh\id_ed25519.pub` 里的内容就是公钥，可以粘贴到 GitHub

### 私钥

- 私钥是只有你自己有的"钥匙"，绝对不能发给别人
- 私钥是 SSH 密钥对中绝对保密的部分，存储在本地，从不上传。身份验证时，本地用私钥生成签名，GitHub 用公钥验证。


例子：文件 `C:\Users\Firebat\.ssh\id_ed25519`（没有 .pub 的那个）就是私钥，只能存在你自己电脑上。

### remote

- **通俗解释**：HTTPS 连接方式就像用**账号密码**登网站，每次操作都可能需要输入用户名和密码（或 Token）。
- **技术解释**：HTTPS remote 地址格式是 `https://github.com/用户名/仓库名.git`，通过 HTTPS 协议连接，需要凭据认证。

```
git remote add origin https://github.com/Firebat/zhongwen-shortdrama-context.git` 
```

- 通俗解释：SSH 连接方式配置好之后一劳永逸，不用每次输密码，靠密钥对自动认证。

- 技术解释：SSH remote 地址格式是 `git@github.com:用户名/仓库名.git`，通过 SSH 协议连接，使用本地私钥自动认证。


```
git remote add origin git@github.com:Firebat/zhongwen-shortdrama-context.git`
```

### 配置git

```
# 配置全局用户名
git config --global user.name "Firebat"

# 配置全局邮箱（建议和 GitHub 账号邮箱保持一致）
git config --global user.email "firebat@example.com"

# 查看所有配置
git config --list


user.name=Firebat    只是 commit 的署名
user.email=firebat@example.com
core.autocrlf=true
```

- 这两个信息会出现在每一条 commit 记录里，是团队协作的基本标注

- `--global` 是全局配置，对这台电脑上所有仓库生效。如果某个仓库需要不同身份，在该仓库目录里用不带 `--global` 的命令单独设置。

### SSH(无密访问)

- 通俗解释：SSH 像给你和 GitHub 之间建了一条专属的加密隧道，不用每次都输密码，而是靠"认识你的密钥对"来确认身份。

- 技术解释：SSH（Secure Shell）是一种加密网络协议，用于安全地访问远端服务器。Git 使用 SSH 连接 GitHub 时，通过公私钥对进行身份验证。


配置好 SSH 后，`git push` 时不需要输用户名密码，GitHub 通过你的密钥自动识别你的身份。

#### 生成密钥

SSH 密钥对在本地生成，私钥留在本机，公钥上传到 GitHub。

```
生成 SSH Key（推荐 ed25519 算法，更安全）

ssh-keygen -t ed25519 -C "2860556024@qq.com"

一路回车即可（不需要设置密码短语，除非你需要额外保护）
```

```
Generating public/private ed25519 key pair.
Enter file in which to save the key (C:\Users\Firebat/.ssh/id_ed25519):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in C:\Users\Firebat/.ssh/id_ed25519
Your public key has been saved in C:\Users\Firebat/.ssh/id_ed25519.pub
```

**注意事项：看到两个文件：`id_ed25519`（私钥）和 `id_ed25519.pub`（公钥）。私钥绝对不能发给任何人**

#### 查看公钥

```
# 查看公钥内容
Get-Content C:\Users\LYF\.ssh\id_ed25519.pub

# 或者用 cat（PowerShell 里也可以）
cat ~/.ssh/id_ed25519.pub
```

全部复制这一行，包括开头的 `ssh-ed25519` 和结尾的邮箱。

注意事项：复制时不要多复制空格或换行，否则 GitHub 会提示"无效的 Key"。

#### 添加到 GitHub

```
1. 打开 GitHub → 右上角头像 → Settings
2. 左侧菜单 → SSH and GPG keys
3. 点击 New SSH key
4. Title 填一个好认的名字，比如 "Firebat-Windows-2026"
5. Key type 选 Authentication Key
6. Key 里粘贴刚才复制的公钥内容
7. 点击 Add SSH key
```

#### 测试连接

```
ssh -T git@github.com

ssh -T git@gitee.com

# 成功的输出
Hi Firebat! You've successfully authenticated, but GitHub does not provide shell access.

# 失败的输出
Permission denied (publickey).
```

## 克隆仓库

### git clone

```
git clone git@github.com:Firebat/zhongwen-shortdrama-context.git
# 方式一：SSH（推荐，配置好 SSH Key 后使用）
git clone git@github.com:Firebat/zhongwen-shortdrama-context.git

# 方式二：HTTPS
git clone https://github.com/Firebat/zhongwen-shortdrama-context.git

# 克隆到指定目录名（可选）
git clone git@github.com:Firebat/zhongwen-shortdrama-context.git my-project

```

**本地出现同名目录，里面有 `.git` 目录（版本历史）和所有项目文件**

**包含所有文件、所有提交历史、所有分支信息，并自动设置 origin 远端地址。**

### remote

```
`git remote -v` 显示当前仓库所有远端地址和它们的别名

# 查看所有 remote 名称
git remote
# 查看 remote 名称和对应地址（-v 是 --verbose，详细模式）
git remote -v
```

```
origin  git@github.com:Firebat/zhongwen-shortdrama-context.git (fetch)
origin  git@github.com:Firebat/zhongwen-shortdrama-context.git (push)
```

**Remote 是 Git 中指向远端仓库 URL 的命名引用，用 `git remote` 命令管理，可以有多个 remote 指向不同的远端。**

```
# 查看当前 remote 地址
git remote -v

# 切换为 SSH 地址
git remote set-url origin git@github.com:Firebat/zhongwen-shortdrama-context.git

# 再次确认
git remote -v
//切换地址后，下次 push/pull 就会用新地址。不需要重新 clone
```

```
 查看所有分支（含远端）
git branch -a
```

```
4. 记录下 origin/main 对应的最后一个 commit hash
git log origin/main --oneline -3
对比本地 main 最新的 commit 和 origin/main 最新的 commit 是否一致。
```



### origin

```
git push origin main
//把本地 main 分支推送到叫 origin 的那个远端仓库
//origin/main 只在 fetch/pull 时更新，不是实时的。队友 push 了新代码，你的 origin/main 不会自动变。
```

**origin 是 `git clone` 自动创建的 remote 别名，指向你克隆的那个 GitHub 仓库地址。后续 push/pull 默认操作的就是 origin。**

### 区别

```
远端 GitHub（origin）
└── main: A - B - C - D  ← 队友今天 push 了 D

你本地
├── main: A - B - C      ← 你还没 pull，本地是昨天的状态
└── origin/main: A - B - C  ← 这是上次 fetch 时的快照，也是旧的

执行 git pull 之后：
├── main: A - B - C - D  ← 更新到最新
└── origin/main: A - B - C - D  ← 也同步了快照
```

`git status` 里如果显示 `Your branch is behind 'origin/main' by 1 commit`，不是说 origin/main 是最新的，而是说你本地的 main 落后于你上次 fetch 时拿到的快照。实际远端可能更新了更多

## 区域

### 工作区

工作区就是你用编辑器看到和修改的那些文件，是你实际工作的地方

### git add暂存区

- 暂存区让你可以精确控制这次 commit 包含哪些改动，而不是必须把所有修改都一起提交。
- 介于工作区和本地仓库之间的缓冲层，`git add` 把工作区的改动放入暂存区，`git commit` 把暂存区的内容打包成一个提交。
- 你改了 3 个文件，但只想提交其中 2 个，可以只 `git add` 那 2 个文件，然后 commit，第 3 个文件留在工作区继续改。

```
情景：你同时修改了 3 个文件
  - docs/weekly/2026-W26.md    ← 这周的周报，写完了
  - src/main.py                ← 正在写的功能，还没完成
  - README.md                  ← 随手改了一个错别字

理想方案：把周报和 README 分两个 commit 提交，src/main.py 先不提交

操作：
git add docs/weekly/2026-W26.md
git commit -m "docs: 新增 2026-W26 周报"

git add README.md
git commit -m "fix: 修正 README 错别字"

# src/main.py 继续在工作区，不影响上面两个 commit
```

### 本地仓库

本地仓库像一本存档完整的日记本，每次 commit 都是一条不可删改的日记，永久保留。

技术解释：Repository 是 `.git` 目录里存放的提交历史、分支、标签等所有版本控制数据的集合，commit 之后的内容就进入这里。

**`git log` 显示的每一条记录，都是存在本地仓库里的一个快照。**

### Commit提交

**commit 像给工作存档，把你这次改动和一条说明文字一起打包，附上时间戳和作者，永久存在历史里。**

```
# 基本提交（-m 后跟 commit message）
git commit -m "docs: 添加 2026-W26 周报"

# 提交时查看暂存区内容（进入编辑器写多行 message）
git commit

# 修改最近一次 commit message（只改信息，不改代码）
# ⚠️ 注意：只能改本地还未 push 的 commit
git commit --amend -m "docs: 修正周报标题格式"
#--amend` 会改变 commit 的 hash，push 过的 commit 被修改后，和远端历史不一致，会导致 push 失败甚至历史混乱。

#实战
# 1. 新建练习分支
git switch main
git pull
git switch -c feat/commit-practice

# 2. 新建一个练习文件
New-Item docs\practice-commit.txt
Add-Content docs\practice-commit.txt "这是一个练习文件"

# 3. 完整提交流程
git status
git add docs\practice-commit.txt
git status
git commit -m "docs: 添加 commit 练习文件"

# 4. 查看提交结果
git log --oneline -3

# 5. 清理（切回 main 删分支）
git switch main
git branch -d feat/commit-practice
```

```
✅ 好的 commit message：
  docs: 新增 2026-W26 周报
  docs(weekly): 添加唐玲欣第26周周报
  fix: 修复用户名显示为 undefined 的问题
  feat: 新增按日期筛选任务的功能
  chore: 升级 fastapi 依赖到 0.115.0

❌ 不好的 commit message：
  update
  修改
  fix bug
  改了点东西
  123
  asdfgh
  test
```

| type       | 含义     |              使用场景              |
| ---------- | -------- | :--------------------------------: |
| `feat`     | 新功能   |      添加了一个新功能或新内容      |
| `fix`      | 修复 bug |           修复了一个问题           |
| `docs`     | 文档变更 |     改了 README、添加了周报等      |
| `style`    | 格式调整 | 代码格式、空格、缩进（不影响功能） |
| `refactor` | 重构     |       代码结构优化，不改功能       |
| `test`     | 测试     |           添加或修改测试           |
| `chore`    | 杂项     |        依赖更新、配置变更等        |

**push 就是 commit。  
解释：commit 是把改动保存到本地历史，push 是把本地历史上传到 GitHub，是两步独立操作。**

**一个 commit 有唯一的 hash 值（如 `3a7b1d9`），可以随时回到这个状态。**

```
┌──────────────────────────────────────────────────────────┐
│                         你的电脑                          │
│                                                          │
│  ┌─────────────┐   git add   ┌──────────────┐           │
│  │  Working    │ ──────────► │   Staging    │           │
│  │  Tree       │ ◄────────── │   Area       │           │
│  │  工作区     │  git restore │   暂存区     │           │
│  └─────────────┘             └──────┬───────┘           │
│                                     │ git commit         │
│                                     ▼                    │
│                              ┌──────────────┐           │
│                              │  Repository  │           │
│                              │  本地仓库    │           │
│                              └──────────────┘           │
└──────────────────────────────────────────────────────────┘
         ↕  git push / git pull / git fetch
┌──────────────────────────────────────────────────────────┐
│                    GitHub（远端）                         │
└──────────────────────────────────────────────────────────┘
```

- **push/pull 只在本地仓库和远端之间操作，不直接涉及工作区和暂存区**



- **commit message 是 `git commit -m "..."` 引号里的文字，附加在这次提交上，出现在 `git log` 里，是团队协作和项目维护的重要文档。**

- **约定式提交：格式为 `type(scope): description`，其中 scope 可选，type 固定为几种类型。**

- **例子：`docs(weekly): 添加 2026-W26 周报`、`feat(auth): 新增 JWT 登录功能**

### 查看改动

```
# 查看工作区 vs 暂存区的差异（改了但还没 add 的内容）
git diff

# 查看暂存区 vs 最近一次 commit 的差异（已 add 但还没 commit 的内容）
git diff --staged

# 查看工作区 vs 最近一次 commit 的总差异
git diff HEAD
```

**`git diff` 什么都不显示，不代表"没有修改"，可能是修改都已经 add 进暂存区了。这时要用 `git diff --staged` 才能看到。**

### 完整

```
# 第一步：新建一个文件
# 此时文件状态：Untracked（未追踪，Git 不认识它）
New-Item docs\weekly\2026-W26.md

# 查看状态
git status
# 输出：Untracked files: docs/weekly/2026-W26.md

# 第二步：git add 把文件放入暂存区
# 此时文件状态：Staged（已暂存）
git add docs\weekly\2026-W26.md

# 查看状态
git status
# 输出：Changes to be committed: new file: docs/weekly/2026-W26.md

# 第三步：git commit 把暂存区的内容打包成提交
# 此时文件进入本地仓库
git commit -m "docs: 新增 2026-W26 周报"


# 查看状态
git status
# 输出：nothing to commit, working tree clean

# 还可以5. 从暂存区取出（不提交这个测试文件）
git restore --staged test-staging.txt


# 查看历史
git log --oneline -3


# 7. 删除这个测试文件（清理）
Remove-Item test-staging.txt
```

## 分支

新建 `feat/weekly-tanglx-report` 分支，在这个分支上改文件，main 分支完全不受影响。

### main

- main（旧称 master）是 Git 仓库的默认主分支，通常代表生产可用的稳定代码，团队约定不直接在 main 上做未经审查的修改。

- 老师、同学、所有人看到的"正式版本"都是 main，你的个人改动都应该在自己的 feature branch 上

**不能修改main分支**

**直接在 main 上改东西，会绕过 review 流程，影响所有人，出错无法隔离。**

```
错误做法（直接在 main 上改）：
  main: A - B - C - [你的改动D]  ← 直接改了 main
  问题1：绕过了 PR，没有人 review 你的改动
  问题2：如果 D 有 bug，所有人的 main 都受影响
  问题3：很多团队仓库会保护 main，直接 push 会被拒绝

正确做法（建功能分支）：
  main: A - B - C              ← main 不受影响
  feat/xxx: A - B - C - D      ← 你的改动在这里
  改完 → push feat/xxx → 开 PR → review → merge 进 main
```

**团队项目的 main 通常设置了 Branch Protection Rules，直接 push main 会被 GitHub 拒绝。**

### 功能分支

- 你为了完成一个具体任务而新建的专属分支，用完就可以删掉

- Feature branch 是从 main 或其他分支派生出来的临时工作分支，命名通常包含任务类型和描述，如 `feat/xxx`、`fix/xxx`、`docs/xxx`。

- 例子：写周报 → 建 `docs/weekly-tanglx-w26`；修一个 bug → 建 `fix/login-error`。

- 分支只是一个指针，不复制文件，**切换分支是改变 HEAD 指向，Git 会更新工作区到对应版本**

### head

- HEAD 是"你现在在哪里"的标记，像书签一样插在当前分支的最新 commit 上
- HEAD 是 Git 中指向当前所在 commit 或分支的引用，通常指向某个分支名，切换分支就是移动 HEAD。

- 例子：`git log` 里显示 `(HEAD -> feat/weekly-tanglx-report)` 说明你现在在这个分支上

### 远端分支

- 远端分支是 GitHub 上的分支，你 push 之后 GitHub 才有，不 push 的话只存在你本地。

- 老师、同学、所有人看到的"正式版本"都是 main，你的个人改动都应该在自己的 feature branch 上

本地分支和远端分支是独立的，push 才能同步到远端，pull 才能从远端更新到本地。

```
本地新建 feat/my-task                → 只有本地有
git push -u origin feat/my-task      → GitHub 上也有了
                                         本地 feat/my-task 追踪 origin/feat/my-task
队友 push 了 origin/feat/my-task     → 你本地需要 git pull 才能同步
```

**第一次 push 新分支时要用 `-u` 参数，之后直接 `git push` 就可以了**

### 常用命令

```
# 查看所有本地分支（当前分支前有 * 标记）
git branch

feat/weekly-tanglx-report（）
# 查看所有分支（含远端）
git branch -a

* master
  remotes/origin/HEAD -> origin/master
  remotes/origin/master

# 切换到已有分支
git switch main

fix/login-error

# 新建分支（从当前位置）
git switch -c feat/weekly-tanglx-report

# 新建分支（从指定分支）
git switch -c feat/my-task origin/main

# 删除本地分支（安全版，只有已合并才能删）
git branch -d feat/weekly-tanglx-report

# 强制删除本地分支（谨慎使用）
git branch -D feat/weekly-tanglx-report
```

```
# git branch 输出
* feat/weekly-tanglx-report    ← 你现在在这里
  main
  fix/login-error

# git branch -a 输出
* feat/weekly-tanglx-report
  main
  remotes/origin/HEAD -> origin/main
  remotes/origin/main
  remotes/origin/feat/weekly-tanglx-report
```

### 命名规范

| 前缀        | 用途             |            例子             |
| ----------- | ---------------- | :-------------------------: |
| `feat/`     | 新功能           | `feat/weekly-tanglx-report` |
| `fix/`      | 修复 bug         |     `fix/login-timeout`     |
| `docs/`     | 文档修改         |    `docs/update-readme`     |
| `refactor/` | 重构代码         |   `refactor/user-service`   |
| `chore/`    | 配置、依赖等杂项 | `chore/update-dependencies` |

**分支名只用小写字母、数字、短横线和斜杠，不要用空格和中文**

### 新建分支

**每次开始新任务前，都应该从最新的 main 出发，新建功能分支**

```
# 第一步：切换到 main
git switch main

# 第二步：拉取最新代码（确保从最新状态出发）
git pull

# 第三步：新建功能分支
git switch -c feat/weekly-tanglx-report

# 确认当前在新分支上
git branch
```

**如果不先 `git pull`，你的功能分支可能基于旧的 main，后面合并时更容易有冲突。**

```
# 1. 确认当前在 main 分支
git switch main
git pull

# 2. 新建一个练习分支
git switch -c feat/practice-tanglx

# 3. 确认分支创建成功
git branch

# 4. 查看包含远端的所有分支
git branch -a

# 5. 切回 main
git switch main

# 6. 删除刚才的练习分支
git branch -d feat/practice-tanglx

# 7. 确认分支已删除
git branch
```

**分支本身几乎不占空间，只是一个指针文件。分支上的 commit 数据才占空间。**

## 拉取与同步

### git status

- **git status` 显示当前工作区和暂存区的状态，以及当前分支和远端追踪分支的关系。**

- **例子：每次操作前后都应该先看 `git status`，确认当前状态再行动。**

```
1.nothing to commit, working tree clean   工作区干净
2.modified:   docs/weekly/2026-W26-tanglx.md          有修改但未 add（modified）
3.有新文件
Untracked files:   docs/weekly/2026-W26-tanglx.md
  `添加到暂存区git add docs/weekly/2026-W26-tanglx.md` 让 Git 开始追踪它  
4.已 add，等待 commit（staged）
Changes to be committed:   new file:   docs/weekly/2026-W26-tanglx.md
文件已经在暂存区，下次 commit 会包含它。  
git commit -m "docs: 添加周报"` 提交。
5.本地比远端多 commit（ahead）
On branch feat/weekly-tanglx-w26
Your branch is ahead of 'origin/feat/weekly-tanglx-w26' by 2 commits.
 你本地有 2 个 commit 还没有 push 到 GitHub。  
`git push` 上传。 









```









### git log

- **`git log` 显示当前分支的提交历史，从最新到最旧排列，包含 commit hash、作者、时间、message。**

- **例子：`git log --oneline` 是最常用的简洁版，每行一条提交记录。**

```
commit 3a7b1d9f82e4c1b56a9d8e7f12345678abcdef90  ← commit hash（唯一ID）
Author: Firebat <firebat@example.com>             ← 作者（来自 git config）
Date:   Fri Jun 26 20:15:33 2026 +0800            ← 提交时间

    docs: 添加唐玲欣 2026-W26 周报               ← commit message

commit f2e8c1a3456789012bcdef34567890abcdef1234
Author: Firebat <firebat@example.com>
Date:   Fri Jun 26 18:30:00 2026 +0800

    feat: 初始化项目目录结构
```

| 字段           |                        说明                         |
| -------------- | :-------------------------------------------------: |
| commit hash    |   这次提交的唯一ID（40位十六进制），通常只用前7位   |
| Author         | 谁提交的（来自 git config user.name 和 user.email） |
| Date           |                   什么时候提交的                    |
| commit message |           这次提交做了什么（你写的说明）            |

```
# 简洁单行（最常用）
git log --oneline

# 简洁 + 图形化分支树（推荐收藏）
git log --oneline --graph --all

# 只看最近 5 条
git log --oneline -5

# 查看某个文件的历史
git log --oneline -- docs/weekly/2026-W26-tanglx.md

# 查看两个 commit 之间的变化
git log --oneline abc1234..def5678
```

```
# 状态1：干净状态
git switch main
git status

# 状态2：制造 modified
# （用编辑器改任意一个已有文件的内容，保存）
git status

# 状态3：制造 untracked
New-Item docs\test-untracked.txt
git status

# 状态4：制造 staged
git add docs\test-untracked.txt
git status

# 状态5：查看 ahead（需要先 commit）
git commit -m "test: 临时测试文件"
git status   # 应该看到 ahead

# 清理
git switch main
git branch -d 当前分支  # 如果不是 main 上操作的
git checkout -- .      # 丢弃 main 上的修改（见11节危险命令，这里用于清理）
Remove-Item docs\test-untracked.txt -ErrorAction SilentlyContinue
```

### git stash

- **`git stash` 把工作区和暂存区的未提交改动存入一个临时栈，工作区恢复干净状态，之后 `git stash pop` 可以取回。**
- **例子：你在 feat/A 分支上改到一半，老师突然说要在 feat/B 分支上修一个紧急问题，先 stash 再切分支。**

```
# 保存当前所有未提交改动（工作区 + 暂存区）
git stash

# 保存时附加说明
git stash push -m "feat/A 写到一半，临时切去修紧急 bug"

# 查看 stash 列表
git stash list
# 输出：
# stash@{0}: On feat/A: feat/A 写到一半，临时切去修紧急 bug
# stash@{1}: WIP on main: 3a7b1d9 docs: 上次的改动

# 恢复最近一次 stash（并从列表删除）
git stash pop

# 恢复但不删除（保留在列表里）
git stash apply stash@{0}

# 删除某个 stash
git stash drop stash@{0}

# 清空所有 stash
git stash clear
```

### git tag

通俗解释：tag 像给某个时刻盖一个永久印章，比如"v1.0 正式发布"，以后想回到这个版本直接找这个印章就行。

技术解释：tag 是指向某个特定 commit 的不可移动引用（与分支不同，分支随新 commit 移动，tag 固定不动），通常用于版本发布标记。

例子：`git tag v1.0.0` 在当前 commit 上打一个 v1.0.0 的标签。

###  .gitignore 

**`.gitignore` 要在第一次 commit 之前就加好，已经追踪的文件加进去没有效果**

```
# Python
__pycache__/
*.pyc
.venv/
.env

# Node.js
node_modules/
dist/
.env.local

# 编辑器
.vscode/
.idea/
*.swp

# 系统文件
.DS_Store
Thumbs.db

# 日志
*.log
logs/


# 检查某个文件是否被 ignore
git check-ignore -v .env

# 如果文件已经被追踪，需要先移除追踪再 ignore
git rm --cached .env
# 然后把 .env 加进 .gitignore
```

### git diff 

```
# 工作区 vs 暂存区（改了但还没 add 的内容）
git diff

# 暂存区 vs 最近一次 commit（已 add 但还没 commit 的内容）
git diff --staged

# 比较两个分支的差异
git diff main feat/weekly-tanglx-w26

# 比较某个文件的差异
git diff docs/weekly/2026-W26.md

# 比较两个 commit

git diff abc1234 def5678
diff --git a/docs/weekly/2026-W26.md b/docs/weekly/2026-W26.md
index 3a7b1d9..f2e8c1a 100644
--- a/docs/weekly/2026-W26.md    ← 旧版本
+++ b/docs/weekly/2026-W26.md    ← 新版本
@@ -1,3 +1,5 @@
 # 2026-W26 周报
+
+## 本周完成
+- 学习了 Git 基础操作    ← + 号是新增的行
-旧内容                          ← - 号是删除的行
```

### fork

通俗解释：fork 是"在 GitHub 上复制别人的仓库到自己的账号下"，相当于把公共图书馆的一本书复印一份，放进你自己的书柜，随便改都行，不影响图书馆原本。

技术解释：fork 是 GitHub 的操作，在你的账号下创建一个目标仓库的完整副本，你对这个副本有完全权限，可以通过 PR 向原仓库贡献代码。

例子：你想给一个开源项目贡献代码：fork → clone 你自己的 fork → 修改 → PR → 原仓库 maintainer 审查合并。

```
 GitHub 上 fork 原始仓库到你的账号
2. clone 你自己的 fork 到本地
3. 新建功能分支，修改代码
4. push 到你的 fork
5. 在 GitHub 上向原仓库发起 PR
6. 原仓库 maintainer review 后 merge
```



### git fetch

- **fetch 像邮件客户端的"检查新邮件"，只把远端的新内容下载到本地，但不打开邮件，也不把内容放进你的收件箱（工作区）。**

- **执行 `git fetch` 后，`origin/main` 更新了，但你本地的 `main` 分支还是原来的样子，工作区也没有任何变化。**

### Merge（合并）

**通俗解释：**merge 像把两条平行时间线的进度合并，把各自的改动都保留下来，合成一个新版本。

**技术解释**：merge 把**两个分支的历史合并成一个**，创建一个新的"合并提交"（如果有分叉的话），**保留双方的所有 commit。**

**例子**：`git pull` 内部就是 fetch + merge，把远端的新 commit 合并到你的本地分支上。

### 先拉后并

```
# 先下载远端内容，不合并
git fetch origin

# 查看远端比本地多了哪些 commit
git log main..origin/main --oneline

# 确认没问题后再合并
git merge origin/main
```

- **`git log main..origin/main` 显示远端有但本地没有的提交列表，如果输出为空，说明本地和远端一致。**
- **注意事项：平时日常工作直接用 `git pull` 就够了，fetch + merge 分开用适合有顾虑或有复杂情况时。**

### git pull

- **`git pull` = `git fetch` + `git merge`（默认情况下），把远端最新内容下载后，自动合并到你当前所在的本地分支。**

- **例子：执行 `git pull` 后，本地 main 分支更新到了远端最新状态，工作区文件也随之更新**

```
# 第一步：切换到 main
git switch main

# 第二步：拉取最新代码
git pull

# 输出示例（有新内容时）：
# Updating 3a7b1d9..f2e8c1a
# Fast-forward
#  docs/weekly/2026-W25.md | 45 +++++++++++
#  1 file changed, 45 insertions(+)

# 输出示例（没有新内容时）：
# Already up to date.

# 第三步：新建功能分支
git switch -c feat/weekly-tanglx-w26
```

- **每次开始工作前，先同步最新代码，再新建或切换到功能分支**。

- **`git pull` 之前最好确保工作区是干净的（git status 显示 nothing to commit），否则可能触发合并冲突。**

#### 未提交修改

```
情况1：把未提交改动暂存起来，pull 完再恢复

git stash          # 把当前未提交改动存起来
git pull           # 正常 pull
git stash pop      # 把改动取出来继续工作

情况2：先 commit 当前改动，再 pull

git add .//
git commit -m "wip: 临时保存进度"
git pull
```

**`git stash` 是暂时保存工作进度的好工具**

#### 输出说明

```
# 情况1：fast-forward（最常见，直接向前推进）
Updating 3a7b1d9..f2e8c1a
Fast-forward
 docs/weekly/2026-W26.md | 45 ++++++
 1 file changed, 45 insertions(+)

含义：远端只有你没有的新提交，直接把本地 main 指针向前移动，不产生合并提交。

# 情况2：Already up to date
Already up to date.

含义：你本地和远端一模一样，不需要做任何事。

# 情况3：合并冲突（需要手动解决）
Auto-merging docs/weekly/2026-W26.md
CONFLICT (content): Merge conflict in docs/weekly/2026-W26.md
Automatic merge failed; fix conflicts and then commit the result.

含义：你和队友修改了同一个文件的同一个位置，需要手动解决冲突。见 10_常见报错。
```


| 操作      | 下载远端内容 | 更新 origin/xxx | 改变本地分支 | 改变工作区 |
| --------- | ------------ | :-------------: | ------------ | ---------- |
| git fetch | ✅            |     ✅ 更新      | ❌            | ❌          |
| git pull  | ✅            |     ✅ 更新      | ✅ 合并进来   | ✅ 文件更新 |

### 实战

- ```
  # 1. 切换到 main 分支
  git switch main
  
  # 2. 先 fetch，看看远端有什么
  git fetch origin
  
  # 3. 比较本地 main 和 origin/main
  git log main..origin/main --oneline
  git log origin/main..main --oneline
  
  # 4. 执行 pull 同步
  git pull
  
  # 5. 查看最新状态
  git status
  git log --oneline -5
  ```


- **fetch 只更新 `origin/main` 这个远端追踪指针，你的本地 main 分支和工作区文件没有变化。**

- **pull 失败（比如冲突）时，Git 会停下来等你处理，不会自动丢弃任何数据**
