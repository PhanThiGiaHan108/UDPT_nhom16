# 🎯 Hướng Dẫn Cấu Hình PayOS cho Payment Service

## 📋 Tổng Quan

Payment Service đã được cấu hình để sử dụng PayOS làm cổng thanh toán chính. Hệ thống hỗ trợ:

✅ **Thanh toán tự động 100%** - Không cần xác nhận thủ công  
✅ **Webhook real-time** - Nhận thông báo thanh toán ngay lập tức  
✅ **Auto-enrollment** - Tự động mở khóa học sau khi thanh toán thành công  
✅ **Secure** - Xác thực JWT, signature verification

---

## 1. Cấu Hình Backend

### 1.1. Cài Đặt Dependencies

```bash
cd d:\EduLearn1\EduLearn\Backend\payment-service
npm install
```

### 1.2. Cấu Hình Environment Variables (.env)

Tạo file `.env` trong `payment-service/` với nội dung:

```env
# Server Configuration
PORT=5004
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/edulearn

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production

# PayOS Configuration (Lấy từ https://payos.vn)
PAYOS_CLIENT_ID=your-client-id-here
PAYOS_API_KEY=your-api-key-here
PAYOS_CHECKSUM_KEY=your-checksum-key-here
```

### 1.3. Lấy Thông Tin PayOS

1. Đăng ký tài khoản tại: https://payos.vn
2. Đăng nhập vào Dashboard
3. Vào mục **Thông tin tích hợp**
4. Copy các thông tin sau:
   - **Client ID** → `PAYOS_CLIENT_ID`
   - **API Key** → `PAYOS_API_KEY`
   - **Checksum Key** → `PAYOS_CHECKSUM_KEY`

### 1.4. Khởi Động Service

```bash
cd d:\EduLearn1\EduLearn\Backend\payment-service
npm run dev
```

Service sẽ chạy tại: `http://localhost:5004`

---

## 2. API Endpoints

### 2.1. Tạo Link Thanh Toán

```http
POST http://localhost:5004/api/payment/payos/create
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "courseId": "course_id_here",
  "amount": 500000
}
```

**Response:**

```json
{
  "success": true,
  "paymentId": "payment_id",
  "transactionId": "TXN1234567890ABC",
  "checkoutUrl": "https://pay.payos.vn/...",
  "qrCode": "https://api-merchant.payos.vn/...",
  "amount": 500000,
  "orderCode": 1234567890,
  "description": "TXN1234567890ABC",
  "expiresAt": "2025-10-21T00:00:00.000Z",
  "courseTitle": "Khóa học React"
}
```

### 2.2. Kiểm Tra Trạng Thái Thanh Toán

```http
GET http://localhost:5004/api/payment/payos/status?orderCode=1234567890
```

### 2.3. Webhook (Tự Động)

```http
POST http://localhost:5004/api/payment/webhook/payos
Content-Type: application/json
x-checksum: <signature>

{
  "code": "00",
  "desc": "success",
  "data": {
    "orderCode": 1234567890,
    "amount": 500000,
    "description": "TXN1234567890ABC",
    "status": "PAID"
  }
}
```

---

## 3. Frontend Integration

### 3.1. Các Trang Đã Có Frontend

✅ **PayOSPayment.jsx** - Trang thanh toán PayOS (đã có sẵn)  
✅ **PaymentSuccess.jsx** - Trang thanh toán thành công (đã có sẵn)  
✅ **PaymentCancel.jsx** - Trang hủy thanh toán (đã có sẵn)  
✅ **PaymentPage.jsx** - Trang chọn phương thức thanh toán (đã có sẵn)

### 3.2. Cấu Hình API_URL

File: `Frontend/src/config/index.js`

```javascript
export const API_URL = "http://localhost:5004/api";
```

### 3.3. Luồng Thanh Toán

1. User chọn khóa học → Click "Thanh toán"
2. `PaymentPage.jsx` kiểm tra:
   - Nếu khóa học **miễn phí** → Đăng ký trực tiếp
   - Nếu khóa học **có phí** → Chuyển đến `/payos-payment/:courseId`
3. `PayOSPayment.jsx`:
   - Call API `POST /api/payment/payos/create`
   - Nhận `checkoutUrl`
   - Redirect user đến PayOS payment page
4. User thanh toán trên PayOS
5. PayOS gửi webhook về backend
6. Backend xử lý webhook:
   - Cập nhật payment status = "success"
   - Tạo enrollment
   - Tăng số lượng học viên
7. PayOS redirect user về:
   - **Success**: `/payment-success?paymentId=xxx`
   - **Cancel**: `/payment-cancel?paymentId=xxx`

---

## 4. Webhook Setup (Production)

### 4.1. Sử Dụng ngrok (Development)

