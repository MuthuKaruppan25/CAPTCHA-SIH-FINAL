import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { loadCaptchaEnginge, LoadCanvasTemplate, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';
import { useState, useRef, useEffect } from "react";

const Checkbox = () => {
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const canvasRef = useRef(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    // Load the CAPTCHA engine or other required initialization
    loadCaptchaEnginge(6);

    const canvas = document.querySelector("canvas");

    if (canvas) {
      var originalToDataURL = canvas.toDataURL;

      canvas.toDataURL = function (...args) {
        console.log("Canvas toDataURL intercepted!");
        console.log("Arguments passed:", args);

        // Capture the event but don't alert or block the bot
        console.log("Bot action detected on canvas.");

        // Call the original toDataURL method
        return originalToDataURL.apply(this, args);
      };

      // Track other interaction events if needed
      canvas.addEventListener("click", () => {
        console.log("Canvas clicked!");
      });

      // Optionally capture interactions such as mouse movements, key presses, etc.
      canvas.addEventListener("mousemove", (event) => {
        console.log("Mouse moved over canvas at coordinates:", event.clientX, event.clientY);
      });
    }

    return () => {
      if (canvas) {
        // Restore the original toDataURL method
        if (canvas.toDataURL) {
          canvas.toDataURL = originalToDataURL;
        }
      }
    };
  }, []);

  const handleCaptchaChange = (value) => {
    if (value) {
      setCaptchaVerified(true);
    }
  };

  const verifyCaptcha = () => {
    if (validateCaptcha(value) === true) {
      console.log("Captcha verified successfully!");
    } else {
      console.log("Captcha verification failed.");
    }
  };

  return (
    <div>
      <div>
        <ReCAPTCHA
          sitekey="6LdYFjsqAAAAAPwavwdGH-YV7Hw1kOqdBT_GFJJI"
          onChange={handleCaptchaChange}
        />
        {captchaVerified && <p>Captcha verified! You can proceed.</p>}
      </div>
      <div className="m-5">
        <LoadCanvasTemplate />
        <div className="border border-slate-500 m-3 rounded-md">
          <input
            type="text"
            name="field7"
            className="w-full h-full p-3"
            placeholder="Enter CAPTCHA"
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <button
          style={{
            background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
          }}
          onClick={verifyCaptcha}
          className="sub w-20 text-white p-2 px-3 m-2 rounded-lg"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Checkbox;
