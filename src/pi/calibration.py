#!/usr/bin/env python3
from hardware.soil_moisture_sensor import SoilMoistureSensor          # soil moisture sensor api
from hardware.lcd import lcd as LCD                                   # LCD wrapper class
from hardware.dht22 import DHT22                                      # DHT22 wrapper class
from util.util import remap                                           # remap function
from util.util import write_json                                      # writes data to json file
from util.util import get_current_time                                # function to get current time
import board
import sys

# constants
SECONDS_TO_CALIBRATE = 5                         # will calibrate for 5 seconds
CALIBRATION_THRESHOLD = 200                      # 200+/- for error

# ADS1115 (analog-to-digital converter)
ADS1115 = 0x01
channel = 1
sps = 250    # samples per second
pga = 6144   # programmable gain amplifier (mV)

# hardware
soil_sensor = SoilMoistureSensor(ic=ADS1115)
lcd = LCD()
dht22 = DHT22(board.D13, use_pulseio=False)


# gets the average raw reading of soil moisture
def get_avg_raw():
    print('Calibrating...')
    lcd.print_to_lcd(line1='Calibrating...', line2='')
    avg_raw = soil_sensor.calibrate(channel=channel, pga=pga, sps=sps, seconds=SECONDS_TO_CALIBRATE)

    return avg_raw


def calibrate_reading(message):
    print(message)
    if input() == '':
        raw_reading = get_avg_raw()

    return raw_reading


# will gather wet and dry readings and write them to a json file
def calibration_sequence(pid=1):
    # get raw values for dry, wet, and soil moisture
    dry_raw = calibrate_reading("Press ENTER to calibrate for DRY soil")
    wet_raw = calibrate_reading("Press ENTER to calibrate for WET soil")
    soil_moisture = calibrate_reading("Press ENTER to calibrate for CURRENT soil")

    # print to LCD
    lcd.print_to_lcd('Calibration', 'complete!')

    # gathers humidity, soil moisture percent, and current time
    temperature, humidity = dht22.get_readings()
    percent = remap(dry_raw, wet_raw, 0, 100, soil_moisture)

    # data to be stored as json
    data = {
        pid: {
            'moisture_data': soil_moisture,
            'moisture_percent': round(percent, 2),
            'raw_soil_capacitance': soil_moisture,
            'temperature_data': round(humidity, 2),
            'humidity_data': round(temperature, 2),
            'last_watered': None,
            'last_calibrated': get_current_time(),
            'dry_adjusted': dry_raw + CALIBRATION_THRESHOLD,
            'wet_adjusted': wet_raw - CALIBRATION_THRESHOLD,
            'has_calibrated': True,
            'water_min': 20,
            'water_max': 70,
            'channel': channel,
            # 'dry_adjusted': dry_raw + CALIBRATION_THRESHOLD,
            # 'wet_adjusted': wet_raw - CALIBRATION_THRESHOLD,
            # 'dry_raw': dry_raw,
            # 'wet_raw': wet_raw,
            # 'soil_moisture': soil_moisture,
            # 'soil_moisture_percent': round(percent, 2),
            # 'time_calibrated': get_current_time(),
            # 'has_calibrated': True,
            # 'humidity': round(humidity, 2),
            # 'temperature': round(temperature, 2),
            # 'time_last_watered': get_current_time() # change this later to None
        }
    }

    write_json(data)

if (len(sys.argv) == 1):
    quit('No plant id has been passed as a system argument.')

calibration_sequence(int(sys.argv[1]))