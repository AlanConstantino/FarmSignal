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