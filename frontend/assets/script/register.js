document.getElementById('registration-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('http://localhost:4000/api/register', {  // Corrected URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      // Check if response is OK (status 200-299)
      if (!response.ok) {
        const errorData = await response.json();
        Swal.fire('Error', errorData.message, 'error');
        return;
      }

      // If response is OK, handle the success response
      const data = await response.json();
      Swal.fire('Success', data.message || 'Registration successful!', 'success');
    } catch (error) {
      console.error('Error during registration:', error);
      Swal.fire('Error', 'Something went wrong, please try again.', 'error');
    }
});