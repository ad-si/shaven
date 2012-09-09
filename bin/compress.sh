#! /bin/bash

dir=../src/

for a in $(find $dir ! -name "*.min.js");
do
	name=$(basename "$a")
	uglifyjs -o $dir${name%.js}.min.js "$a";
done


