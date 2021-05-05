.. _software:

=====================
Software Installation
=====================

Things Needed
-------------
- An account created on `FarmSignal <https://farmsignal.net/>`__ with a plant added.

  - You will need to both create an account and add a plant to your account in order to get started.

- Micro SD card (8gb minimum)

  - Optional: Make sure the SD card has fast read and write speeds.
  - If you're unsure about what micro SD card to choose, you can read `this <https://www.raspberrypi.org/documentation/installation/sd-cards.md>`__.

Start
-----

1. Create an account on `FarmSignal <https://farmsignal.net/>`__ and add a plant.

  .. figure:: ../images/install/add-plant.png
    :width: 400
    :alt: Navigation steps.

2. Back up your data from the micro SD card you plan on using then reformat it.
3. Flash the official Raspberry Pi OS onto the SD card.

  - If you already have the Raspberry Pi OS installed on the micro SD card, you can skip to step 3.
  - If you're not sure about how to flash the Raspberry Pi OS onto the micro SD card, you can follow these steps `here <https://www.raspberrypi.org/documentation/installation/installing-images/README.md>`__.
  - Tip: We recommend using `Balena Etcher <https://www.balena.io/etcher/>`__ to flash the Raspberry Pi OS onto the micro SD card.

4. Once you're logged in and at the Desktop, open the terminal and update the system using ``sudo apt-get update`` and ``sudo apt-get upgrade``

  - Insert image(s)

5. Once you finish updating and installing updates, navigate to the **Raspberry Pi Logo**, click it, then hover over **Preferences** and click on **Raspberry Pi Configuration**

  .. figure:: ../images/install/raspi-config.png
    :width: 400
    :alt: Navigation steps.

6. Once the **Raspberry Pi Configuration** menu pops up, go ahead and enable "SSH", "i2c", and "Remote GPIO" and then click ok to confirm your changes.

  - Note: You may be required to restart once you confirm your changes, if prompted to do so go ahead and restart your Pi.

  .. figure:: ../images/install/options-gui.png
    :width: 400
    :alt: Navigation steps.

7. Go to the `FarmSignal GitHub <https://github.com/AlanConstantino/FarmSignal/releases>`__ and under releases, download the latest release.

  - Insert image

8. Unzip the file you just downloaded on your Desktop.
9. Double-click the folder you just extracted to go inside of it and navigate to the Pi folder and go inside of it.
10. Once you're inside of the Pi folder, right click inside of it and bring up the terminal.
11. Once you bring up your terminal, run the following command to install some Python depedencies needed for FarmSignal to function properly.

  - Run the command ``pip3 install adafruit-circuitpython-dht``
  - Run the command ``sudo apt-get install libgpiod2``

12. Now open the ``FarmSignal/Pi`` folder and give the file ``calibration.py`` executable permissions with the ``chmod`` command.

  - Open a new terminal window and navigate to the ``FarmSignal/Pi`` directory with the following command ``cd ~/Desktop/FarmSignal/Pi``
  - Give the ``calibration.py`` file executable permissions with the following command ``chmod +x calibration.py``

13. Start the FarmSignal application by running the following command ``python3 app.py``
14. Follow the instructions as they appear on the terminal.
15. Head over to the `FarmSignal <https://farmsignal.net>`__ web app and click on the plant you decided to connect the Raspberry Pi to and you should see some data appear.

  .. figure:: ../images/install/data.png
    :width: 400
    :alt: Navigation steps.

16. Enjoy!