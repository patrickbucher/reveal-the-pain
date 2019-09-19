#!/bin/sh

read -r -d '' DAY_1 << EOM
Beer
Wine
Coffee
Meat
Cigarettes
Sugar
Stress
Headache
EOM

for tag in $DAY_1
do
    curl -i -X PUT localhost:8000/johndoe/logentry/2019-09-01/$tag
done

read -r -d '' DAY_2 << EOM
Beer
Wine
Coffee
Meat
Sugar
Stress
EOM

for tag in $DAY_2
do
    curl -i -X PUT localhost:8000/johndoe/logentry/2019-09-02/$tag
done

read -r -d '' DAY_3 << EOM
Coffee
Cigarettes
Sugar
Stress
Headache
EOM

for tag in $DAY_3
do
    curl -i -X PUT localhost:8000/johndoe/logentry/2019-09-03/$tag
done

read -r -d '' DAY_4 << EOM
Sport
TV
Coffee
Cigarettes
Sugar
Stress
Headache
EOM

for tag in $DAY_4
do
    curl -i -X PUT localhost:8000/johndoe/logentry/2019-09-04/$tag
done

read -r -d '' DAY_5 << EOM
Sport
TV
Coffee
Cigarettes
Sugar
Stress
EOM

for tag in $DAY_5
do
    curl -i -X PUT localhost:8000/johndoe/logentry/2019-09-05/$tag
done

curl -i -X GET localhost:8000/johndoe/correlation/Headache
