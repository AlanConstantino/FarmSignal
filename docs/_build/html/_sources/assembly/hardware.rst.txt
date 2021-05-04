.. _hardware:

=================
Hardware Assembly
=================

1. Attach the Pi2Grover hat to the Raspberry Pi 4.

  .. figure:: ../images/assembly/File_000.jpeg
    :width: 400
    :alt: Raspberry Pi and Pi2Grover.

  .. figure:: ../images/assembly/File_001.jpeg
    :width: 400
    :alt: Pi2Grover attached to the Raspberry Pi.

2. Grab your DHT22 sensor and attach a grove 4-pin connector to it.

  - Attach the female end of the red wire from the grove 4-pin connector to the male end labeled "+" on the DTH22 sensor.
  - Attach the female end of the white wire from the grove 4-pin connector to the male end labeled "out" on the DHT22 sensor.
  - Attach the female end of the black wire from the grove 4-pin connector to the male end labeled "-" on the DHT22 sensor.

    .. figure:: ../images/assembly/File_006.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_009.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_004.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

3. Connect the capcitive soil moisture sensor to the grove analog-to-digital ADS1115 board.

  - Optional: Wrap electrical tape around the top of the capacitive soil moisture sensor to add protection to the exposed chips on the sensor.

    .. figure:: ../images/assembly/File_012.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

  - Attach the wires that came with your soil moisture sensor to the top of the soil moisture sensor.

    .. figure:: ../images/assembly/File_016.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

  - Grab some male to male jumper wires and attach them to the ends of the female connections on the soil sensor.

    .. figure:: ../images/assembly/File_018.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_019.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

  - Grab a grove 4-pin connector to jumper wires and connect that cable to the male ends of the male to male wires you just attached to the soil sensor.

    .. figure:: ../images/assembly/File_020.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_021.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

4. Attach the capacitive soil moisture sensor to the header connector "A0" on the grove analog-to-digital ADS1115 board.

  .. figure:: ../images/assembly/File_023.jpeg
    :width: 400
    :alt: Pi2Grover attached to the Raspberry Pi.

  .. figure:: ../images/assembly/File_027.jpeg
    :width: 400
    :alt: Pi2Grover attached to the Raspberry Pi.

5. Connect a grove to grove connector to the "I2C" header on the analog-to-digital ADS1115 board to the "I2C" header on the Pi2Grover.

  - Connect the grove to grove connector to the "I2C" header on the analog-to-digital ADS1115 board.

    .. figure:: ../images/assembly/File_028.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

  - Connect the other end of the grove to grove connector to the "I2C" header on the Raspberry Pi.

    .. figure:: ../images/assembly/File_032.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_033.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

6. Attach the end of the DHT22 sensor's grove connector the the header labeled "D12/13" on the Pi2Grover.

  .. figure:: ../images/assembly/File_035.jpeg
    :width: 400
    :alt: Pi2Grover attached to the Raspberry Pi.

  .. figure:: ../images/assembly/File_039.jpeg
    :width: 400
    :alt: Pi2Grover attached to the Raspberry Pi.

7. Grab your DC power jack and attach male to male jumper wires to the end of the DC jack (you will need to screw in the wires into the jack, make sure to not tighten them too much).

  .. figure:: ../images/assembly/File_041.jpeg
    :width: 400
    :alt: Pi2Grover attached to the Raspberry Pi.

  .. figure:: ../images/assembly/File_043.jpeg
    :width: 400
    :alt: Pi2Grover attached to the Raspberry Pi.

  .. figure:: ../images/assembly/File_044.jpeg
    :width: 400
    :alt: Pi2Grover attached to the Raspberry Pi.

8. Attach an alligator clip to the end the negative (black) wire on the DC jack.

  .. figure:: ../images/assembly/File_046.jpeg
    :width: 400
    :alt: Pi2Grover attached to the Raspberry Pi.

9. Grab another alligator clip and another male to male jumper wire and connect them together.

  .. figure:: ../images/assembly/File_047.jpeg
    :width: 400
    :alt: Pi2Grover attached to the Raspberry Pi.

10. Now grab two female to female jumper wires and connect them to the Relay.

    .. figure:: ../images/assembly/File_049.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

  - Grab one female to female jumper wire and connect it to the "JD_VCC" and "VCC" pins on the relay.

    .. figure:: ../images/assembly/File_051.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_053.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

  - Grab the other female to female jumper wire and connect it to the pins labeled "GND" and "IN1" on the relay.

    .. figure:: ../images/assembly/File_054.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_056.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

11. Now grab the alligator clip wire extension that is not connected to the DC jack and screw it into the relay module labeled "K1"

    .. figure:: ../images/assembly/File_057.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_058.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_059.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_060.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

12. Grab the other alligator clip that is connected to the DC jack and attach it beside the first alligator clip on the relay module labeled "K1"

    .. figure:: ../images/assembly/File_061.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_064.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_065.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_066.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

13. Now attach the female ends from the wires on the relay board to the pins on from the Pi2Grover attached to the Pi.

  - Attach the "GND" wire from the relay to physical pin 34 on the Pi and attach the "IN1" wire from the relay to physical pin 32 (GPIO 12) on the Pi2Grover.

    .. figure:: ../images/assembly/File_068.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_071.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_069.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_070.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

  - Attach the "VCC" wire from the relay into physical pin 1 on the Pi and attach the "JD_VCC" wire from the relay to physical pin 2 on the Pi2Grover.

    .. figure:: ../images/assembly/File_072.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_074.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_073.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_075.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_076.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

14. Attach your desired length of silicone tubing with zip ties to the ends of the water pump (do not overtighten the zip ties because that can restrict water flow).

    .. figure:: ../images/assembly/File_077.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_079.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

15. Attach the ends of the alligator clips connected to the relay to the prongs sticking out from the water pump. For this part, the orientation in which you attach the
    alligator clips to the water pump doesn't matter, it only switches the way in which water flows in and out of the water pump.

    .. figure:: ../images/assembly/File_084.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

    .. figure:: ../images/assembly/File_083.jpeg
      :width: 400
      :alt: Pi2Grover attached to the Raspberry Pi.

Optional: Attach the LCD to the Raspberry Pi.

1. Grab a grove 4-pin connector to jumper wires and attach it to the back of your LCD screen.

  - Attach the black wire from the grove connector to the pin labeled "GND" on the back of the LCD.
  - Attach the red wire from the grove connector to the pin labeled "VCC" on the back of the LCD.
  - Attach the white wire from the grove connector to the pin labeled "SDA" on the back of the LCD.
  - Attach the yellow wire from the grove connector to the pin labeled "SCL" on the back of the LCD.

  .. figure:: ../images/assembly/File_087.jpeg
    :width: 400
    :alt: Pi2Grover attached to the Raspberry Pi.

  .. figure:: ../images/assembly/File_090.jpeg
    :width: 400
    :alt: Pi2Grover attached to the Raspberry Pi.

  .. figure:: ../images/assembly/File_091.jpeg
    :width: 400
    :alt: Pi2Grover attached to the Raspberry Pi.

2. Attach the end of the grove header from the LCD to the "I2C" header on Pi2Grover attached to the Raspberry Pi.

  .. figure:: ../images/assembly/File_092.jpeg
    :width: 400
    :alt: Pi2Grover attached to the Raspberry Pi.

  .. figure:: ../images/assembly/File_093.jpeg
    :width: 400
    :alt: Pi2Grover attached to the Raspberry Pi.

  .. figure:: ../images/assembly/File_094.jpeg
    :width: 400
    :alt: Pi2Grover attached to the Raspberry Pi.
