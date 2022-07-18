#!/bin/bash

while true; do
  # choose a random health between 89 and 99
  choice=$((RANDOM%10+89))
  curl -L -X POST "http://localhost:3000/api/applications/cb1995e4-c8a8-4661-9bc7-443ef2a1e006/ingest?health=0.$choice" -H 'Authorization: Bearer password'
  # sleep a random amount between 15 and 45 seconds
  sleep $((RANDOM%30+15))
done
