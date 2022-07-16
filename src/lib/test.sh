#!/bin/bash

for i in {1..20}; do
  echo $i
  curl -L -X POST 'http://localhost:3000/api/applications/cb1995e4-c8a8-4661-9bc7-443ef2a1e006/ingest' -H 'Authorization: Bearer password'
  # sleep a random amount between 15 and 30 seconds
  sleep $((RANDOM%15+15))
done
