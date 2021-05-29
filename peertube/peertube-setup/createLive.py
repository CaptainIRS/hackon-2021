import requests
from urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(category=InsecureRequestWarning)

enableSSL = False

data = {
    'channelId': 1,
    'name': 'from python',
    'access_token': 'c5a6eb3000e93d792c66bfb4c3400380097ebf1b',
    'token_type': 'Bearer',
    'refresh_token': 'a11b207974dca8c4dd615d0827567e958984cfb6'
}
res = requests.post(
    'https://peertube.local/api/v1/videos/live', verify=enableSSL)
print(res.status_code)
