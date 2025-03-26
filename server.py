from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import mysql.connector
import bcrypt
from mysql.connector import Error
from flask_cors import CORS
from transformers import pipeline
import traceback
from flask_mail import Mail, Message
from datetime import timedelta
import random
import string

# Initialize Flask app and JWT
app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = 'ab#123Uty'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=2)
jwt = JWTManager(app)

# Email Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'ur email'
app.config['MAIL_PASSWORD'] = 'set app password'
app.config['MAIL_DEFAULT_SENDER'] = 'email'

mail = Mail(app)

# MySQL Database connection function
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="ur password",
            database="ur database name"
        )
        print("Database Connected Successfully!")
        return connection
    except Error as e:
        print("Database Connection Failed:", str(e))
        return None

# User Registration Endpoint
@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"msg": "Missing fields"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    connection = get_db_connection()
    if not connection:
        return jsonify({"msg": "Database connection failed"}), 500

    cursor = connection.cursor()
    try:
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify({"msg": "User with this email already exists"}), 400

        cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
                       (username, email, hashed_password.decode('utf-8')))
        connection.commit()

        return jsonify({"msg": "User registered successfully!"}), 201
    except Error as e:
        print("MySQL Error:", str(e))
        return jsonify({"msg": "Database error", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# User Login Endpoint
@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "Missing fields"}), 400

    connection = get_db_connection()
    if not connection:
        return jsonify({"msg": "Database connection failed"}), 500

    cursor = connection.cursor()
    try:
        cursor.execute("SELECT email, password FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"msg": "User does not exist"}), 401

        stored_hashed_password = user[1].encode('utf-8')

        if bcrypt.checkpw(password.encode('utf-8'), stored_hashed_password):
            access_token = create_access_token(identity=user[0])
            return jsonify(access_token=access_token), 200
        else:
            return jsonify({"msg": "Invalid credentials"}), 401
    except Exception as e:
        print("Login Error:")
        traceback.print_exc()
        return jsonify({"msg": "Internal Server Error", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# Load the summarizer model
summarizer = pipeline("summarization", model="t5-small")

# Function to send email
def send_email(recipient, summary, meet_id):
    try:
        msg = Message("Your Generated Summary", recipients=[recipient])
        msg.body = f"Meeting ID: {meet_id}\n\nGenerated Summary:\n{summary}"
        mail.send(msg)
        print(f"Email sent successfully to {recipient}")
    except Exception as e:
        print("Error sending email:", str(e))

# Function to generate a random Meet ID
def generate_meet_id():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

# Summary Generation Endpoint
@app.route('/get_summary', methods=['POST'])
@jwt_required()
def get_summary():
    data = request.get_json()
    text = data.get('text')
    summary_type = data.get('type')
    meet_id = data.get('meeting_id')  # Get meeting_id from request

    user_email = get_jwt_identity()  # Get email from JWT token

    if not text:
        return jsonify({"msg": "Text is required"}), 400

    # If no meet_id is provided (empty or None), generate one automatically
    if not meet_id or meet_id.strip() == "":
        meet_id = generate_meet_id()  # Generate random Meet ID

    try:
        if summary_type == 'extractive':
            summary = text[:int(len(text) * 0.3)] + '...'
        else:
            summary = summarizer(text, max_length=130, min_length=30, do_sample=False)[0]['summary_text']

        # Insert summary into the database
        connection = get_db_connection()
        if not connection:
            return jsonify({"msg": "Failed to connect to database"}), 500

        cursor = connection.cursor()
        cursor.execute("INSERT INTO summaries (meet_id, ptext, summary) VALUES (%s, %s, %s)", (meet_id, text, summary))
        connection.commit()

        # Send the generated summary to the user's registered email
        send_email(user_email, summary, meet_id)

        return jsonify({
            "msg": "Summary generated successfully and emailed",
            "summary": summary,
            "meeting_id": meet_id  # Return the Meet ID (auto or manual)
        }), 200
    except Exception as e:
        print("Error generating summary:")
        traceback.print_exc()
        return jsonify({"msg": "Failed to generate summary", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

# Protected Home Page Route
@app.route('/home', methods=['GET'])
@jwt_required()
def home():
    user_email = get_jwt_identity()  # Get the logged-in user's email
    return jsonify({"msg": f"Welcome, {user_email}! You are authenticated."}), 200

if __name__ == '__main__':
    app.run(debug=True)
