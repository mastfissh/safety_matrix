#!/bin/bash

# Specify the directory where the files are located
directory="./content/combos"

# Change to the specified directory
cd "$directory"

# Rename files
for file in *cathinone*; do
    if [[ -f $file ]]; then
        new_name=$(echo "$file" | sed 's/cathinone/cathinones/g')
        mv "$file" "$new_name"
        echo "Renamed $file to $new_name"
    fi
done
