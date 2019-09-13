#!/bin/sh

username='paedu'
date='2019-09-01'

curl -X PUT localhost:8000/${username}/logentry/${date}/TooLittleSleep
curl -X PUT localhost:8000/${username}/logentry/${date}/SmokedCigarettes
curl -X PUT localhost:8000/${username}/logentry/${date}/DrankBeerYesterday
