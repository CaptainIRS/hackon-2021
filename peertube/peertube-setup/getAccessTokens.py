import requests
from urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(category=InsecureRequestWarning)

enableSSL = False
USERNAME = 'root'
PASSWORD = 'wumowekujamiqeru'
res = requests.get(
    'https://peertube.local/api/v1/oauth-clients/local', verify=enableSSL)

data = {
    "client_id": res.json()['client_id'],
    "client_secret": res.json()['client_secret'],
    "grant_type": "password",
    "response_type": "code",
    "username": USERNAME,
    "password": PASSWORD
}

res = requests.post(
    'https://peertube.local/api/v1/users/token', data=data, verify=enableSSL)
print(res.json())
