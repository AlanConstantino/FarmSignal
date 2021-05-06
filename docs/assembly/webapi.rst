##############################
WebAPI documentation
##############################

APIs
****

----------
/api/login
----------

POST
####

Description: Logs into account

Parameters

======== ========== ======== =========== ======= ======
Name     Located in Required Description Default Schema
======== ========== ======== =========== ======= ======
username body       yes                  -       string
password body       yes                  -       string
======== ========== ======== =========== ======= ======

Response

=========== ========== ====================
Status Code Reason     Response Model
=========== ========== ====================
200         success    JSON UserID, token
=========== ========== ====================

-------------
/api/register
-------------

POST
####

Description: Creates an account

Parameters

======== ========== ======== =========== ======= ======
Name     Located in Required Description Default Schema
======== ========== ======== =========== ======= ======
email    body       yes                  -       string
username body       yes                  -       string
password body       yes                  -       string
======== ========== ======== =========== ======= ======

Response

=========== ========== ====================
Status Code Reason     Response Model
=========== ========== ====================
200         success    JSON UserID, token
=========== ========== ====================

------------------
/api/passwordreset
------------------

POST
####

Description: Sends password reset email

Parameters

======== ========== ======== =========== ======= ======
Name     Located in Required Description Default Schema
======== ========== ======== =========== ======= ======
username body       yes                  -       string
======== ========== ======== =========== ======= ======

Response

=========== ========== ==========================
Status Code Reason     Response Model
=========== ========== ==========================
200         success    Sends password reset email
=========== ========== ==========================

----------------------------------
/api/resetpassword/:id/:token
----------------------------------

POST
####

Description: Verifies the password reset id and token

Parameters

======== ========== ======== =========== ======= ======
Name     Located in Required Description Default Schema
======== ========== ======== =========== ======= ======
id       path       yes                  -       int
token    path       yes                  -       string
======== ========== ======== =========== ======= ======

Response

=========== ========== ====================
Status Code Reason     Response Model
=========== ========== ====================
200         success
=========== ========== ====================

----------------------------------
/api/resetpassword/
----------------------------------

POST
####

Description: Resets the password

Parameters

======== ========== ======== =========== ======= ======
Name     Located in Required Description Default Schema
======== ========== ======== =========== ======= ======
id       body       yes                  -       int
token    body       yes                  -       string
password body       yes                  -       string
======== ========== ======== =========== ======= ======

Response

=========== ========== ====================
Status Code Reason     Response Model
=========== ========== ====================
301         success    Redirects to login
=========== ========== ====================

----------------------------------
/api/sendnotification/
----------------------------------

POST
####

Description: Sends notification email

Parameters

======== ========== ======== =========== ======= ======
Name     Located in Required Description Default Schema
======== ========== ======== =========== ======= ======
plant_id body       yes                  -       int
text     body       yes                  -       string
authJWT  header     yes                  -       string
======== ========== ======== =========== ======= ======

Response

=========== ========== =================================
Status Code Reason     Response Model
=========== ========== =================================
200         success    Sent notification email with text
=========== ========== =================================

----------------------------------
/api/users/
----------------------------------

GET
####

Description: Gets all users as a JSON

Parameters

======== ========== ======== =========== ======= ======
Name     Located in Required Description Default Schema
======== ========== ======== =========== ======= ======
authJWT  header     yes                  -       string
======== ========== ======== =========== ======= ======

Response

=========== ========== =================================
Status Code Reason     Response Model
=========== ========== =================================
200         success    JSON of all users
=========== ========== =================================

----------------------------------
/api/users/:user
----------------------------------

GET
####

Description: Gets JSON of a single user

Parameters

======== ========== ======== =========== ======= ======
Name     Located in Required Description Default Schema
======== ========== ======== =========== ======= ======
user     path       yes      User ID     -       int
authJWT  header     yes                  -       string
======== ========== ======== =========== ======= ======

Response

=========== ========== =================================
Status Code Reason     Response Model
=========== ========== =================================
200         success    JSON of the user
=========== ========== =================================

PUT
####

Description: Updates values of a user

Parameters

======== ========== ======== =========== ======= ======
Name     Located in Required Description Default Schema
======== ========== ======== =========== ======= ======
user     path       yes      User ID     -       int
username body       optional             -       string
email    body       optional             -       string
password body       optional             -       string
authJWT  header     yes                  -       string
======== ========== ======== =========== ======= ======

Response

=========== ========== =================================
Status Code Reason     Response Model
=========== ========== =================================
200         success
=========== ========== =================================

DELETE
######

Description: Deletes a user

Parameters

======== ========== ======== =========== ======= ======
Name     Located in Required Description Default Schema
======== ========== ======== =========== ======= ======
user     path       yes      User ID     -       int
authJWT  header     yes                  -       string
======== ========== ======== =========== ======= ======

Response

=========== ========== =================================
Status Code Reason     Response Model
=========== ========== =================================
200         success
=========== ========== =================================

----------------------------------
/api/users/:user/plants
----------------------------------

GET
####

Description: Gets all plant info of user as JSON

Parameters

======== ========== ======== =========== ======= ======
Name     Located in Required Description Default Schema
======== ========== ======== =========== ======= ======
user     path       yes      User ID     -       int
authJWT  header     yes                  -       string
======== ========== ======== =========== ======= ======

Response

