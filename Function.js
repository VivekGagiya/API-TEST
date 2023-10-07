 const loginForm = document.getElementById('login-form');
  const loginEmailInput = document.getElementById('login-email');
  const loginError = document.getElementById('login-error');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = loginEmailInput.value;

    try {
      const response = await fetch('/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.status === 200) {
        // Email exists, you can proceed with login logic here
        // For example, redirect to the profile page
        window.location.href = "./profile.html";
      } else {
        // Email does not exist, display an error message
        loginError.textContent = 'Email does not exist';
      }
    } catch (error) {
      console.error('Error checking email:', error);
      loginError.textContent = 'An error occurred while checking email';
    }
  });
