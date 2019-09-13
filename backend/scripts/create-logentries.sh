#!/bin/sh

username='paedu'
date='2019-09-01'
tag='TooLittleSleep'

curl -X PUT localhost:8000/${username}/logentry/${date}/${tag}
