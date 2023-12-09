document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Collect login data
        const loginData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        };

        // Send a POST request to the server
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
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
