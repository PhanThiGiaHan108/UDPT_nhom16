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

        if (res.data.success) {
          setStatus(res.data.status || "success");
          setInfo(res.data);
        } else {
          setStatus("error");
          setInfo(res.data);
        }
      } catch (err) {
        console.error("Payment status error:", err);
        setStatus("error");
        setInfo(err.response?.data);
      }
    };

    if (id) {
      fetchPaymentStatus();
    }
  }, [id]);

  if (status === "loading")
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Đang kiểm tra trạng thái thanh toán...</h2>
      </div>
    );

  if (status === "error" || status === "not_found")
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>❌ Thanh toán thất bại hoặc không tìm thấy giao dịch!</h2>
        <p>{info?.message || "Vui lòng kiểm tra lại mã giao dịch."}</p>
        <a
          href="/"
          style={{
            color: "#007bff",
            marginTop: "20px",
            display: "inline-block",
          }}
        >
          Quay về trang chủ
        </a>
      </div>
    );
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Thanh toán thành công!</h2>
      <p>
        Mã giao dịch: <b>{id}</b>
      </p>
      {info && info.amount && (
        <p>
          Số tiền: <b>{info.amount} VND</b>
        </p>
      )}
      <a href="/my-courses" style={{ color: "#007bff" }}>
        Vào học ngay
      </a>
    </div>
  );
};

export default PaymentResultPage;
