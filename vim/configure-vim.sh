#!/user/bin/env bin

mkdir -p ~/.vim/pack/themes/start
mkdir -p ~/.vim/pack/dist/start

cp .vimrc ~/.vimrc

git clone https://github.com/dracula/vim -o ~/.vim/pack/themes/start/dracula
git clone https://github.com/fatih/vim-go -o ~/.vim/pack/dist/start/vim-go
git clone https://github.com/tpope/vim-fugitive -o ~/.vim/pack/dist/start/vim-fugitive
git clone https://github.com/vim-airlin/vim-airline -o ~/.vim/pack/dist/start/vim-airline
git clone https://github.com/preservim/tagbar -o ~/.vim/pack/dist/start/tagbar

