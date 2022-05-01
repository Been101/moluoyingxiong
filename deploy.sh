#!/usr/bin/env sh

# 确保脚本抛出遇到的错误

set -e

# 生成静态文件

npm run build

# 进入生成的文件夹 
git checkout --patch gh-pages pages

git push -f git@github.com:Been101/moluoyingxiong.git gh-pages

cd -