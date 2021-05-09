.. _python:

Python Hardware Code
====================

.. code-block::

  pi/
  ├── app.py
  ├── calibration.py
  ├── hardware
  │   ├── dht22.py
  │   ├── lcd.py
  │   ├── relay.py
  │   ├── SDL_Adafruit_ADS1x15
  │   ├── soil_moisture_sensor.py
  ├── requirements.txt
  ├── test.py
  └── util

======
app.py
======

The main start of the Python terminal application. This file runs the calibration sequence, calibrates the soil moisture sensor and grabs the current readings of the various sensors and then writes all this data to a JSON file named ``data.json``.
The ``data.json`` file is then sent to the back-end to be displayed to the user on the front-end.

==============
calibration.py
==============

This file runs the calibration sequence to determine the ``wet``, ``dry``, and ``current`` soil moisture readings. You must give this file executable permissions (``chmod +x``) in order to be used with ``app.py``.
To run this file as a standalone program, you must pass it in the plant id of the plant you're currently trying to calibrate as a command line argument.


========
hardware
========

This folder contains various classes and libraries that interface with the hardware that is connected to the Raspberry Pi.

dht22.py
--------

A class that interfaces with the DHT22 sensor.

lcd.py
------

A class that interfaces with the LCD display.

relay.py
--------

A class that interfaces with the Relay.

SDL_Adafruit_ADS1x15
--------------------

A folder that contains the libraries to interface with the ADS1115 analog-to-digital converter.

soil_moisture_sensor.py
-----------------------

A wrapper class for the analog-to-digital board in ``SDL_Adafruit_ADS1x15/SDL_Adafruit_ADS1x15.py`` which interfaces with the soil moisture sensor.

test.py
-------

A simple test file that reads from all four channels of the soil moisture sensor.

util
----

A folder that contains additional utility files to make reading and writing to files easier.