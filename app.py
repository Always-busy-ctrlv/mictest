from flask import Flask, render_template, request, send_file
import os
from datetime import datetime

app = Flask(__name__)
UPLOAD_FOLDER = "recordings"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    audio = request.files['audio_data']
    filename = f"recording_{datetime.now().strftime('%Y%m%d%H%M%S')}.webm"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    audio.save(filepath)
    return {'filename': filename}, 200

@app.route('/download/<filename>')
def download(filename):
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    return send_file(filepath, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
