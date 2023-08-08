#!/bin/bash -ex
STAGE=$1
set +e
(npx ampt deploy $STAGE || true) |
grep -Eo "(https)://[a-zA-Z0-9./?=_%:-]*" > url.txt
echo $(cat url.txt)
