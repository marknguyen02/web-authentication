# Sử dụng Node.js làm base image
FROM node:18.20.6

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy toàn bộ source code vào container
COPY . .

# Cài đặt dependencies
RUN npm install

# Mở cổng 5173 (cổng mặc định của Vite)
EXPOSE 5173

# Chạy ứng dụng React ở chế độ development
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
