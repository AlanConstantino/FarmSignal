from hardware.soil_moisture_sensor import SoilMoistureSensor
from hardware.lcd import lcd as LCD
from hardware.relay import Relay
from hardware.dht22 import DHT22
from socket import error as socket_eror
from time import sleep
from util.util import read_json
from util.util import update_json
from util.util import remap
from util.util import get_current_time
from util.util import write_json
import board
import requests
import os
import sys

# constants
# BASE_URL = 'http://your_ip_here:8080'          # url for testing
BASE_URL = 'https://farmsignal.net:8080'
SECONDS_TO_CHECK = 600                           # every 600 seconds (10 minutes), the Pi will collect data and send it to the server
PERCENT_TO_WATER_PLANT = 20                      # at 20% moisture it will water plant
PERCENT_TO_STOP_WATERING_PLANT = 70              # at 70% it will stop watering plant
SECONDS_TO_CHECK_SOIL_MOISTURE_CHANGE = 30       # amount of time to check if soil moisture has changed or not
CHECKS_EMPTY_WATER_SOURCE = 3                    # number of checks you have to do before deciding that the water source is probably empty and needs to be refilled

#### HARDWARE ####

# ADS1115 (analog-to-digital converter)
ADS1115 = 0x01
channel = 1
sps = 250    # samples per second
pga = 6144   # programmable gain amplifier (mV)

# soil moisture sensor
soil_sensor = SoilMoistureSensor(ic=ADS1115)

# LCD screen
lcd = LCD()

# relay
relay_pin = 12
active_high = False
relay = Relay(relay_pin, active_high)

# DHT22 (temperature/humidity sensor)
dht22 = DHT22(board.D13, use_pulseio=False)


# returns the user's username and password as a tuple
def get_credentials():
  username = str(input('Enter your username: '))
  password = str(input('Enter your password: '))
  return (username, password)


# returns the user's uid and token as a tuple
def login(username, password):
  try:
    url = '{}/api/login'.format(BASE_URL)
    payload = {'username': username, 'password': password}
    res = requests.post(url, data=payload)
    if res.status_code != 200:
      quit('There was a server error or username/password is wrong.')
  except socket_eror:
    quit('Could not connect to the server, try again later.')
  return (res.json()['UserID'], res.json()['token'])


# returns an array of all plants
def get_all_plants(uid, token):
  try:
    url = '{}/api/users/{}/plants'.format(BASE_URL, uid)
    headers = {'Authorization': 'Bearer {}'.format(token)}
    res = requests.get(url, headers=headers)
    if (res.status_code == 403):
      return False
    if (res.status_code != 200):
      quit('Could not get plants.')
  except socket_eror:
    quit('Could not connect to the server, try again later.')
  return res.json()


# returns the number of the selected plant the user chose
def select_plant(total_plants):
  successful_selection = False
  while (not successful_selection):
    try:
      selected_plant = int(input())
      if (0 < selected_plant <= total_plants):
        successful_selection = True
      else:
        print('Not a valid plant. Try again')
    except ValueError:
      print('Please only enter a number...')
  return selected_plant


# returns an array containing and object of a specific plant data
def get_specific_plant_data(uid, pid, token):
  try:
    url = '{}/api/users/{}/plants/{}'.format(BASE_URL, uid, pid)
    headers = {'Authorization': 'Bearer {}'.format(token)}
    res = requests.get(url, headers=headers)
    if (res.status_code == 403):
      return False
    if (res.status_code != 200):
      quit('Could not get plants.')
  except socket_eror:
    quit('Could not connect to the server, try again later.')
  return res.json()


# sends json data to server
def post_json(uid, pid, token, json):
  try:
    url = '{}/api/users/{}/plants/{}/readings'.format(BASE_URL, uid, pid)
    headers = {'Authorization': 'Bearer {}'.format(token)}
    res = requests.post(url, data=json, headers=headers)
    if (res.status_code == 403):
      return False
    if (res.status_code != 200):
      quit('Could not add data to plant selected.')
  except socket_eror:
    quit('Could not connect to the server, try again later.')


