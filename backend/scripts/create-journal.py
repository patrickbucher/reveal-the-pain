#!/usr/bin/env python3

import json
import requests
import sys

journal = {
    '2019-09-01': [
        'Coffee',
        'Breakfast',
        'Walk',
        'Work',
        'Noise',
        'Heat',
        'Salad',
        'Dinner',
        'TV',
        'Beer',
        'Cigarettes',
        'Insomnia',
    ],
    '2019-09-02': [
        'Coffee',
        'Breakfast',
        'Walk',
        'Work',
        'Noise',
        'Stress',
        'Candy',
        'Dinner',
        'Beer',
        'Cigarettes'
    ],
    '2019-09-03': [
        'Coffee',
        'Stress',
        'Walk',
        'Work',
        'Noise',
        'Stress',
        'Dinner',
        'Beer',
        'Cigarettes',
        'TV',
        'Insomnia'
    ],
    '2019-09-04': [
        'Holiday',
        'Relaxed',
        'Breakfast',
        'Housework',
        'Walk',
        'Lunch',
        'Dinner',
        'TV',
        'Insomnia'
    ],
    '2019-09-05': [
        'Relaxed',
        'Coffee',
        'Breakfast',
        'Walk',
        'Work',
        'Noise',
        'Beer',
        'Cigarettes'
    ],
    '2019-09-06': [
        'Relaxed',
        'Coffee',
        'Breakfast',
        'Walk',
        'Invitation',
        'Beer',
        'Wine',
        'Whiskey',
        'Cigarettes'
    ],
    '2019-09-07': [
        'Relaxed',
        'Coffee',
        'Breakfast',
        'Wine',
        'TV',
        'Insomnia'
    ]
}

base_endpoint = 'http://localhost:8000/'
username = 'toni'
password = 'Geheim1!'

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

tags_endpoint = base_endpoint + '{:s}/tags'
url = tags_endpoint.format(username)
res = requests.get(url, headers=auth_header)
print(res.json())

dates_endpoint = base_endpoint + '{:s}/dates'
url = dates_endpoint.format(username)
res = requests.get(url, headers=auth_header)
print(res.json())

correlation_endpoint = base_endpoint + '{:s}/correlation/{:s}'
url = correlation_endpoint.format(username, 'Insomnia')
res = requests.get(url, headers=auth_header)
print(res.json())
