$(document).ready(function () {
  if ($('form.add-vehicle').length) {
    vehicleQuery();
  }
});

function vehicleQuery() {

    let $yearDropdown = $('#year-dropdown');
    let $makeDropdown = $('#make-dropdown');
    let $modelDropdown = $('#model-dropdown');


    $yearDropdown.empty();


    //set default values
    $yearDropdown.append('<option selected="true" disabled>Select Year</option>');
    $yearDropdown.prop('selectedIndex', 0);
    $makeDropdown.append('<option selected="true" disabled>Select Make</option>');
    $modelDropdown.append('<option selected="true" disabled>Select Model</option>');

    const url = 'https://garage-buddy.herokuapp.com/vehicles/';

    let years = [];
    let makes = [];
    let models = [];

    // populate dropdown with years
    $.ajax({
      url: url,
      dataType: 'json',
      async: false,
      success: function (data) {
        $.each(data, function (key, entry) {
          if (!years.includes(entry.year)) {
            years.push(entry.year);
          }
        });
      }
    });

    years.sort();
    years.forEach( (year) => {
      $yearDropdown.append($('<option></option>').attr('value', year).text(year));
    });

    // update the make dropdown when a model is selected
    $yearDropdown.change( function () {
      makes = [];
      $makeDropdown.empty();

      // populate dropdown with models for that make in that year
      $.ajax({
        url: url,
        dataType: 'json',
        async: false,
        success: function (data) {
          $.each(data, function (key, entry) {
            if (!makes.includes(entry.make) && ($yearDropdown.val() == entry.year)) {
              makes.push(entry.make);
            }
          });
        }
      });

      makes.sort();
      makes.forEach((make) => {
        $makeDropdown.append($('<option></option>').attr('value', make).text(make));
      });

      $makeDropdown.prepend('<option selected="true" disabled>Select Make</option>');
      $makeDropdown.prop('selectedIndex', 0);
    });

    // update the model dropdown when a make is selected
    $makeDropdown.change( function () {
      models = [];
      $modelDropdown.empty();

      // populate dropdown with makes for that year
      $.ajax({
        url: url,
        dataType: 'json',
        async: false,
        success: function (data) {
          $.each(data, function (key, entry) {
            if (!models.includes(entry.model) &&
              ($yearDropdown.val() == entry.year) &&
              ($makeDropdown.val() == entry.make)) {
              models.push(entry.model);
            }
          });
        }
      });

      models.sort();
      models.forEach((model) => {
        $modelDropdown.append($('<option></option>').attr('value', model).text(model));
      });

      $modelDropdown.prepend('<option selected="true" disabled>Select Model</option>');
      $modelDropdown.prop('selectedIndex', 0);


    });


}
