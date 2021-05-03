################
React Components
################

Directory Structure:

.. code-block::

  ├── FarmSignal
     ├── back-end
     ├── front-end
          ├── build
          ├── node_modules
          ├── package.json
          ├── package-lock.json
          ├── public
          ├── README.md
          └── src
     ├── images
     ├── pi
     └── README.md

In the ``front-end/src`` folder is where you'll find all the pages for the front-end that are currently served up in `FarmSignal <https://farmsignal.net>`_.

=====
Title
=====

Header 1
========

Header 1.1
----------

Header 1.1.1
~~~~~~~~~~~~

Header 1.1.1.1
""""""""""""""

``path/to/item``

Description.

Component Name or Page
----------------------

This component does stuff.






==========================
Entry point of application
==========================

``FarmSignal/front-end/src/app.js``

App.js
------
Start point of the application.






==========
Components
==========

``FarmSignal/front-end/src/components``

The main folder in which components are stored.

CSS
===

``FarmSignal/front-end/src/components/css``

AddPlant.css
------------

This file does stuff.

Pages
=====

``FarmSignal/front-end/src/components/pages``

The main folder in which the pages are stored.

404.js
------

``FarmSignal/front-end/src/components/pages/404.js``

The 404 page.

AddPlant.js
-----------

``FarmSignal/front-end/src/components/pages/AddPlant.js``

The add plant page is where the user can enter a plant name, plant species and upload an image. The page is displayed as 
a series of steps. In the first step, the use enters a plant's name and species. In the second step the user is given the option 
to select an image through a file explorer or drag and drop a file into a boxed element. On the third page, the user is shown the 
image selected along with the chosen plant name and species. The user has the option to verify these inputs by pressing the 
confirm button to accept or the reset button. Upon pressing the reset button the user is taken back to the first step where they can
re-enter their inputs.

DeletePlant.js
--------------

``FarmSignal/front-end/src/components/pages/DeletePlant.js``

The delete plant page shows a list of plants the user has added. 
This page allows a user to delete a plant by pressing the trash can icon next to the corresponding plant.

Home.js
-------

``FarmSignal/front-end/src/components/pages/Home.js``

The home page displays the all of the user's plants through an array of cards. 
Each card is a clickable element that displays the plant's image and name. 
Once a plant card is clicked the user is taken to that plant's plant info page.

Landing.js
----------

``FarmSignal/front-end/src/components/pages/Landing.js``

The landing page is the first page shown to the user upon navigating to `FarmSignal <https://farmsignal.net>`_. 
Here the user can choose to either log in or sign up. The user is taken to the appropriate page based on the button pressed.

Login.js
--------

``FarmSignal/front-end/src/components/pages/Login.js``

The log in page is where the user can authenticate their identity by entering the username and password created during sign up. 
Upon valid credential entry, the user is taken to the home page.
If the user's password is not known they can use the forgot password link to navigate to the password recovery page.

PasswordRecovery.js
-------------------

``FarmSignal/front-end/src/components/pages/PasswordRecovery.js``

The password recovery page is where a user can recover a lost password. After entering a username and pressing
the email recovery link button the user is taken to the sent password recovery page and an email is sent to the user's 
provided email address. The email contains a link that takes the user to the reset password page.

Tabs
====

``FarmSignal/front-end/src/components/Tabs``

This folder contains stuff.

ChartsTab.js
------------
``FarmSignal/front-end/src/components/Tabs/ChartsTab.js``

This is where all the charts are.

Auth.js
=======
``FarmSignal/front-end/src/components/Auth.js``

This file takes care of user authentication.