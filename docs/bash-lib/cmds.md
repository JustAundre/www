# Bash Library Manuals

## Functions

### checklist

### clear

### compdom

<small>A.K.A. "Compare domain"</small>

### confirm

### log

### pause

### perm_fix

<small>A.K.A. "Permission fix"</small>

### reconfig

<small>A.K.A. "Reconfigure"</small>

A command to quickly reconfigure configuration files that follow a simple `key=value` pair format.

Command opts:

- `-d`: Defaults to the space character if undefined; defines the delimiter for separating the key and the value and may take a multi-character string.
- `-x`: Defines the method of handling duplicate keys in the same file, requires a string argument of one of the below:
	- "replace": will delete all of the previous entries of the duplicate key and append to the bottom.
	- "append": ignore the duplicates and continue to add the entry.
	- "abort": exit if a duplicate is detected.
- `-p`: In the event a non-existent filepath is provided, this opt will create said file and all of its preceding non-existent parents if need be.

### find

Adds a practical opt to the `find` command for e**x**cluding some paths generally not needed in the scanning of the filesystem (**ephem**eral paths), the `-xephem` opt. See the full list of paths excluded below:

- `/tmp`
- `/run`
- `/proc`
- `/sys`
- `/var/run`
- `/var/lock`
- `/var/tmp`