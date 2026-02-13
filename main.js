$(function(){
$('body').prepend('<button class="lang-switch" data-lang="es">Español</button><button class="lang-switch" data-lang="en">English</button>');

// Event listener for buttons
$(".lang-switch").click(function() {
  const lang = $(this).data("lang");
  changeLanguage(lang);
});

});

function changeLanguage(lang) {
  $.getJSON(`lang/${lang}.json`, function(data) {
    $("[data-i18n]").each(function() {
      const key = $(this).data("i18n");
      $(this).text(data[key]);
    });
    localStorage.setItem("selectedLang", lang);
    $('body').attr('lang', localStorage.getItem("selectedLang"));
  });
}

$(document).ready(function() {
  const savedLang = localStorage.getItem("selectedLang") || "es";
  changeLanguage(savedLang);
});
