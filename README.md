# Frozen Custard Map
This application displays a map of frozen custard shops in the St. Louis area.
Users are able to filter the locations, and they can click on a location to display information
from [Foursquare](https://foursquare.com/).

&nbsp;
## Installation
- **Option 1:** Clone GitHub repository
  - Open a terminal and navigate to where you want to install the program
  - Run the following command to clone the repository:

    `git clone https://github.com/jpitcher2012/neighborhood-map`

&nbsp;
- **Option 2:** Download ZIP
  - Go to the [repository](https://github.com/jpitcher2012/neighborhood-map) in GitHub
  - Click on the "Clone or download" button
  - Click "Download ZIP"

&nbsp;
## Program design
- This program utilizes [Knockout.js](http://knockoutjs.com/) to implement a
Model-View-ViewModel (MVVM) pattern.
- **model.js** contains the data for the custard shops.
- **view-model.js** contains the code for the ViewModel.
- **app.js** contains other necessary code, including code for interacting with the Google Maps and Foursquare APIs.

&nbsp;
## Starting the application
- Simply open **index.html** in the browser.

&nbsp;
