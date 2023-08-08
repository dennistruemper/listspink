#!/bin/bash
set +e
(npx ampt deploy ci || true) | tee urlRaw.txt
cat urlRaw.txt | grep -Eo "(https)://[a-zA-Z0-9./?=_%:-]*" > url.txt
echo $(cat url.txt)
