import time
import json


# maps old values to new values
def remap(old_max, old_min, new_max, new_min, value_to_remap):
    old_range = old_max - old_min
    new_range = new_max - new_min
    new_value = (float((value_to_remap - old_min) * new_range) / old_range) + new_min # returns float
    return new_value


# read and return json from a file
def read_json(filename='data.json'):
    with open('data.json') as file:
        data = json.load(file)
    
    return data


# write json to a file
def write_json(data, filename='data.json'):
    with open(filename, 'w') as file: 
        json.dump(data, file, indent=4)


# append to an existing json file
def append_json(dict, filename='data.json'):
    with open(filename) as file:
        data = json.load(file)

    data.update(dict)
    write_json(data)


# update existing json property of pid with a new value
def update_json(property, value, pid='1', filename='data.json'):
    # cast to a string in case your given anything else
    pid = str(pid)
    property = str(property)

    # read json and update property with value
    plant_data = read_json(filename)
    plant_data[pid][property] = value

    # write updated plant_data to json file
    write_json(plant_data, filename)


# gets current time as a tuple and returns a timestamp and humand-readable time
def get_current_time():
    current_time = time.localtime()
    formatted_time = time.strftime('%Y-%m-%d %H:%M:%S', current_time)
    return formatted_time