#!/bin/bash

npm install --production && \
    ls -l . && \
    echo -n 'pwd: ' && pwd &&
    echo -n 'lib: ' && ls -l ../../../lib/
