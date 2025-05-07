const express = require("express");
const { execFile } = require("child_process");
const path = require("path");
const app = express();

const PORT = 3000;
const YTDLP_PATH = path.join(__dirname, "yt-dlp.exe");

app.use(express.static("public"));

app.get("/info", (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "Thiếu URL" });

  execFile(YTDLP_PATH, ["-j", url], (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: "Không lấy được thông tin video" });

    const info = JSON.parse(stdout);
    const preview = info.formats.find(f => f.acodec !== "none" && f.vcodec !== "none")?.url;

    const qualities = info.formats
      .filter(f => f.vcodec !== "none")
      .map(f => ({
        format_id: f.format_id,
        ext: f.ext,
        resolution: f.resolution,
        format_note: f.format_note || "",
      }));

    res.json({
      title: info.title,
      author: info.uploader,
      duration: `${Math.floor(info.duration / 60)} phút`,
      thumbnail: info.thumbnail,
      preview: preview || "",
      qualities
    });
  });
});

app.get("/download", (req, res) => {
  const url = req.query.url;
  const format = req.query.format;
  if (!url || !format) return res.status(400).send("Thiếu URL hoặc format");

  res.setHeader("Content-Disposition", `attachment; filename="video.mp4"`);

  const ytdlp = execFile(YTDLP_PATH, [
    "-f", format,
    "-o", "-",
    url
  ]);

  ytdlp.stdout.pipe(res);
  ytdlp.stderr.on("data", (data) => console.error("yt-dlp error:", data.toString()));
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
const { exec } = require('child_process');

app.get('/download', (req, res) => {
    const videoUrl = req.query.url; // URL video mà người dùng nhập

    exec(`yt-dlp ${videoUrl}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(`Error: ${error.message}`);
        }
        if (stderr) {
            return res.status(500).send(`stderr: ${stderr}`);
        }
        res.send(`Download complete: ${stdout}`);
    });
});
