#! /bin/bash

dir='../src/'

for a in $(find $dir -name '*.js' ! -name "*.min.js");
do
	name=$(basename "$a")
	uglifyjs2 --comments -v -o $dir${name%.js}.min.js "$a"
done