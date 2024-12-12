import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function Modal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

function App() {
  const cursorRef = useRef(null);
  const rippleRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ripple = rippleRef.current;

    const handleMouseMove = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;

      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setMessage('Please enter your name and email.');
      return;
    }

    try {
      const response = await fetch('https://otp-auth-back-jdxgjoa5u-lrahul05s-projects.vercel.app/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        setOtp('');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage('Error sending OTP. Please try again.');
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch('https://otp-auth-back-jdxgjoa5u-lrahul05s-projects.vercel.app/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        // Store JWT token after successful verification
        localStorage.setItem('authToken', data.token);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage('Error verifying OTP. Please try again.');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    window.location.reload(); // Refresh the page after successful login
  };

  return (
    <div className="App">
      <div className="cursor" ref={cursorRef}></div>
      <div className="ripple" ref={rippleRef}></div>

      <h1>OTP Verification</h1>

      <form onSubmit={sendOtp}>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </label>
        </div>
        <button type="submit">Send OTP</button>
      </form>

      {message && <p>{message}</p>}

      {message === 'OTP sent successfully' && (
        <div>
          <label>
            Enter OTP:
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
          </label>
          <button onClick={verifyOtp}>Verify OTP</button>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        message="OTP Verified Successfully. You are logged in!"
      />
    </div>
  );
}

function Main() {
  return (
    <div className="main">
      <div className="typing-container"></div>
      <div className="app-container">
        <App />
      </div>
    </div>
  );
}

export default Main;
