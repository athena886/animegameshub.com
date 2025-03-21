#!/usr/bin/env python3
"""
将抓取结果推送到GitHub的脚本
"""

import os
import subprocess
import argparse
import sys

def run_command(command):
    """运行命令并打印输出"""
    print(f"执行: {command}")
    process = subprocess.Popen(
        command,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True
    )
    
    stdout, stderr = process.communicate()
    
    if stdout:
        print(stdout)
    if stderr:
        print(stderr)
    
    return process.returncode == 0

def init_git(repo_url, branch="main"):
    """初始化git仓库并推送到GitHub"""
    commands = [
        "git init",
        "git add .",
        f'git commit -m "Initial commit: Anime Games Scraper {os.path.basename(os.getcwd())}"',
        f"git branch -M {branch}",
        f"git remote add origin {repo_url}",
        f"git push -u origin {branch}"
    ]
    
    for command in commands:
        if not run_command(command):
            print(f"命令失败: {command}")
            return False
    
    return True

def update_git(commit_message=None):
    """更新现有的git仓库"""
    if not commit_message:
        commit_message = f"更新游戏数据 {os.path.basename(os.getcwd())}"
    
    commands = [
        "git add .",
        f'git commit -m "{commit_message}"',
        "git push"
    ]
    
    for command in commands:
        if not run_command(command):
            print(f"命令失败: {command}")
            return False
    
    return True

def main():
    parser = argparse.ArgumentParser(description="推送抓取结果到GitHub")
    
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--init", dest="init", action="store_true", help="初始化新仓库")
    group.add_argument("--update", dest="update", action="store_true", help="更新现有仓库")
    
    parser.add_argument("--repo", help="GitHub仓库URL (用于初始化)")
    parser.add_argument("--branch", default="main", help="Git分支名称")
    parser.add_argument("--message", help="提交消息")
    
    args = parser.parse_args()
    
    if args.init:
        if not args.repo:
            print("错误: 初始化仓库需要提供--repo参数")
            sys.exit(1)
        
        if init_git(args.repo, args.branch):
            print("成功初始化并推送到GitHub！")
        else:
            print("推送到GitHub失败")
            sys.exit(1)
    
    elif args.update:
        if update_git(args.message):
            print("成功更新GitHub仓库！")
        else:
            print("更新GitHub仓库失败")
            sys.exit(1)

if __name__ == "__main__":
    main()
