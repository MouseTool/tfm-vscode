--- @meta

--- @class XYString:string @String coordinates in the `x,y` format

--- @class debuglibtfm
debug = {}

--- @class oslibtfm
os = {}

--- @class osdatetfm
--- four digits
--- [View documents](command:extension.lua.doc?["en-us/52/manual.html/pdf-osdate.year"])
--- @field year integer
--- 1-12
--- [View documents](command:extension.lua.doc?["en-us/52/manual.html/pdf-osdate.month"])
--- @field month integer
--- 1-31
--- [View documents](command:extension.lua.doc?["en-us/52/manual.html/pdf-osdate.day"])
--- @field day integer
--- 0-23
--- [View documents](command:extension.lua.doc?["en-us/52/manual.html/pdf-osdate.hour"])
--- @field hour integer
--- 0-59
--- [View documents](command:extension.lua.doc?["en-us/52/manual.html/pdf-osdate.min"])
--- @field min integer
--- 0-61
--- [View documents](command:extension.lua.doc?["en-us/52/manual.html/pdf-osdate.sec"])
--- @field sec integer
--- weekday, 1–7, Sunday is 1
--- [View documents](command:extension.lua.doc?["en-us/52/manual.html/pdf-osdate.wday"])
--- @field wday integer
--- day of the year, 1–366
--- [View documents](command:extension.lua.doc?["en-us/52/manual.html/pdf-osdate.yday"])
--- @field yday integer
--- daylight saving flag, a boolean
--- [View documents](command:extension.lua.doc?["en-us/52/manual.html/pdf-osdate.isdst"])
--- @field isdst boolean

--- Global Transformice namespace
tfm = {}

--- Transformice enumerations table
tfm.enum = {}

--- @class TfmMisc
--- @field apiVersion string
--- @field transformiceVersion number

--- @class TfmShamanObject
--- @field angle integer
--- @field baseType integer
--- @field colors string[]
--- @field ghost boolean
--- @field id integer
--- @field type integer
--- @field vx integer @The horizontal speed of the object.
--- @field vy integer @The vertical speed of the object.
--- @field x integer @The horizontal coordinate of the object.
--- @field y integer @The vertical coordinate of the object.

--- @class TfmPlayer
--- @field cheeses integer @The number of cheeses that the player is carrying. This property is useful in multiple-cheese maps (dodue).
--- @field community string @The legacy community of the player. This exists for backward compatibility, consider using `language` instead.
--- @field gender integer
--- @field hasCheese boolean
--- @field id integer
--- @field inHardMode integer @Deprecated. Use `shamanMode` instead.
--- @field isDead boolean
--- @field isFacingRight boolean
--- @field isInvoking boolean
--- @field isJumping boolean
--- @field isShaman boolean
--- @field isVampire boolean
--- @field language string
--- @field look string
--- @field movingLeft boolean
--- @field movingRight boolean
--- @field playerName string
--- @field registrationDate integer
--- @field score integer
--- @field shamanMode integer
--- @field spouseId integer
--- @field spouseName string
--- @field title integer
--- @field tribeId integer
--- @field tribeName string
--- @field vx integer @The horizontal speed of the player.
--- @field vy integer @The vertical speed of the player.
--- @field x integer @The horizontal coordinate of the player.
--- @field y integer @The vertical coordinate of the player.

--- @class XmlMapInfo
--- @field author string
--- @field mapCode integer
--- @field permCode integer
--- @field xml string

--- @class TfmRoom
--- @field community string @The legacy community of the room. This exists for backward compatibility, consider using `language` instead.
--- @field currentMap string
--- @field isTribeHouse boolean
--- @field language string
--- @field maxPlayers integer
--- @field mirroredMap boolean
--- @field name string
--- @field objectList table<integer, TfmShamanObject> @<objectId, objectMeta>
--- @field passwordProtected boolean
--- @field playerList table<string, TfmPlayer> @<playerName, playerMeta>
--- @field uniquePlayers integer|nil @The number of unique IP addresses in the room. Module team only.
--- @field xmlMapInfo XmlMapInfo|nil

--- @alias JointType
---| '0' # distance joint
---| '1' # prismatic joint
---| '2' # pulley joint
---| '3' # revolute joint

-- NOTE: to remove joint custom type description when/if lua-vscode
-- supports expanding alias description of fields
--- @class JointDef
--- @field type JointType @0 -> distance joint, 1 -> prismatic joint, 2 -> pulley joint, 3 -> revolute joint
--- @field point1 XYString @location of the ground1 anchor (default: the ground1's center)
--- @field point2 XYString @location of the ground2 anchor (default: the ground2's center), only used with distance and pulley joints
--- @field point3 XYString @location of the pulley's first anchor, only used with pulley joints
--- @field point4 XYString @location of the pulley's second anchor, only used with pulley joints
--- @field frequency number @distance joints' frequency
--- @field damping number @distance joints' damping ratio
--- @field axis XYString @prismatic joints' axis
--- @field angle XYString @prismatic joints' angle
--- @field limit1 number @prismatic and revolute joints' translation/rotation first limit
--- @field limit2 number @prismatic and revolute joints' translation/rotation second limit
--- @field forceMotor number @prismatic and revolute joints' motor power
--- @field speedMotor number @prismatic and revolute joints' motor speed
--- @field ratio number @revolute joints' ratio
--- @field line integer @draw line's thickness
--- @field color integer float @draw line's color
--- @field alpha number @draw line's opacity
--- @field foreground boolean @whether the draw line is foreground

--- @class BodyDef
--- @field type integer
--- @field width integer
--- @field height integer
--- @field foreground boolean
--- @field friction number
--- @field restitution number
--- @field angle integer
--- @field color integer
--- @field miceCollision boolean
--- @field groundCollision boolean
--- @field dynamic boolean
--- @field fixedRotation boolean
--- @field mass integer
--- @field linearDamping number
--- @field angularDamping number

--- @class ShamanObjOpt
--- @field fixedXSpeed number
--- @field fixedYSpeed number

--- @class TfmGet @Transformice metadata
--- @field misc TfmMisc
--- @field room TfmRoom
tfm.get = {}

--- Transformice system namespace
system = {}

-- Transformice user interface namespace
ui = {}

--- @class TfmExec
--- Transformice exec namespace
tfm.exec = {}