=========== ========== =================================
Status Code Reason     Response Model
=========== ========== =================================
200         success    JSON of the user's plants
=========== ========== =================================

POST
####

Description: Creates plant info of user

Parameters

============== ========== ======== =========== ======= ======
Name           Located in Required Description Default Schema
============== ========== ======== =========== ======= ======
user           path       yes      User ID     -       int
plantname      body       yes                  -       string
species        body       optional             -       string
notification   body       optional             -       bool
water_min      body       optional             -       int
water_max      body       optional             -       int
authJWT        header     yes                  -       string
============== ========== ======== =========== ======= ======

Response

=========== ========== =================================
Status Code Reason     Response Model
=========== ========== =================================
200         success    JSON with plantId
=========== ========== =================================

----------------------------------
/api/users/:user/plants/:plant
----------------------------------

GET
####

Description: Gets plant info of specific plant

Parameters

======== ========== ======== =========== ======= ======
Name     Located in Required Description Default Schema
======== ========== ======== =========== ======= ======
user     path       yes      User ID     -       int
plant    path       yes      Plant ID    -       int
authJWT  header     yes                  -       string
======== ========== ======== =========== ======= ======

Response

=========== ========== =================================
Status Code Reason     Response Model
=========== ========== =================================
200         success    JSON of the plant
=========== ========== =================================

PUT
####

Description: Updates values of specific plant

Parameters

============== ========== ======== =========== ======= ======
Name           Located in Required Description Default Schema
============== ========== ======== =========== ======= ======
user           path       yes      User ID     -       int
plant          path       yes      Plant ID    -       int
plantname      body       optional             -       string
species        body       optional             -       string
notification   body       optional             -       bool
water_min      body       optional             -       int
water_max      body       optional             -       int
authJWT        header     yes                  -       string
============== ========== ======== =========== ======= ======

Response

=========== ========== =================================
Status Code Reason     Response Model
=========== ========== =================================
200         success
=========== ========== =================================

DELETE
######

Description: Deletes a specific plant

Parameters

======== ========== ======== =========== ======= ======
Name     Located in Required Description Default Schema
======== ========== ======== =========== ======= ======
user     path       yes      User ID     -       int
plant    path       yes      Plant ID    -       int
authJWT  header     yes                  -       string
======== ========== ======== =========== ======= ======

Response

=========== ========== =================================
Status Code Reason     Response Model
=========== ========== =================================
200         success
=========== ========== =================================

---------------------------------------
/api/users/:user/plants/:plant/readings
---------------------------------------

GET
####

Description: Gets all plant data of a plant

Parameters

======== ========== ======== =========== ======= ======
Name     Located in Required Description Default Schema
======== ========== ======== =========== ======= ======
user     path       yes      User ID     -       int
plant    path       yes      Plant ID    -       int
authJWT  header     yes                  -       string
======== ========== ======== =========== ======= ======

Response

=========== ========== =================================
Status Code Reason     Response Model
=========== ========== =================================
200         success    JSON of the user's plant data
=========== ========== =================================

POST
####

Description: Creates plant data of plant

Parameters

==================== ========== ======== =========== ======= ======
Name                 Located in Required Description Default Schema
==================== ========== ======== =========== ======= ======
user                 path       yes      User ID     -       int
plant                path       yes      Plant ID    -       int
moisture_percent     body       yes                  -       int
temperature_data     body       yes                  -       int
humidity_data        body       yes                  -       int
raw_soil_capacitance body       yes                  -       int
last_watered         body       optional             -       DATE
last_calibrated      body       optional             -       DATE
authJWT              header     yes                  -       string
==================== ========== ======== =========== ======= ======

Response

=========== ========== =================================
Status Code Reason     Response Model
=========== ========== =================================
200         success
=========== ========== =================================

DELETE
######

Description: Deletes plant data of plant

Parameters

======== ========== ======== =========== ======= ======
Name     Located in Required Description Default Schema
======== ========== ======== =========== ======= ======
user     path       yes      User ID     -       int
plant    path       yes      Plant ID    -       int
authJWT  header     yes                  -       string
======== ========== ======== =========== ======= ======

Response

=========== ========== =================================
Status Code Reason     Response Model
=========== ========== =================================
200         success
=========== ========== =================================

-------------------------------------
/api/users/:user/plants/:plant/upload
-------------------------------------

GET
####

Description: Gets plant image

Parameters

======== ========== ======== =========== ======= ======
Name     Located in Required Description Default Schema
======== ========== ======== =========== ======= ======
user     path       yes      User ID     -       int
plant    path       yes      Plant ID    -       int
authJWT  header     yes                  -       string
======== ========== ======== =========== ======= ======

Response

=========== ========== =================================
Status Code Reason     Response Model
=========== ========== =================================
None        -          index.hbs
=========== ========== =================================

PUT
####

Description: Adds plant image

Parameters

============== ========== ======== =========== ======= ======
Name           Located in Required Description Default Schema
============== ========== ======== =========== ======= ======
user           path       yes      User ID     -       int
plant          path       yes      Plant ID    -       int
sampleFile     files      yes                  -       file
authJWT        header     yes                  -       string
============== ========== ======== =========== ======= ======

Response

=========== ========== =================================
Status Code Reason     Response Model
=========== ========== =================================
301         success    Redirect to the GET path
=========== ========== =================================