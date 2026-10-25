#!/bin/bash



mktoc() {
	# mktoc - (M)a(k)e (T)able (o)f (C)ontents
	local dir="${1:-.}" indent="${2:-0}" space='' path='' basename='' i=0
	#
	# Process markdown files in the current directory
	while read -rd '' path; do
		basename="${path##*/}"
		basename="${basename%.md}"
		space=''
		for ((i=0; i<indent; i++)); do
			space+=$'\t'
		done
		path="${path#./}"
		path="${path#*_}"
		echo "${space}- [${basename}](/docs?q=${path})"
	done < <(find "${dir}" -mindepth 1 -maxdepth 1 -type f -name '*.md' -print0)
	#
	# Process subdirectories
	while read -rd '' path; do
		basename="${path##*/}"
		space=''
		for ((i=0; i<indent; i++)); do
			space+=$'\t'
		done
		echo "${space}- ${basename}"
		mktoc "${path}" "$((indent + 1))"
	done < <(find "${dir}" -mindepth 1 -maxdepth 1 -type d -not -name '.*' -print0)
}
#
# Start generation
cd 'docs' || exit 1
mkdir -p toc
for wiki in 'projects/'*; do
	[[ -d ${wiki} ]] || continue
	output_file="toc/${wiki##*/}.md"
	{
		printf '# Table of Contents\n\n'
		mktoc "${wiki}" 0
	} >"${output_file}"
done
