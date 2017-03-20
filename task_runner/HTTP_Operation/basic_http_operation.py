import requests
import traceback

def send_get(url, headers):
    '''
    send http get request
    '''
    response = requests.get(url, headers=headers)
    response_json = None
    try:
        response_json = response.json()
    except:
        print traceback.print_exc()
        pass
    return response.status_code, response_json

def send_post(url, headers, data):
    '''
    send http post request
    '''
    response = requests.post(url, data=data, headers=headers)
    response_json = None
    try:
        response_json = response.json()
    except:
        print traceback.print_exc()
        pass
    return response.status_code, response_json

def send_put(url, headers, data):
    '''
    send http put request
    '''
    response = requests.put(url, data=data, headers=headers)
    response_json = None
    try:
        response_json = response.json()
    except:
        print traceback.print_exc()
        pass
    return response.status_code, response_json

def send_delete(url, headers, data):
    '''
    send http delete request
    '''
    response = requests.delete(url, headers=headers)
    response_json = None
    try:
        response_json = response.json()
    except:
        print traceback.print_exc()
        pass
    return response.status_code, response_json