```bash
# Cài đặt ngrok
# Download từ: https://ngrok.com/download

# Chạy ngrok
ngrok http 5004
```

Ngrok sẽ tạo URL công khai, ví dụ: `https://abc123.ngrok.io`

### 4.2. Cấu Hình Webhook URL trên PayOS

1. Đăng nhập PayOS Dashboard
2. Vào **Cài đặt** → **Webhook URL**
3. Nhập URL: `https://abc123.ngrok.io/api/payment/webhook/payos`
4. Lưu lại

### 4.3. Test Webhook

PayOS Dashboard có tính năng **Test Webhook** để test ngay.

---

## 5. Database Models

### 5.1. Payment Schema

```javascript
{
  userId: ObjectId,
  courseId: ObjectId,
  amount: Number,
  paymentMethod: "payos",
  status: "pending" | "success" | "failed" | "cancelled",
  transactionId: String (unique),
  paymentDetails: {
    orderCode: String,
    paymentLinkId: String
  },
  paidAt: Date,
  expiresAt: Date,
  note: String,
  paidAmount: Number,
  refundAmount: Number
}
```

### 5.2. Enrollment Schema

```javascript
{
  userId: ObjectId,
  courseId: ObjectId,
  enrolledAt: Date,
  progress: Number (0-100),
  completed: Boolean,
  completedLessons: [ObjectId],
  completedQuizzes: [ObjectId]
}
```

---

## 6. Testing

### 6.1. Test Tạo Payment

```bash
# Lấy JWT token từ login
curl -X POST http://localhost:5004/api/payment/payos/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "COURSE_ID",
    "amount": 500000
  }'
```

### 6.2. Test Webhook (Manual)

```bash
curl -X POST http://localhost:5004/api/payment/webhook/payos \
  -H "Content-Type: application/json" \
  -d '{
    "code": "00",
    "desc": "success",
    "data": {
      "orderCode": 1234567890,
      "amount": 500000,
      "description": "TXN1234567890ABC",
      "status": "PAID"
    }
  }'
```

---

## 7. Troubleshooting

### Lỗi: "PayOS chưa được cấu hình"

✅ Kiểm tra file `.env` có đúng các biến:

- `PAYOS_CLIENT_ID`
- `PAYOS_API_KEY`
- `PAYOS_CHECKSUM_KEY`

### Lỗi: "MongoDB connection error"

✅ Kiểm tra MongoDB đang chạy:

```bash
# Windows
net start MongoDB

# hoặc
mongod
```

### Lỗi: "Không tìm thấy khóa học"

✅ Kiểm tra `course-service` đang chạy tại port 5002

### Webhook không nhận được

✅ Kiểm tra:

1. ngrok đang chạy
2. Webhook URL trên PayOS Dashboard đúng
3. Payment service đang chạy

---

## 8. Architecture

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────────┐     POST /payos/create     ┌──────────────────┐
│  PaymentPage    │ ─────────────────────────► │ Payment Service  │
│   (Frontend)    │ ◄───────────────────────── │   (Backend)      │
└─────────────────┘    Return checkout URL     └────────┬─────────┘
       │                                               │
       │ Redirect                                      │ Save Payment
       ▼                                               ▼
┌─────────────────┐                              ┌──────────────────┐
│  PayOS Page     │                              │    MongoDB       │
│  (External)     │                              └──────────────────┘
└────────┬────────┘
         │
         │ User Pay
         ▼
┌─────────────────┐     POST /webhook/payos    ┌──────────────────┐
│  PayOS Server   │ ─────────────────────────► │ Payment Service  │
│                 │                             │   (Backend)      │
└─────────────────┘                             └────────┬─────────┘
         │                                              │
         │ Redirect                                     │ Create Enrollment
         ▼                                              ▼
┌─────────────────┐                              ┌──────────────────┐
│ PaymentSuccess  │                              │  Enroll Service  │
│   (Frontend)    │                              │ Course Service   │
└─────────────────┘                              └──────────────────┘
```

---

## 9. Security Notes

🔒 **JWT Token**: Tất cả API calls phải có JWT token hợp lệ  
🔒 **Signature Verification**: Webhook được verify bằng HMAC-SHA256  
🔒 **HTTPS**: Production phải dùng HTTPS cho webhook  
🔒 **Environment Variables**: Không commit file `.env` lên Git

---

## 10. Next Steps

1. ✅ Cấu hình `.env` với thông tin PayOS
2. ✅ Khởi động MongoDB
3. ✅ Khởi động các services (auth, course, payment)
4. ✅ Test tạo payment qua Frontend
5. ✅ Setup ngrok và cấu hình webhook
6. ✅ Test thanh toán end-to-end

---

**🎉 Chúc bạn triển khai thành công!**
