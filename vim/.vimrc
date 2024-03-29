packadd!dracula
syntax on
colorscheme dracula
"colo pablo

" Flash screen instead of beep sound
"set visualbell

" Change how vim represents characters on the screen
set encoding=utf-8

" Set the encoding of files written
set fileencoding=utf-8


autocmd Filetype python setlocal expandtab tabstop=4 shiftwidth=4 softtabstop=4
autocmd Filetype go setlocal tabstop=4 shiftwidth=4 softtabstop=4
autocmd Filetype html setlocal tabstop=2 shiftwidth=2 softtabstop=2
" ts - show existing tab with 4 spaces width
" sw - when indenting with '>', use 4 spaces width
" sts - control <tab> and <bs> keys to match tabstop

" Control all other files
set shiftwidth=4

set undofile " Maintain undo history between sessions
set undodir=~/.vim/undodir

" Hardcore mode, disable arrow keys.
"noremap <Up> <NOP>
"noremap <Down> <NOP>
"noremap <Left> <NOP>
"noremap <Right> <NOP>

"set filetype indent on
filetype plugin indent on
set smartindent

" Allow backspace to delete indentation and inserted text
" i.e. how it works in most programs
set backspace=indent,eol,start
" indent  allow backspacing over autoindent
" eol     allow backspacing over line breaks (join lines)
" start   allow backspacing over the start of insert; CTRL-W and CTRL-U
"        stop once at the start of insert.


" go-vim plugin specific commands
" Also run `goimports` on your current file on every save
" Might be be slow on large codebases, if so, just comment it out
let g:go_fmt_command = "goimports"

" Status line types/signatures.
let g:go_auto_type_info = 1

au filetype go inoremap <buffer> . .<C-x><C-o>

" If you want to disable gofmt on save
" let g:go_fmt_autosave = 0


" NERDTree plugin specific commands
:nnoremap <C-g> :NERDTreeToggle<CR>
"autocmd vimenter * NERDTree


" air-line plugin specific commands
let g:airline_powerline_fonts = 1
"let g:airline#extensions#tabline#enabled=1
"let g:airline_statusline_ontop=1
let g:airline_section_y=''
let g:airline#extensions#battery#enabled=1

if !exists('g:airline_symbols')
    let g:airline_symbols = {}
endif

" unicode symbols
let g:airline_left_sep = '»'
let g:airline_left_sep = '▶'
let g:airline_right_sep = '«'
let g:airline_right_sep = '◀'
let g:airline_symbols.linenr = '␊'
let g:airline_symbols.linenr = '␤'
let g:airline_symbols.linenr = '¶'
let g:airline_symbols.branch = '⎇'
let g:airline_symbols.paste = 'ρ'
let g:airline_symbols.paste = 'Þ'
let g:airline_symbols.paste = '∥'
let g:airline_symbols.whitespace = 'Ξ'

" airline symbols
"let g:airline_left_sep = ''
let g:airline_left_sep = ''
"let g:airline_left_alt_sep = ''
let g:airline_left_alt_sep = '|'
"let g:airline_right_sep = ''
let g:airline_right_sep = ''
let g:airline_right_alt_sep = ''
let g:airline_symbols.branch = ''
let g:airline_symbols.readonly = ''
"let g:airline_symbols.linenr = ''
let g:airline_symbols.linenr = ' '

"Folding
set foldmethod=syntax
set nofoldenable

"Backups
"set backup
"set backupdir=~/.vim/backup
"set writebackup
"set undodir=~/.vim/undo
"set directory=~/.vim/swap

"TagBar
nmap <F2> :TagbarToggle<CR>

"Mouse
set mouse=a

"window movement
nmap <C-up> <C-w>k
nmap <C-down> <C-w>j
nmap <C-right> <C-w>l
nmap <C-left> <C-w>h
nmap <C--> <C-w>_
nmap <C-=> <C-w>=
nmap <C-;> <C-w>|
"noremap <cr> <c-w>w