# sends the user an email notification
def send_email(uid, pid, message, token):
  try:
    url = '{}/api/sendnotification'.format(BASE_URL)
    headers = {'Authorization': 'Bearer {}'.format(token), 'Content-Type': 'application/x-www-form-urlencoded'}
    body = {'user_id': uid, 'plant_id': pid, 'text': message}
    res = requests.post(url, headers=headers, data=body)
    if (res.status_code == 200):
      return 'success'
    if (res.status_code == 403):
      return 'forbidden'
    if (res.status_code != 200):
      return 'fail'
  except socket_eror:
    quit('Could not connect to the server, try again later.')
  return res.json()


# acquire the user's credentials
username, password = get_credentials()

# destructure tuple into uid and token
uid, token = login(username, password)

# store all the plants a user currently has in the database
plants = get_all_plants(uid, token)

# if there are no plants in database, quit application
if (len(plants) == 0):
  print('You currently do not have any plants to select.')
  quit('Go to https://farmsignal.net and add a plant.')

# display all the plants the user currently has
print('\nWhich plant would you like to connect this Pi to?')
for index, plant in enumerate(plants):
  plant_data = '{})\tName: {}\n\tSpecies: {}\n'.format(index + 1, plant['plant_name'], plant['plant_species'])
  print(plant_data)

# determines what plant the user has selected and saves the pid
selected_plant = plants[select_plant(len(plants)) - 1] # we subtract 1 because array index starts at 0
pid = selected_plant['plant_id']

# checks to see if data.json file exists, if not it will create it
if not os.path.exists('./data.json'):
  write_json({}, './data.json')

# checks to see if the user has calibrated the plant before
try:
  has_calibrated = read_json('data.json')[str(pid)]['has_calibrated']
except KeyError:
  print('\nWill have to calibrate soil moisture sensor...')
  has_calibrated = False

# if user has not calibrated plant before, run calibration sequence
if (not has_calibrated):
  os.system('./calibration.py {}'.format(pid))
  print('\nDONE WITH CALIBRATION\n')
  lcd.print_to_lcd('Done', 'calibrating!')
else:
  lcd.print_to_lcd('No need to', 'calibrate.')
  print('Already calibrated system.')

# sends json data to server
try:
  json = read_json('data.json')[str(pid)]
  post_json(uid, pid, token, json)
except KeyError:
  print('Delete the data.json file and try again.')

# adjusted capacitance values of dry and wet soil from calibration
# these values only change upon running calibration sequence again
dry = json['dry_adjusted']
wet = json['wet_adjusted']

