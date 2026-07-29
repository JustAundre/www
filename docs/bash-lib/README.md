# Bash Lib

Custom functions made to make complex scripts cleaner, helping move just that much more focus from keeping scripts clean and maintainable, to scripting the concept.

## Installation

1. `cd` in your project's root directory.

2. Run `git submodule add https://github.com/justaundre/bash-lib.git lib` to add this repository as a dependency.

3. Run `git submodule update --init --recursive` to pull it down

Congrats, it's installed @ the `/lib` directory of your project now.

## Usage

To make these commands available to your scripts, it's important to note that these commands are in reality, functions (see [below](#Why-Functions) for why I made this decision).

Use the below to source all the functions.

```bash
[[ -d "$(pwd)/../lib/" ]] || exit 69
for function in "$(pwd)/../lib/"*".sh"; do
	source "${function}"
done
```

## Why Functions?

When executing a script, even a script inside a script (*which is effectively what this is*), a PID needs to be allocated and a process needs to be spun up. *Generally*, this doesn't impact performance noticibly when a human is typing commands manually, **but** it'll matter once you start to put stuff in quick loops.