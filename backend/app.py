from flask import Flask, request, jsonify
from flask_cors import CORS  # Importing CORS for handling cross-origin requests
import random
import smtplib

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

otp_storage = {}

# Email setup
SERVER_EMAIL = "lrahuloff05@gmail.com"
PASSWORD = "use your pass"  # Application-specific password for Gmail
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587



# Function to send OTP email
def send_otp_email(receiver_email, OTP, name):
    body = f"Dear {name},\n\nHere is your OTP: {OTP}."
    subject = "OTP verification using python"
    message = f"Subject:{subject}\n\n{body}"

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SERVER_EMAIL, PASSWORD)
        server.sendmail(SERVER_EMAIL, receiver_email, message)
        server.quit()
        return "OTP sent successfully"
    except Exception as e:
        return f"Failed to send OTP: {str(e)}"

# Route to send OTP to user's email
@app.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")

# Generating a random OTP
    OTP = random.randint(100000, 999999)
    otp_storage[email] = OTP
    if not name or not email:
        return jsonify({"message": "Name and email are required"}), 400

    # Validate email (simplified for this example)
    if "@" not in email or "." not in email:
        return jsonify({"message": "Invalid email address"}), 400

    result = send_otp_email(email, OTP, name)
    return jsonify({"message": result, "otp": OTP})

@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get("email")
    entered_otp = data.get("otp")

    if not email or not entered_otp:
        return jsonify({"message": "Email and OTP are required"}), 400

    # Retrieve OTP from memory and compare
    stored_otp = otp_storage.get(email)

    if stored_otp == int(entered_otp):
        return jsonify({"message": "OTP verified successfully"})
    else:
        return jsonify({"message": "Invalid OTP, please try again"}), 400
    
if __name__ == "__main__":
    app.run(debug=True)
