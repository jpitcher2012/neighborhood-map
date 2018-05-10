/* global $, google, ko, locations */

let Location = function(data) {
  this.title = ko.observable(data.title);
  this.position = ko.observable(data.position);
  this.visible = ko.observable(data.visible);
  this.id = ko.observable(data.id);
  this.marker = null;
}

let ViewModel = function() {
  let self = this;

  // For manipulating the map
  this.map;
  this.bounds;
  this.largeInfoWindow;

  // All the locations from the model
  this.allLocations = ko.observableArray([]);
  locations.forEach(function(location){
    self.allLocations.push(new Location(location));
  });

  // The locations that should be visible (based on the filter)
  this.visibleLocations = ko.computed(function(){
    return ko.utils.arrayFilter(self.allLocations(), function(location) {
        return location.visible();
    });
  });

  // The currently selected location (displaying the info window)
  this.selectedLocation = ko.observable();

  this.selectLocation = function(location) {
    self.selectedLocation(location);

    // If a location was selected, also click the associated marker
    if (location && location.marker) {
      google.maps.event.trigger(location.marker, 'click');

      // For small screens, close the sidebar
      if ($(window).width() <= 450 && $('#sidebar-content').is(':visible')) {
        self.toggleSidebar();
      }
    }
    // If no location is selected, close the info window
    else {
      self.largeInfoWindow.close();
      google.maps.event.trigger(self.largeInfoWindow, 'closeclick');
    }
  }

  // The filter text input
  this.filterText = ko.observable();

  // Filter the visible locations based on title (case-insensitive)
  // If no text was entered in the filter, all should be visible
  this.filter = function() {
    let filterText = self.filterText().trim().toUpperCase();

    self.allLocations().forEach(function(location){
      let title = location.title().toUpperCase();

      if (filterText === '' || title.includes(filterText)) {
        location.visible(true);
        location.marker.setMap(self.map);
      }
      else {
        location.visible(false);
        location.marker.setMap(null);
      }
    });

    // If only 1 location is returned by the filter, select that location
    if (self.visibleLocations().length === 1) {
      self.selectedLocation(self.visibleLocations()[0]);
    }
    // Otherwise, clear the selected location
    else {
      self.selectLocation();
    }
  }

  // Reset the filter; all locations should be visible
  this.reset = function() {
    self.allLocations().forEach(function(location){
      location.visible(true);
      location.marker.setMap(self.map);
    });

    // Clear the filter and selected location
    self.filterText('');
    self.selectLocation();
  }

  // Open/close the left sidebar
  this.toggleSidebar = function() {
    $('#sidebar-content').toggle();

    // Resize the map to the new area
    google.maps.event.trigger(vm.map, 'resize');

    // If a location is selected, re-center it on the map
    if (self.selectedLocation()) {
      vm.map.setCenter(self.selectedLocation().marker.position);
    }
    // Otherwise, fit the map to the bounds of the locations
    else {
      vm.map.fitBounds(vm.bounds);
    }
  }
};

let vm = new ViewModel;
ko.applyBindings(vm);
