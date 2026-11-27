#!/usr/bin/env bash
cd static/html/cards || exit 1
rm -rf projects
mkdir -p projects
declare -r template="$(<templates/projects.html)"
declare -A metadata
while IFS=$'\n' read -r -d '~' 'metadata[title]' 'metadata[degree]' 'metadata[owner]' 'metadata[repo]'; do
	# Fetch external metadata
	response="$(curl -L -H 'Accept: application/vnd.github+json' "https://api.github.com/repos/${metadata[owner]}/${metadata[repo]}")"
	#
	# Parse JSON for desired metadata
	merged_description="$(jq -r '.description' <<<"${response}")"
	[[ ${merged_description} =~ ^(.*?)' // ' ]]
	metadata['description']="${BASH_REMATCH[1]}"
	[[ ${merged_description} =~ ' // '(.*?)$ ]]
	metadata['subtext']="${BASH_REMATCH[1]}"
	metadata['source_url']="$(jq -r '.url' <<<"${response}")"
	metadata['stargazers_count']="$(jq -r '.stargazers_count' <<<"${response}")"
	metadata['license_name']="$(jq -r '.license.name' <<<"${response}")"
	metadata['license_url']="$(jq -r '.license.url' <<<"${response}")"
	#
	# Construct Wiki URL
	metadata['wiki_url']="/docs?q=projects/${metadata['repo']}/Home.md"
	#
	# Fill out template
	tmp="${template}"
	tmp="${tmp/'DEGREE'/"${metadata['degree']}"}"
	tmp="${tmp/'TITLE'/"${metadata['title']}"}"
	tmp="${tmp/'SOURCE_URL'/"${metadata['source_url']}"}"
	tmp="${tmp/'WIKI_URL'/"${metadata['wiki_url']}"}"
	tmp="${tmp/'LICENSE_URL'/"${metadata['license_url']}"}"
	tmp="${tmp/'LICENSE_NAME'/"${metadata['license_name']}"}"
	tmp="${tmp/'DESCRIPTION'/"${metadata['description']}"}"
	tmp="${tmp/'SUBTEXT'/"${metadata['subtext']}"}"
	#
	# Export to file
	echo "${tmp}" >"projects/${metadata['repo']}.html"
done <metadata/projects.txt
