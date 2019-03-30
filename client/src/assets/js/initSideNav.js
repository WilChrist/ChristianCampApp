$(document).ready(function(){
  $('.sidenav').sidenav();
  $('head').append('<link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">');
  $('.dropdown-button').dropdown(
    {
      inDuration: 1000,
      outDuration: 1000,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: ($('.dropdown-content').width()*3)/2.5 + 5, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left' // Displays dropdown with edge aligned to the left of button
    }
  );


});


