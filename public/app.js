async function getInfo() {
    const url = document.getElementById("ytLink").value;
    if (!url) {
      Swal.fire("Lỗi", "Bạn cần nhập URL video!", "warning");
      return;
    }
  
    Swal.fire({ title: "Đang tải...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
  
    try {
      const res = await fetch(`/info?url=${encodeURIComponent(url)}`);
      const data = await res.json();
  
      if (data.error) throw new Error(data.error);
  
      document.getElementById("thumbnail").src = data.thumbnail;
      document.getElementById("title").textContent = data.title;
      document.getElementById("author").textContent = "Kênh: " + data.author;
      document.getElementById("duration").textContent = "Thời lượng: " + data.duration;
      document.getElementById("preview").src = data.preview;
  
      const select = document.getElementById("quality");
      select.innerHTML = "";
      data.qualities.forEach(q => {
        const option = document.createElement("option");
        option.value = q.format_id;
        option.textContent = `${q.format_note} - ${q.ext} - ${q.resolution}`;
        select.appendChild(option);
      });
  
      const downloadBtn = document.getElementById("download");
      downloadBtn.href = `/download?url=${encodeURIComponent(url)}&format=${select.value}`;
      downloadBtn.onclick = (e) => {
        e.preventDefault();
        Swal.fire("Bắt đầu tải", "Nếu trình duyệt không tải, kiểm tra lại popup", "info");
        window.location.href = `/download?url=${encodeURIComponent(url)}&format=${select.value}`;
      };
  
      document.getElementById("info").classList.remove("hidden");
      Swal.close();
    } catch (err) {
      Swal.fire("Lỗi", "Không lấy được thông tin video!", "error");
    }
  }
  