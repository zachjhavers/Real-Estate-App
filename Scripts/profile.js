document.addEventListener('DOMContentLoaded', function() {
    fetch('/user-info')
    .then(response => response.json())
    .then(data => {
        document.getElementById('userName').textContent = data.firstName;
        document.getElementById('userUsername').textContent = data.username;

        if(data.profilePicUrl) {
            document.getElementById('profilePicDisplay').src = data.profilePicUrl;
        } else {
            document.getElementById('profilePicDisplay').alt = 'No profile picture';
        }
        if (data.properties && data.properties.length > 0) {
            data.properties.forEach(property => addPropertyToTable(property));
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('profilePicForm').addEventListener('submit', function(e) {
    e.preventDefault();

    var formData = new FormData();
    var fileField = document.getElementById('profilePic');

    formData.append('profilePic', fileField.files[0]);

    fetch('/upload-profile-pic', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        if (data.success) {
            window.location.reload();
        } else {
            console.error('Error:', data.message);
            alert('Failed to upload profile picture: ' + data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

document.getElementById('addPropertyForm').addEventListener('submit', function(e) {
    e.preventDefault();

    var formData = new FormData();
    formData.append('name', document.getElementById('propertyName').value);
    formData.append('location', document.getElementById('propertyLocation').value);
    formData.append('propertyImage', document.getElementById('propertyImage').files[0]);

    fetch('/add-property', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Property added:', data.message);

            document.getElementById('propertyName').value = '';
            document.getElementById('propertyLocation').value = '';
            document.getElementById('propertyImage').value = '';

            addPropertyToTable(data.property);

            window.location.reload();
        } else {
            console.error('Failed to add property:', data.message);
            alert('Failed to add property: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while adding the property.');
    });
});

function addPropertyToTable(property) {
    const table = document.getElementById('propertiesTable');
    const row = table.insertRow(-1); 

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);

    cell1.textContent = property.name;
    cell2.textContent = property.location;

    const image = document.createElement('img');
    image.src = property.imageUrl;
    image.alt = 'Property Image';
    image.style.maxWidth = '100px'; 
    cell3.appendChild(image);
}

document.getElementById('logoutLink').addEventListener('click', function(e) {
    e.preventDefault();

    fetch('/logout', { method: 'POST' })
    .then(response => {
        if (response.ok) {
            window.location.href = '/index.html'; 
        }
    })
    .catch(error => console.error('Error:', error));
});

