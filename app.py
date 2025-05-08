from flask import Flask, render_template, request, send_from_directory
import subprocess
import os
import uuid
import json

app = Flask(__name__)
DOWNLOAD_FOLDER = "downloads"
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

def get_video_info(url):
    try:
        cmd = ["yt-dlp.exe", "--dump-json", url]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        info = json.loads(result.stdout)
        return info
    except subprocess.CalledProcessError as e:
        print("Lỗi yt-dlp:", e.stderr)
        return None

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        url = request.form["url"]
        video_info = get_video_info(url)
        if video_info:
            return render_template("select_quality.html", info=video_info, url=url)
        else:
            return "❌ Không lấy được thông tin video. Vui lòng kiểm tra link YouTube."
    return render_template("index.html")

@app.route("/download", methods=["POST"])
def download():
    url = request.form["url"]
    format_id = request.form["format_id"]
    video_id = str(uuid.uuid4())[:8]
    output_template = os.path.join(DOWNLOAD_FOLDER, f"{video_id}.%(ext)s")

    try:
        subprocess.run([
            "yt-dlp.exe", "-f", format_id, "-o", output_template, url
        ], check=True)
        for file in os.listdir(DOWNLOAD_FOLDER):
            if file.startswith(video_id):
                return render_template("success.html", filename=file)
    except subprocess.CalledProcessError as e:
        return f"Lỗi tải video: {e.stderr}"
    return "Không tìm thấy file."

@app.route("/download/<filename>")
def download_file(filename):
    return send_from_directory(DOWNLOAD_FOLDER, filename, as_attachment=True)

if __name__ == "__main__":
    app.run(port=5000)
import os

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
