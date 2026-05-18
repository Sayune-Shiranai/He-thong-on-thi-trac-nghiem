# Sayune-Novel
Hệ thống ôn thi trắc nghiệm


## Công nghệ sử dụng
### Frontend (React)

### Backend (Express)

### 1.Cài đặt các gói phụ thuộc 
```bash
cd backend
npm install
```

### 2.Cấu hình cho Sequelize CLI kết nối sql server
### Tạo file .env
```bash
cp .env.example .env
Sau đó mở file .env và chỉnh sửa thông tin phù hợp với môi trường
```

### 3.Chạy Sequelize CLI
### Tạo database
```bash
npx sequelize-cli db:create
```

### Tạo tất cả table
```bash
npx sequelize-cli db:migrate
```

### Tạo tất cả seeders ( Tạo tất cả dữ liệu mẫu nếu cần )
```bash

```

### 4.Chạy server
```bash
node backend/server.js
```

