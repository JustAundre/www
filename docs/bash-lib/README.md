# Bash Library

Custom functions made to make complex scripts cleaner,
helping move just that much more focus from keeping scripts clean and maintainable,
to scripting the concept.

## Installation

```bash
# Change CWD to your target project root directory.
cd ~/Projects/project-root/

# Add this repository as a submodule.
git submodule add https://github.com/justaundre/bash-lib.git lib

# Pull down the newly added submodule.
git submodule update --init --recursive
```

Bash Library is now installed in the `lib/` sub-directory.
(*Relative to your project root*)

## Usage

To make these commands available to your scripts,

Given the below:

```txt
project-root/
	-> lib/
	-> scripts/
		-> test.sh
		-> another-script.sh
```

Prepend the below @ the top of your script(s) to source all the functions:

```bash
[[ -d "../lib/" ]] || exit 1
for function in ../lib/*; do
	. "${function}"
done
```

## Why Functions?

When executing a script/command (including inside a script),
a PID needs to be allocated, & a process needs to be spun up.
*Generally*, this doesn't impact performance noticibly
when a human is typing commands manually,
**but**, it'll matter once you start to put stuff in quick loops.
