from flask import Flask, request, jsonify
from flask_socketio import SocketIO, send, join_room, leave_room

app = Flask(__name__)
app.config['SECRET_KEY'] = 'b9a0d18fce894e4c9f09cda5b5c4eccc3c528e74ea3a90f2'
socketio = SocketIO(app, cors_allowed_origins="*")

users = {}

@socketio.on('connect')
def handle_connect():
    print("A user connected")

@socketio.on('disconnect')
def handle_disconnect():
    print("A user disconnected")

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    users[username] = room
    send(f"{username} has joined the room {room}", to=room)

@socketio.on('message')
def handle_message(data):
    room = users.get(data['sender'])
    send(data['message'], to=room)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
