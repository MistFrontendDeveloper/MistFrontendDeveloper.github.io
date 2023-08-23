---
title: 省去 Mac 中频繁输入 sudo 的行为
date: 2023-06-01 21:30:42
---

在使用 Mac 时，可能会遇到需要执行管理员权限操作的情况。这时，频繁地输入 sudo 密码可能变得繁琐且不便。别担心！本文将为您揭示一些简单的方法，让您告别频繁输入 sudo 的困扰。

注：请注意，在修改系统设置或执行敏感操作时，请始终保持谨慎，并确保只对您信任的文件和命令进行相应的配置。

## 使用 visudo

visudo 是一个用于编辑 sudoers 文件的命令。通过编辑该文件，您可以配置允许特定用户执行特定命令时无需输入密码。

```bash
$ sudo visudo
```

在打开的 sudoers 文件中，您可以找到 `%admin ALL=(ALL) ALL` 这样的行，将其替换为：

```bash
%admin ALL=(ALL) NOPASSWD: ALL
```

这样一来，管理员组成员就无需输入密码即可执行任何命令。

## 使用 Keychain

macOS Keychain 是一个密码管理工具，通过将 sudo 密码添加到 Keychain 中，可以省去每次输入密码的麻烦。

```bash
$ sudo visudo
```

在打开的 sudoers 文件中，找到 `%admin ALL=(ALL) ALL` 这样的行，在其下方添加以下内容：

```bash
Defaults        env_keep += "SUDO_ASKPASS"
Defaults:USER   env_keep += "SUDO_ASKPASS"
```

然后，执行以下命令将 sudo 密码添加到 Keychain：

```bash
$ sudo sh -c 'echo "MyPassword" | sudo -S -v'
```

请将 "MyPassword" 替换为您自己的 sudo 密码。
