ConstEarnes = تتطلب("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// استقبال Webhook من أموال بي
app.post("/webhook-amwal", async (req, res) => {
    console.log("📩 استلام البيانات:", req.body);

    // تحقق من حالة الدفع
    if (req.body.status === "paid") {
        console.log("✅ الدفع ناجح");

        // إرسال الفاتورة عبر EmailJS
        try {
            await axios.post("https://api.emailjs.com/api/v1.0/email/send", {
                service_id: process.env.EMAILJS_SERVICE_ID,
                template_id: process.env.EMAILJS_TEMPLATE_ID,
                user_id: process.env.EMAILJS_USER_ID,
                template_params: {
                    to_name: req.body.customer_name || "عميلنا العزيز",
                    to_email: req.body.customer_email,
                    amount: req.body.amount
                }
            });
            console.log("📧 تم إرسال الفاتورة بنجاح");
        } catch (error) {
            console.error("❌ خطأ في إرسال الفاتورة:", error.response?.data || error.message);
        }
    }

    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
