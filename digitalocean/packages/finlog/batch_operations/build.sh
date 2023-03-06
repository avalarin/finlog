#!/bin/bash

npm install --production && \
    cp -r ../../../lib/core ./
    ls -l . && \
    echo -n 'pwd: ' && pwd &&
    echo -n 'lib: ' && ls -l ../../../lib/
