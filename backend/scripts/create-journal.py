#!/usr/bin/env python3

import json
import requests
import sys

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

base_endpoint = 'http://localhost:8000/'
username = 'johndoe'
password = 'topsecret1337'

token_endpoint = base_endpoint + 'token'
payload = json.dumps({'username': username, 'password': password})
headers = {'Content-Type': 'application/json'}
res = requests.post(token_endpoint, data=payload, headers=headers)
if res.status_code != 200:
    print('auth failed')
    sys.exit()
access_token = res.json()['access_token']
auth_header = {'Authorization': 'Bearer ' + access_token}

logentry_endpoint = base_endpoint + '{:s}/logentry/{:s}/{:s}'
for date in journal:
    tags = journal[date]
    for tag in tags:
        url = logentry_endpoint.format(username, date, tag)
        requests.put(url, headers=auth_header)

correlation_endpoint = base_endpoint + '{:s}/correlation/{:s}'
url = correlation_endpoint.format(username, 'Headache')
res = requests.get(url, headers=auth_header)
print(res.json())
