#!/bin/sh
cd ..
svn log --limit 1 --quiet --incremental | tail -1 | awk '{print $5}'
