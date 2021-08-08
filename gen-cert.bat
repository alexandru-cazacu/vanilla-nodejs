@ECHO OFF
IF NOT EXIST https MKDIR https
CALL openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem