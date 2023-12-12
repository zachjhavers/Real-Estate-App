// script.js

document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
      searchButton.addEventListener('click', searchProperties);
    }
  
    const openNewsButton = document.getElementById('openNewsButton');
    if (openNewsButton) {
      openNewsButton.addEventListener('click', openNewsPage);
    }
  
    async function searchProperties() {
      const cityInput = document.getElementById('cityInput').value;
  
      try {
        const response = await fetch('/searchProperties', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ city: cityInput }),
        });
  
        const result = await response.json();
  
        // Handle the result and update the UI as needed
        updatePropertyList(result);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    }
  
    function updatePropertyList(properties) {
      const propertyList = document.getElementById('property-list');
      propertyList.innerHTML = '';
  
      if (properties.length > 0) {
        properties.forEach(property => {
          const listItem = document.createElement('li');
          listItem.className = 'property-item';
          listItem.textContent = `${property.name} in ${property.location}`;
          propertyList.appendChild(listItem);
        });
      } else {
        const noResultsItem = document.createElement('li');
        noResultsItem.textContent = 'No properties found in the selected city.';
        propertyList.appendChild(noResultsItem);
      }
    }
  
    function openNewsPage() {
      const cityInput = document.getElementById('cityInput').value;
      window.open(`/news.html?city=${encodeURIComponent(cityInput)}`, '_blank');
    }
  });
  