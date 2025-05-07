# Sử dụng image Node.js chính thức
FROM node:16

# Cài đặt yt-dlp (công cụ tải video)
RUN apt-get update && apt-get install -y yt-dlp

# Tạo thư mục làm việc
WORKDIR /app

# Copy mã nguồn vào container
COPY . /app

# Cài đặt các dependencies của ứng dụng
RUN npm install

# Cổng mà ứng dụng sẽ lắng nghe
EXPOSE 3000

# Chạy ứng dụng khi container được khởi động
CMD ["node", "index.js"]
