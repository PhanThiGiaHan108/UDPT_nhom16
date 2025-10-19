import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const PaymentResultPage = () => {
  const { id } = useParams();
  const [status, setStatus] = useState("loading");
  const [info, setInfo] = useState(null);

  useEffect(() => {
    // Gọi API backend kiểm tra trạng thái thanh toán
    const fetchPaymentStatus = async () => {
      try {
        const res = await axios.get(`/api/payment/status/${id}`);
        setStatus(res.data.status || "success");
        setInfo(res.data);
      } catch (err) {
        setStatus("error");
      }
    };
    fetchPaymentStatus();
  }, [id]);

  if (status === "loading") return <div>Đang kiểm tra trạng thái thanh toán...</div>;
  if (status === "error")
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Thanh toán thất bại hoặc không tìm thấy giao dịch!</h2>
        <a href="/" style={{ color: "#007bff" }}>Quay về trang chủ</a>
      </div>
    );
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Thanh toán thành công!</h2>
      <p>Mã giao dịch: <b>{id}</b></p>
      {info && info.amount && <p>Số tiền: <b>{info.amount} VND</b></p>}
      <a href="/my-courses" style={{ color: "#007bff" }}>Vào học ngay</a>
    </div>
  );
};

export default PaymentResultPage;
