#!/bin/bash
set +e
(npx ampt url || true) |
grep -Eo "(https)://[a-zA-Z0-9./?=_%:-]*" > urlSandbox.txt
echo $(cat urlSandbox.txt)
