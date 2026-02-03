" Vim syntax file
" Language: Geneia
" Maintainer: Moude AI Inc.
" Latest Revision: 2025

if exists("b:current_syntax")
  finish
endif

" Comments
syn region geneiaComment start="!" end="!" contains=geneiaTodo
syn keyword geneiaTodo contained TODO FIXME XXX NOTE

" Tips (double quoted strings)
syn region geneiaTip start='"' end='"'

" Strings (single quoted)
syn region geneiaString start="'" end="'"

" Variables (braces)
syn region geneiaVariable start="{" end="}"

" Module functions
syn match geneiaModuleFunc "\.\(String\|Time\|Math\|Sys\|Array\|Render\|GWS\|W2G\|GNEL\|Web\|UI\|GSL\)\.[a-zA-Z]\+"

" Module imports
syn keyword geneiaModule G_Render G_Web OpenGSL OpenGWS OpenW2G OpenGNEL GeneiaUI

" Flags
syn match geneiaFlagLong "--[a-zA-Z]\+"
syn match geneiaFlagShort "\s-[a-zA-Z]\>"

" Control keywords
syn keyword geneiaControl peat repeat turn exit check when loop func give back stop skip each

" Import keywords
syn keyword geneiaImport import use from export

" Storage types
syn keyword geneiaStorage str hold var msg

" Builtin functions
syn keyword geneiaBuiltin gmath time sys

" Math functions
syn keyword geneiaMath add sub mul div mod rand len wait sqrt abs sin cos tan floor ceil round pi e

" String functions
syn keyword geneiaStringFunc upper lower trim rev math join split size push pop

" Time functions
syn keyword geneiaTimeFunc now unix year month day hour

" System functions
syn keyword geneiaSysFunc os arch sleep

" Collection functions
syn keyword geneiaCollFunc list set del has make call done take send get

" Time units
syn match geneiaTimeUnit "\<t\.[a-z]\+\>"

" Numbers
syn match geneiaNumber "\<\d\+\(\.\d\+\)\?\>"
syn match geneiaNumber "(\s*-\?\d\+\(\.\d\+\)\?\s*)"

" Operators
syn match geneiaOperator "&&\|\|\|=\|+\|-\|\*\|/\|%\|\^\|&"

" Highlighting
hi def link geneiaComment Comment
hi def link geneiaTodo Todo
hi def link geneiaTip String
hi def link geneiaString String
hi def link geneiaVariable Identifier
hi def link geneiaModuleFunc Function
hi def link geneiaModule Type
hi def link geneiaFlagLong Constant
hi def link geneiaFlagShort Constant
hi def link geneiaControl Keyword
hi def link geneiaImport Include
hi def link geneiaStorage StorageClass
hi def link geneiaBuiltin Function
hi def link geneiaMath Function
hi def link geneiaStringFunc Function
hi def link geneiaTimeFunc Function
hi def link geneiaSysFunc Function
hi def link geneiaCollFunc Function
hi def link geneiaTimeUnit Type
hi def link geneiaNumber Number
hi def link geneiaOperator Operator

let b:current_syntax = "geneia"
