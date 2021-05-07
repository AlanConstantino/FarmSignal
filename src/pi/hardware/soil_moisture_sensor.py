from hardware.SDL_Adafruit_ADS1x15.SDL_Adafruit_ADS1x15 import ADS1x15
from time import time
from time import sleep

# instance to analog-to-digital converter ADS1115
# ADS1115 = 0x01
# ic just specifies the type of ADC
adc = ADS1x15(ic=0x01)

# Wrapper class for the SDL_Adafruit_ADS1X15 class, specifically the ADS1115 board
class SoilMoistureSensor(ADS1x15):
    # Notes:
    # channel 0 is bunk and doesn't work
    # each channel is for each i2c bus connected to the ADC (i.e. 1-3)


    # gets average reading of raw soil moisture after specified seconds
    #
    # channel = soil sensor has 4 channels     (0-3)
    # pga     = programmable gain amplifier    (6144 mV)
    # sps     = samples per second             (250 samples per second)
    # seconds = seconds to calibrate           (5 seconds)
    def calibrate(self, channel=1, pga=6144, sps=250, seconds=5):
        time_to_stop = time() + seconds
        total_raw = 0
        count = 1
        time_left = seconds
        calibrated_value = 0

        # calibrates sensor for however many seconds user specified
        while True:
            time_now = time()
            if time_to_stop < time_now:
                break

            total_raw += adc.readRaw(channel=channel, pga=pga, sps=sps)
            calibrated_value = total_raw / count
            count += 1
            print(str(time_left) + '...')
            time_left -= 1
            sleep(1)

        return calibrated_value

    # gets the raw 16-bit value from the sensor converted through the ADC
    #
    # channel = ADS1115 board has 4 channels     (0-3)
    # gain    = programmable gain amplifier      (6144 mV)
    # sps     = samples per second               (250 samples per second)
    def get_raw_value(self, channel=1, pga=6144, sps=250):
        return adc.readRaw(channel=channel, pga=pga, sps=sps)

# def test():
#     CALIBRATION_THRESHOLD = 200 # 200+/- for error
#     sensor = SoilMoistureSensor(channel=1)

#     print('Press ENTER to calibrate for DRY soil')
#     if raw_input() == '':
#         print('Calibrating...')
#         dry_value = sensor.calibrate(5) + CALIBRATION_THRESHOLD

#     print('Press ENTER to calibrate for WET soil')
#     if raw_input() == '':
#         print('Calibrating...')
#         wet_value = sensor.calibrate(5) - CALIBRATION_THRESHOLD

#     print('Press ENTER to calibrate for the current soil')
#     if raw_input() == '':
#         print('Calibrating...')
#         current_value = sensor.calibrate(5)
    
#     print(dry_value)
#     print(wet_value)
#     print(current_value)

# test()