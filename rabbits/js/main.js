$(document).ready(function() {
  
var activeFilter = "cage";

  $("#placeholder").click(function() {
    $("#filter-list li").toggleClass("hidden");
  });

  $("#cage").click(function() {
  	activeFilter = "cage";
    $("#number, #sex, #type, #kind, #age, #weight, #status").toggleClass("hidden");
  });

  $("#number").click(function() {
  	activeFilter = "number";
    $("#cage, #sex, #type, #kind, #age, #weight, #status").toggleClass("hidden");
  });

  $("#sex").click(function() {
  	activeFilter = "sex";
    $("#number, #cage, #type, #kind, #age, #weight, #status").toggleClass("hidden");
  });

  $("#type").click(function() {
  	activeFilter = "type";
    $("#number, #sex, #cage, #kind, #age, #weight, #status").toggleClass("hidden");
  });

  $("#kind").click(function() {
  	activeFilter = "kind";
    $("#number, #sex, #type, #cage, #age, #weight, #status").toggleClass("hidden");
  });

  $("#age").click(function() {
  	activeFilter = "age";
    $("#number, #sex, #type, #kind, #cage, #weight, #status").toggleClass("hidden");
  });

  $("#weight").click(function() {
  	activeFilter = "weight";
    $("#number, #sex, #type, #kind, #age, #cage, #status").toggleClass("hidden");
  });

  $("#status").click(function() {
  	activeFilter = "status";
    $("#number, #sex, #type, #kind, #age, #weight, #cage").toggleClass("hidden");
  });

});