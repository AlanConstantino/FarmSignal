##############################
MySQL Documentation
##############################

------------------
Table Layout
------------------



Account info 
############

===================== ============ ============================= =====================
Column Name           DataType     Storage                       Default Expression
===================== ============ ============================= =====================     
User                  INT          Primary Key, Not null         Default
Email address         VARCHAR      Not null                      Default
Username              VARCHAR      Not null, Unique              Default
Password              VARCHAR      Not null                      Current TimeStamp
Registration data     VARCHAR      N/A                           Default
===================== ============ ============================= =====================  



Plant Data                                                          
##########

===================== ============ ============================= ====================
Column Name           DataType     Storage                       Default Expression
===================== ============ ============================= ====================     
Plant Data ID         INT          Primary Key, Not null         Current TimeStamp
Date Data             TimeStamp    Not null                      0.0
temperature data      DECIMAL      N/A                           0.0
Humidity data         DECIMAL      N/A                           Null
Plant ID              INT          N/A                           Default
User ID               INT          Not Null                      0.0
Moisture percent      DECIMAL      N/A                           Null
Last Watered          TimeStamp    N/A                           Null
Last Calibrated       TimeStamp    N/A                           0.0 
Raw Soil Capacitance  DECIMAL      N/A                           Default
===================== ============ ============================= ====================   


Plant Image 
###########

===================== ============ ============================= =====================
Column Name           DataType     Storage                       Default Expression
===================== ============ ============================= =====================    
ID                    INT          Primary Key, Not null         Default
Plant Image           VARCHAR      Null                          Null
User ID               INT          Not null                      Default
Plant ID              INT          Not null                      Default
===================== ============ ============================= =====================   
                                                                    


Plant Info  
##########

===================== ============ ============================= =====================
Column Name           DataType     Storage                       Default Expression
===================== ============ ============================= =====================     
Plant ID              INT          Primary Key, Not null         Default
Plant Name            VARCHAR      Not null                      Default
Plant Species         VARCHAR      Not Null                      Default
Plant Image           VARCHAR      Null                          Null
Date Added            TimeStamp    Not null                      Current TimeStamp
User ID               INT          Not null                      Default
Notification          Tiny INT     Not null                      0
Water Min             INT          Not null                      20
Water Max             INT          Not null                      60
===================== ============ ============================= =====================   