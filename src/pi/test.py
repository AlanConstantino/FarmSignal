# DHT22
import board
from hardware.dht22 import DHT22

# Relay
from hardware.relay import Relay

# soil sensor
from hardware.soil_moisture_sensor import SoilMoistureSensor
from util.util import remap

# sleep
from time import sleep

# utility to get current time
from util.util import get_current_time

# TEST FOR JWT
# UID = None
# TOKEN = None
# test1, test2 = (False, False)

# t = True

# if t:
#   if t:
#     UID = 3
#     test1 = True
#     print(UID)

# print(test1)
# print(test2)
# print(UID)


# TEST FOR ADC AND SOIL MOISTURE SENSOR
channel = 1
gain = 4096
sps = 250
pga = 6144
ADS1115 = 0x01

# sensor = SoilMoistureSensor(ic=ADS1115)

# check to get data from all slots on the analog to digital converter (channels 0-3)
iteration = 0
while True:
  iteration += 1
  channel0 = sensor.get_raw_value(channel=0, sps=sps, pga=pga)
  volts0 = sensor.readADCSingleEnded(channel=1, pga=pga, sps=sps) / 1000
  channel1 = sensor.get_raw_value(channel=1, sps=sps, pga=pga)
  volts1 = sensor.readADCSingleEnded(channel, pga=pga, sps=sps) / 1000
  channel2 = sensor.get_raw_value(channel=2, sps=sps, pga=pga)
  volts2 = sensor.readADCSingleEnded(channel, pga=pga, sps=sps) / 1000
  channel3 = sensor.get_raw_value(channel=3, sps=sps, pga=pga)
  volts3 = sensor.readADCSingleEnded(channel, pga=pga, sps=sps) / 1000
  print('iteration {}'.format(iteration))
  print('channel 0: {}'.format(channel0))
  print('channel 0 volts: {} mV'.format(volts0))
  print('channel 1: {}'.format(channel1))
  print('channel 1 volts: {} mV'.format(volts1))
  print('channel 2: {}'.format(channel2))
  print('channel 2 volts: {} mV'.format(volts2))
  print('channel 3: {}'.format(channel3))
  print('channel 3 volts: {} mV\n'.format(volts3))
  sleep(2)

# TEST FOR RELAY
# relay_pin = 12
# active_high = False
# relay = Relay(relay_pin, active_high)
# relay.on()
# print(soil_sensor.get_raw_value())
# sleep(5)
# print(soil_sensor.get_raw_value())
# relay.off()


# TEST FOR DHT22 (TEMPERATURE & HUMIDITY) SENSOR
# dht22 = DHT22(board.D13, use_pulseio=False)

# while True:
#   temperature, humidity = dht22.get_readings()
#   print('Temperature: {} C\nHumidity: {} %\n'.format(temperature, humidity))
#   sleep(5)