#!/usr/bin/env bash

mkdir -p ~/.vim/pack/themes/start
mkdir -p ~/.vim/pack/dist/start

cp .vimrc ~/.vimrc

git clone https://github.com/dracula/vim  ~/.vim/pack/themes/start/dracula
git clone https://github.com/fatih/vim-go  ~/.vim/pack/dist/start/vim-go
git clone https://github.com/tpope/vim-fugitive  ~/.vim/pack/dist/start/vim-fugitive
git clone https://github.com/vim-airline/vim-airline  ~/.vim/pack/dist/start/vim-airline
git clone https://github.com/preservim/tagbar  ~/.vim/pack/dist/start/tagbar

