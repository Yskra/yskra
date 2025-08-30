#!/bin/sh
set -e

spawn-fcgi -p 9000 -- /usr/bin/fcgiwrap

exec nginx -g "daemon off;"