# every 10 minutes, send data to server about plant
# if water is not available, inform user that they need to refill their water source
# if water is available, water plant up to specified threshold
# send json data to sever and wait 10 minutes before doing everything over again
while (True):
  has_watered = False
  water_source_empty = False
  soil_percent = remap(dry, wet, 0, 100, soil_sensor.get_raw_value(channel=channel, sps=sps, pga=pga))

  # send get request to server to figure acquire watering thresholds
  data = get_specific_plant_data(uid, pid, token)[0]

  # if jwt has expired, request a new one and try again
  if (not data):
    uid, token = login(username, password)
    data = get_specific_plant_data(uid, pid, token)[0]

  # as long as watering threshold is in between 0 and 100 and the original
  # PERCENT_TO_WATER_PLANT differs from the new 'water_min', then reassign
  # the variable to the new watering threshold
  if (data['water_min'] != PERCENT_TO_WATER_PLANT and data['water_min'] > 0 and data['water_min'] < 100):
    PERCENT_TO_WATER_PLANT = data['water_min']

  # as long as the stopping point for the watering threshold is in between
  # 0 and 100 and the original PERCENT_TO_STOP_WATERING_PLANT differs from
  # the new 'water_max', then reassign the variable to the new watering threshold
  if (data['water_max'] != PERCENT_TO_STOP_WATERING_PLANT and data['water_max'] > 0 and data['water_max'] < 100):
    PERCENT_TO_STOP_WATERING_PLANT = data['water_max']

  # if water threshold has been met, water plant
  #   - if after a couple seconds, soil capacitance hasn't changed much, there is no water,
  #     inform user to add water and wait till next cycle (10 min) to check if plant needs water again
  #   - else if capacitance is above the 'stop' water threshold, stop watering plant and continue with loop
  if (soil_percent <= PERCENT_TO_WATER_PLANT):
    seconds_elapsed = 0
    times_checked_after_seconds_elapsed = 0
    relay.on()
    lcd.print_to_lcd('Watering plant', '')

    while True:
      # get current moisture percentage
      current_percent = remap(dry, wet, 0, 100, soil_sensor.get_raw_value(channel=channel, sps=sps, pga=pga))

      # if current percent is greater than or equal to PERCENT_TO_STOP_WATERING_PLANT, stop watering the plant
      if current_percent >= PERCENT_TO_STOP_WATERING_PLANT:
        print('Water moisture has reached threshold! Turning off relay!')
        relay.off()
        lcd.print_to_lcd('Done', 'watering')
        update_json('last_watered', get_current_time(), pid)
        has_watered = True
        break

      # if after 30 seconds the soil reading hasn't gone above threshold, inform user 
      if seconds_elapsed == SECONDS_TO_CHECK_SOIL_MOISTURE_CHANGE:
        new_percent = remap(dry, wet, 0, 100, soil_sensor.get_raw_value(channel=channel, sps=sps, pga=pga))

        if (new_percent < PERCENT_TO_STOP_WATERING_PLANT):
          times_checked_after_seconds_elapsed += 1

          # times_checked_after_seconds_elapsed has to be equal to 2 before you determine
          # that there is no more water in the water source.
          # This way, you run this check twice just to make sure that there is no water before
          # breaking out of the loop.
          if (times_checked_after_seconds_elapsed == 2):
            print('Looks like you may need more water.')
            lcd.print_to_lcd('Refill water', 'source')
            relay.off()
            update_json('last_watered', get_current_time(), pid)
            has_watered = True
            water_source_empty = True

          # reset seconds_elapsed
          seconds_elapsed = 0

      seconds_elapsed += 1

      # slowing down loop to get accurate sensor readings
      sleep(1)

  # gather updated values
  temperature, humidity = dht22.get_readings()
  raw_soil_capacitance = soil_sensor.get_raw_value(channel=channel, sps=sps, pga=pga)
  soil_percent = remap(dry, wet, 0, 100, raw_soil_capacitance)
  print('\nhumidity: {}\ntemperature: {}\nraw capacitance: {}\npercent: {}\n'.format(humidity, temperature, raw_soil_capacitance, soil_percent))

  # update json file
  update_json('humidity_data', round(humidity), pid)
  update_json('temperature_data', round(temperature), pid)
  update_json('raw_soil_capacitance', raw_soil_capacitance, pid)
  update_json('moisture_percent', round(soil_percent), pid)
  print('Updated data.json successfully.')

  # send an email notification to the user with data about their plant
  try:
    message = ''

    if (has_watered):
      message += '\nYour plant was watered successfully.\n'

    if (water_source_empty):
      message += '\nIt looks like you may need to refill your water source or your plant may not have yet reached its maximum watering threshold.\n'

    message += '\nHere is the current data about your plant:\n- Humidity: {}%\n- Temperature: {}°C\n- Moisture Percent: {}%\n'.format(round(humidity), round(temperature), round(soil_percent))
    status = send_email(uid=uid, pid=pid, message=message, token=token)

    if (status == 'success'):
      print('Email has been sent successfully.')
    elif (status == 'forbidden'):
      print('You do not have access to do that. Try stopping the application and restarting it.')
    else:
      print('Email was not sent successfully.')
  except:
    print('An error occured while trying to send an email.')

  # send post request to server
  try:
    updated_json = read_json('data.json')[str(pid)]
    post_json(uid, pid, token, updated_json)
    if (not post_json):
      uid, token = login(username, password)
      post_json(uid, pid, token, updated_json)
    print('Sent data to server successfully.')
  except KeyError:
    print('Data was not sent to server.\nDelete the data.json file and try again.')

  # display data on lcd
  lcd.print_to_lcd('Temp: {}C'.format(temperature), 'Humidity {}%'.format(humidity))

  # refresh jwt
  uid, token = login(username, password)

  # reset variables to keep track of watering for email notifications
  has_watered = False
  water_source_empty = False

  # wait specified amount of time before checking if the plant needs water again
  sleep(SECONDS_TO_CHECK)