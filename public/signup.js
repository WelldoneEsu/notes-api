const API ='http://localhost:5000';

        document.getElementById('signup-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch(`${API}/api/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, password })
                });

                const data = await res.json();
                document.getElementById('response-message').textContent = data.msg;

                if (res.ok) {
                    document.getElementById('signup-form').classList.add('hidden');
                    document.getElementById('otp-section').classList.remove('hidden');
                }
            } catch (err) {
                console.error('Signup error:', err);
                document.getElementById('response-message').textContent = 'An error occurred. Please try again.';
            }
        });

        document.getElementById('otp-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const otp = document.getElementById('otp').value;

            try {
                const res = await fetch(`${API}/api/auth/verify-email-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp })
                });

                const data = await res.json();
                document.getElementById('response-message').textContent = data.msg;

                if (res.ok) {
                    window.location.href = 'login.html'; // Redirect to login page
                }
            } catch (err) {
                console.error('OTP verification error:', err);
                document.getElementById('response-message').textContent = 'An error occurred. Please try again.';
            }
        });
  