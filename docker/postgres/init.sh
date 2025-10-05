#!/bin/sh
set -e

# Configure pg_hba.conf to allow md5 authentication
echo "host all all all md5" >> /var/lib/postgresql/data/pg_hba.conf
