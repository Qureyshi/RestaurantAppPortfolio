import requests

# API endpoint for creating users
url = "http://localhost:8000/auth/users/"  # Replace with your actual API URL

# List of users to add
users = [
    {"username": "Adrian", "email": "adrian@rms.com", "password": "rms@adr!"},
    {"username": "Mario", "email": "mario@rms.com", "password": "rms@mar!"},
    {"username": "Sana", "email": "sana@rms.com", "password": "rms#san!"},
    {"username": "Fakhri", "email": "fakhri@rms.com", "password": "rms@fax!"},
    {"username": "Khayyam", "email": "khayyam@rms.com", "password": "rms@khm!"},
    {"username": "Aytaj", "email": "aytaj@rms.com", "password": "rms@ayt!"},
    {"username": "Kamran", "email": "kamran@rms.com", "password": "rms@kam!"},
    {"username": "John", "email": "john@rms.com", "password": "rms#jhn!"}
]

# Add users via the API
for user in users:
    response = requests.post(url, data=user)
    
    if response.status_code == 201:
        print(f"User {user['username']} added successfully.")
    else:
        print(f"Failed to add user {user['username']}: {response.status_code}, {response.text}")