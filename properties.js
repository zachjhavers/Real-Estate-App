document.addEventListener('DOMContentLoaded', function() {
    fetch('/user-properties') 
    .then(response => response.json())
    .then(properties => {
        properties.forEach(property => addPropertyToTable(property));
    })
    .catch(error => console.error('Error:', error));
});

function addPropertyToTable(property) {
    const table = document.getElementById('userPropertiesTable');
    const row = table.insertRow();

    // Name
    const cellName = row.insertCell();
    cellName.textContent = property.name;

    // Location
    const cellLocation = row.insertCell();
    cellLocation.textContent = property.location;

    // Price 
    const cellPrice = row.insertCell();
    cellPrice.textContent = property.price;

    // Time on Market 
    const cellTimeOnMarket = row.insertCell();
    cellTimeOnMarket.textContent = property.timeOnMarket;

    // Agent's Name 
    const cellAgentName = row.insertCell();
    cellAgentName.textContent = property.agentName;

    // Picture
    const cellImage = row.insertCell();
    const image = document.createElement('img');
    image.src = property.imageUrl;
    image.alt = 'Property Image';
    image.style.maxWidth = '100px';
    cellImage.appendChild(image);

    // Edit button
    const editCell = row.insertCell();
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = () => showEditForm(property);
    editCell.appendChild(editButton);
}


function showEditForm(property) {

    document.getElementById('editPropertyName').value = property.name;
    document.getElementById('editPropertyLocation').value = property.location;
    document.getElementById('editPropertyForm').style.display = 'block';

    document.getElementById('editProperty').onsubmit = (e) => {
        e.preventDefault();
        submitEditForm(property._id);
    };
}

function submitEditForm(propertyId) {

    const updatedProperty = {
        name: document.getElementById('editPropertyName').value,
        location: document.getElementById('editPropertyLocation').value,
        price: document.getElementById('editPropertyPrice').value, 
        timeOnMarket: document.getElementById('editPropertyTimeOnMarket').value, 
        agentName: document.getElementById('editPropertyAgentName').value 
    };

    fetch('/update-property/' + propertyId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProperty),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('editPropertyForm').style.display = 'none';
            window.location.reload();
        } else {
            alert('Failed to update property: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
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