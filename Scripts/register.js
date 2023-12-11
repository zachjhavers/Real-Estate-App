document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
  
      const formData = {
        firstName: document.getElementById('firstName').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
      };
      
      console.log(formData);

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
          window.location.href = '/index.html'; 
        } else {
          
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    });
  });
  