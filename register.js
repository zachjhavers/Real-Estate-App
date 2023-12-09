document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
  
      // Collect form data
      const formData = {
        firstName: document.getElementById('firstName').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
      };
      
      console.log(formData);

      // Send a POST request to the server
      fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Handle success 
        } else {
          // Handle failure 
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    });
  });
  