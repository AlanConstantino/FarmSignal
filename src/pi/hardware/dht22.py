from time import sleep
import adafruit_dht

class DHT22:
  def __init__(self, board_pin, use_pulseio):
    self.device = adafruit_dht.DHT22(board_pin, use_pulseio=False)
  
  def get_readings(self):
    reading_done = False

    while not reading_done:
      try:
        temperature_c = self.device.temperature
        # temperature_f = temperature_c * (9 / 5) + 32
        humidity = self.device.humidity
        reading_done = True
      except RuntimeError as error:
        # Errors happen fairly often, DHT's are hard to read, just keep going
        print('Errors are normal, just be patient.')
        print(error.args[0])
        sleep(2.0)
        continue
      except Exception as error:
        self.device.exit()
        raise error
    # print('{} C'.format(self.device.temperature))
    # print('{} %'.format(self.device.humidity))
    return (self.device.temperature, self.device.humidity)
