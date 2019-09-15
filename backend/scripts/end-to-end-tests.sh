#!/bin/sh

username='paedu'
date='2019-09-01'

# 201: Created
curl -i -X PUT localhost:8000/${username}/logentry/${date}/TooLittleSleep
curl -i -X PUT localhost:8000/${username}/logentry/${date}/SmokedCigarettes
curl -i -X PUT localhost:8000/${username}/logentry/${date}/DrankBeerYesterday

# 400: Bad Request
curl -i -X PUT localhost:8000/wrong-user/logentry/${date}/EatenTooMuch
curl -i -X PUT localhost:8000/${username}/logentry/01.01.2000/WrongDateUsed
curl -i -X PUT localhost:8000/${username}/logentry/${date}/illegal-tag-format

# 200: OK (Deleted)
curl -i -X DELETE  localhost:8000/${username}/logentry/${date}/TooLittleSleep
curl -i -X DELETE localhost:8000/${username}/logentry/${date}/SmokedCigarettes
curl -i -X DELETE localhost:8000/${username}/logentry/${date}/DrankBeerYesterday
