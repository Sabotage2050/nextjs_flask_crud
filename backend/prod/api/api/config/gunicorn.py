import os

# UNIXドメインソケット
socket_path = "unix:/tmp/gunicorn_socket/gunicorn.sock"
# TCPソケット
# socket_path = "0.0.0.0:" + str(os.getenv("PORT", 8080))
bind = socket_path

# Debugging
# reload = True

# Logging
# accesslog = '-'
# loglevel = 'info'
# loglevel = 'debug'
# logfile = './log/app.log'
# logconfig = None

# Proc Name
# proc_name = 'Infrastructure-Practice-Flask'

# Worker Processes
workers = 2
# worker_class = 'sync'
