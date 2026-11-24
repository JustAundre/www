#!/bin/bash
mkindex() {
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
			space+=$'  '
		done
		echo "${space}- ${basename}"
		mkindex "${path}" "$((indent + 1))"
	done < <(find "${dir}" -mindepth 1 -maxdepth 1 -type d -not -name '.*' -print0)
}
#
# Start generation
source='docs/projects'
output_dir='docs/indexes'
mkdir -p "${output_dir}"
while IFS='' read -rd '' project; do
	[[ -d ${project} ]] || continue
	output_file="${output_dir}/${project##*/}.md"
	{
		printf '# Wikipedia Index\n\n'
		mkindex "${project}" 0
	} >"${output_file}"
done < <(find "${source}" -mindepth 1 -maxdepth 1 -type d -print0)
