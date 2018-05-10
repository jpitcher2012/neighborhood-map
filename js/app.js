const DEFAULT_ICON = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
const SELECTED_ICON = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';

const FOURSQUARE_CLIENT_ID = 'QQ32DIVAGGVPTS0FE3RORZLHFZIMS0PG1K2U2E24UHVTNFPG';
const FOURSQUARE_CLIENT_SECRET = '4123VMENZP21PSU42AUGS4PJISYEVWUCAOUVQMP45HHMWFPT';

// Initialize the map
function initMap() {
  vm.map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 38.7881062, lng: -90.4974359},
    zoom: 12
  });

  vm.bounds = new google.maps.LatLngBounds();
  vm.largeInfoWindow = new google.maps.InfoWindow();

  // Add markers for all the locations
  vm.allLocations().forEach(function(location){
    let marker = new google.maps.Marker({
      position: location.position(),
      title: location.title(),
      animation: google.maps.Animation.DROP,
      icon: DEFAULT_ICON,
      id: location.id()
    });
    marker.setMap(vm.map);

    // Add a listener for when the marker is clicked
    marker.addListener('click', function() {

      // Open the info window with details on the location
      populateInfoWindow(marker, vm.largeInfoWindow);

      // Update the selected location and update the icon to blue
      if (vm.selectedLocation() !== location) {
        vm.selectLocation(location);
      }
      clearSelectedIcons();
      marker.setIcon(SELECTED_ICON);

      // Zoom in and center on the location
      vm.map.setCenter(marker.position);
      vm.map.setZoom(13);
    });

    // Link the marker to the associated location
    location.marker = marker;

    // Extend the bounds to include this location
    vm.bounds.extend(marker.position);
  });

  // Update the map bounds to fit all the locations
  vm.map.fitBounds(vm.bounds);
}

// Reset the icons to the default (red)
function clearSelectedIcons() {
  vm.allLocations().forEach(function(location){
    location.marker.setIcon(DEFAULT_ICON);
  });
}

// Open the info window with details on the given location
function populateInfoWindow(marker, infowindow) {
  if (infowindow.marker != marker) {
    infowindow.marker = marker;

    // Get the info from Foursquare
    getInfo(marker, infowindow);

    // Display the location title in case the info can't be retrieved from Foursquare
    infowindow.setContent('<h2>' + marker.title + '</h2>');

    // Add a listener for when the info window is closed
    infowindow.addListener('closeclick', function() {

      // Remove the marker and clear the selected location
      infowindow.marker = null;
      if (vm.selectedLocation()) {
        vm.selectLocation();
      }

      // Update the icons to red and zoom out to fit the locations
      clearSelectedIcons();
      vm.map.fitBounds(vm.bounds);
    });

    infowindow.open(vm.map, marker);
  }
}

// Get the location info from Foursquare
function getInfo(marker, infowindow) {
  $.ajax({
    url: 'https://api.foursquare.com/v2/venues/' + marker.id +
      '?client_id=' + FOURSQUARE_CLIENT_ID +
      '&client_secret=' + FOURSQUARE_CLIENT_SECRET +
      '&v=20130815',
    success: function(result) {
      let venue = result.response.venue;
      let innerHTML = '<div>';

      // Display the name, location, phone number, and rating (if available)
      if (venue.name) {
        innerHTML += '<h2>' + venue.name + '</h2>';
      }
      if (venue.location.address && venue.location.city) {
        innerHTML += '<p>' + venue.location.address + ', ' + venue.location.city + '</p>';
      }
      if (venue.contact.formattedPhone) {
        innerHTML += '<p>' + venue.contact.formattedPhone + '</p>';
      }
      if (venue.rating) {
        innerHTML += '<br/><strong>Rating: ' + venue.rating + '/10</strong>';
      }

      // Add reviews, up to 3
      if (venue.tips && venue.tips.count > 0) {
        let count = venue.tips.count;
        if (count > 3) {
          count = 3;
        }
        innerHTML += '<ul class = "reviews">';
        for (let i=0; i<count; i++) {
          innerHTML += '<li>' + venue.tips.groups[0].items[i].text + '</li>';
        }
        innerHTML += '</ul>';
      }
      innerHTML += '</div>';

      infowindow.setContent(innerHTML);
    },
    error: function() {
      handleError();
    }
  });
}

// Update the map when the screen resizes
$(window).resize(function() {

  // If a location is selected, re-center it on the map and refresh the info window
  if (vm.selectedLocation()) {
    vm.map.setCenter(vm.selectedLocation().marker.position);
    vm.largeInfoWindow.setContent(vm.largeInfoWindow.getContent());
  }
  // Otherwise, fit the map to the bounds of the locations
  else {
    vm.map.fitBounds(vm.bounds);
  }
});

// Alert the user if an error occurred
function handleError() {
	alert('An error occurred. Please try again later.');
}
