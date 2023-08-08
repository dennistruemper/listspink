#!/bin/bash
set +e
(npx ampt deploy ci || true) |
grep -Eo "(https)://[a-zA-Z0-9./?=_%:-]*" > url.txt
echo $(cat url.txt)
