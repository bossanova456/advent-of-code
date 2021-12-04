#!/bin/bash

set -x

# Check params for day number
if [[ $# -lt 1 ]]; then
    echo "Need day number param"
    exit 1
fi

cp -r template day-${1}a
cd day-${1}a
sed -i "s/\${day}/${1}/g" index.js
npm install

cd ..
cp -r template day-${1}b
cd day-${1}b
sed -i "s/\${day}/${1}/g" index.js
npm install