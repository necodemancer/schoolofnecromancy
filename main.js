const quickLinks = `<ul id="quick-links">
  <li><a href="/schoolofnecromancy/truesight" data-i18n-title="truesight_small">Truesight</a></li>
  <li><a href="/schoolofnecromancy/skinwalker" data-i18n-title="skinwalker_small">Skinwalker</a></li>
  <li><a href="/schoolofnecromancy/huntersmark" data-i18n-title="huntersmark_small">Hunter's Mark</a></li>
</ul>`;

const sidebar = `<sidebar>
  <h2 data-i18n="sidebar_title"></h2>
  ${quickLinks} 
</sidebar>`;

const uiTemplates = {
  quickLinks: quickLinks,
  sidebar: sidebar
};

$(function(){

$('body').prepend('<div id="lang-switchers"><button class="lang-switch" data-lang="es">Español</button><button class="lang-switch" data-lang="en">English</button></div>');
$('body').prepend('<button class="theme-switch" data-i18n="theme_switch"></button>');

$(".lang-switch").click(function() {
  var lang = $(this).data("lang");
  changeLanguage(lang);
});

$(".theme-switch").click(function() {
  var savedTheme = localStorage.getItem("selectedTheme");
  if (savedTheme === 'dark') {
    $('html').addClass('light').removeClass('dark');
    localStorage.setItem("selectedTheme", "light");
  } else {
    $('html').addClass('dark').removeClass('light');
    localStorage.setItem("selectedTheme", "dark");
  }
});

});

function changeLanguage(lang) {
  $.getJSON(`/schoolofnecromancy/lang/${lang}.json`, function(data) {
    $("[data-i18n]").each(function() {
      var key = $(this).data("i18n");
      $(this).html(data[key]);
    });
    $("[data-i18n-title]").each(function() {
      var key = $(this).data("i18n-title");
      $(this).attr('title',data[key]);
    });
    localStorage.setItem("selectedLang", lang);
    $('body').attr('lang', localStorage.getItem("selectedLang"));
  });
}

$(document).ready(function() {

  $('replaceWith').each(function() {
    var varName = $(this).attr('data-var');
    if (uiTemplates[varName]) {
      $(this).replaceWith(uiTemplates[varName]);
    } else {
      console.warn("No template found for:", varName);
    }
  });

  var savedLang = localStorage.getItem("selectedLang") || "es";
  changeLanguage(savedLang);
  var savedTheme = localStorage.getItem("selectedTheme") || "dark";
  $('html').removeClass('dark light').addClass(localStorage.getItem("selectedTheme"));
});
