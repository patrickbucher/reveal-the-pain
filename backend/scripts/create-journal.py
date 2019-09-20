#!/usr/bin/env python3

# TODO: extend for JWT

import requests

username = 'johndoe'
journal = {
    '2019-09-01': [
        'EnoughSleep',
        'Walk',
        'Beer',
        'Cigarettes',
        'Coffee',
        'Breakfast'
    ],
    '2019-09-02': [
        'TooLittleSleep',
        'Work',
        'Stress',
        'Coffee',
        'Cigarettes',
        'Pasta',
        'Apple',
        'Headache'
    ],
    '2019-09-03': [
        'Breakfast',
        'Stress',
        'Work',
        'Programming',
        'Apple',
        'Cigarettes',
        'Noise',
        'Headache'
    ],
    '2019-09-04': [
        'TooLittleSleep',
        'Work',
        'Walk',
        'Coffee',
        'Tiredness'
    ],
    '2019-09-05': [
        'EnoughSleep',
        'Walk',
        'Beer',
        'Noise',
        'Stress'
    ],
    '2019-09-06': [
        'EnoughSleep',
        'Walk',
        'Wine',
        'Studying',
        'Pasta',
        'Cigarettes',
        'Noise',
        'Headache'
    ],
    '2019-09-07': [
        'EnoughSleep',
        'Walk',
        'Wine',
        'Meat',
        'Noise',
        'Tiredness'
    ]
}

logentry_endpoint = 'http://localhost:8000/{:s}/logentry/{:s}/{:s}'

for date in journal:
    tags = journal[date]
    for tag in tags:
        url = logentry_endpoint.format(username, date, tag)
        requests.put(url)

correlation_endpoint = 'http://localhost:8000/{:s}/correlation/{:s}'
url = correlation_endpoint.format(username, 'Headache')
res = requests.get(url)
print(res.json())
