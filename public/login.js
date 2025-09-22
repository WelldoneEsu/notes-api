        const API ='http://localhost:5000';

        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch(`${API}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                document.getElementById('response-message').textContent = data.msg || 'Login successful!';

                if (res.ok && data.token) {
                    localStorage.setItem('token', data.token);
                    window.location.href = 'notes.html'; // Redirect to a protected route
                }
            } catch (err) {
                console.error('Login error:', err);
                document.getElementById('response-message').textContent = 'An error occurred. Please try again.';
            }
        });