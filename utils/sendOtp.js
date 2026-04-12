const axios = require("axios");

const sendOtp = async (phone, otp) => {

  try {

    await axios.get(
      `https://control.msg91.com/api/v5/otp?template_id=YOUR_TEMPLATE_ID&mobile=91${phone}&otp=${otp}&authkey=YOUR_AUTH_KEY`
    );

    console.log("OTP sent successfully");

  } catch (error) {

    console.log("SMS sending failed");

  }

};

module.exports = sendOtp;