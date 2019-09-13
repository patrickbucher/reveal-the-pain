#!/bin/sh

username='paedu'
date='2019-09-01'

# 201: Created
curl -X PUT localhost:8000/${username}/logentry/${date}/TooLittleSleep
curl -X PUT localhost:8000/${username}/logentry/${date}/SmokedCigarettes
curl -X PUT localhost:8000/${username}/logentry/${date}/DrankBeerYesterday

# 400: Bad Request
curl -X PUT localhost:8000/wrong-user/logentry/${date}/EatenTooMuch
curl -X PUT localhost:8000/${username}/logentry/01.01.2000/WrongDateUsed
curl -X PUT localhost:8000/${username}/logentry/${date}/illegal-tag-format
