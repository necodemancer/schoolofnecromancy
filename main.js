const quickLinks = `<ul id="quick-links">
  <li><a href="/schoolofnecromancy/truesight" data-i18n-title="truesight_small_title" data-i18n-title-heading="truesight_small_heading" data-tooltip-icon="game-icon game-icon-dead-eye">Truesight</a></li>
  <li><a href="/schoolofnecromancy/skinwalker" data-i18n-title="skinwalker_small_title" data-i18n-title-heading="skinwalker_small_heading" data-tooltip-icon="game-icon game-icon-body-swapping">Skinwalker</a></li>
  <li><a href="/schoolofnecromancy/huntersmark" data-i18n-title="huntersmark_small_title" data-i18n-title-heading="huntersmark_small_heading" data-tooltip-icon="game-icon game-icon-cross-mark">Hunter's Mark</a></li>
</ul>`;

const quickLinksSimple = `<ul id="quick-links">
  <li><a href="/schoolofnecromancy/" data-i18n="index_small_title"></a></li>
  <li><a href="/schoolofnecromancy/truesight" data-i18n-title="truesight_small_title">Truesight</a></li>
  <li><a href="/schoolofnecromancy/skinwalker" data-i18n-title="skinwalker_small_title">Skinwalker</a></li>
  <li><a href="/schoolofnecromancy/huntersmark" data-i18n-title="huntersmark_small_title">Hunter's Mark</a></li>
</ul>`;

const sidebar = `<sidebar>
  <h2 data-i18n="sidebar_title"></h2>
  ${quickLinksSimple} 
</sidebar>`;

const uiTemplates = {
  quickLinks: quickLinks,
  quickLinksSimple: quickLinksSimple,
  sidebar: sidebar
};

$(function(){

$('body').prepend('<div id="lang-switchers"><button class="lang-switch" data-lang="es">Español</button><button class="lang-switch" data-lang="en">English</button></div>');
$('body').prepend('<button class="theme-switch" data-i18n="theme_switch"></button>');

$(".lang-switch").click(function() {
  var currentLang = localStorage.getItem("selectedLang");
  var newLang = $(this).data("lang");
  if (currentLang !== newLang) {
    localStorage.setItem("selectedLang", newLang);
    location.reload();
  }
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
    $("[data-i18n-title-heading]").each(function() {
      var key = $(this).data("i18n-title-heading");
      $(this).attr('data-tooltip-head',data[key]);
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
