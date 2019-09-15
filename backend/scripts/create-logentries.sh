#!/bin/sh

read -r -d '' DAY_1 << EOM
DrankBeer
SleptTooLittle
Stress
BadWeather
LunchAtMcDonalds
Headache
Backache
EOM

for tag in $DAY_1
do
    curl -i -X PUT localhost:8000/johndoe/logentry/2019-09-01/$tag
done

read -r -d '' DAY_2 << EOM
LongWalk
DrankWater
MagnesiumPill
NiceWeather
Backache
StressAtWork
EOM

for tag in $DAY_2
do
    curl -i -X PUT localhost:8000/johndoe/logentry/2019-09-02/$tag
done

curl -i -X GET localhost:8000/johndoe/tags
curl -i -X GET localhost:8000/johndoe/2019-09-01/tags
curl -i -X GET localhost:8000/johndoe/2019-09-02/tags
curl -i -X GET localhost:8000/johndoe/2019-09-03/tags

curl -i -X GET localhost:8000/johndoe/correlation/Backache
