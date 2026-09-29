/* ==========================================================================
   Skinwalker - Account Switcher System for phpBB3 Forumotion
   Author: Necromancer Coding
   Version: 1.0
   ========================================================================== */

const siglas = 'NOMBRE_FORO';
const cambiaCuentasAddActive = 'Añadir cuenta actual';
const cambiaCuentasAddSwap = 'Añadir y cambiar';
const cambiaCuentasSwap = 'Cambiar cuenta';
const cambiaCuentasConfirm = 'Confirma tus datos';
const cambiaCuentasClose = '<em class="ph-bold ph-x"></em>';
const cambiaCuentasSwapIcon = '<em class="ph-bold ph-arrows-clockwise"></em>';
const cambiaCuentasSwapTxt = 'Cambiar a esta cuenta';
const cambiaCuentasRefreshIcon = '<em class="ph-fill ph-broom"></em>';
const cambiaCuentasRefreshTxt = 'Actualizar información';
const cambiaCuentasRemoveIcon = '<em class="ph-fill ph-trash"></em>';
const cambiaCuentasRemoveTxt = 'Eliminar cuenta';
const cambiaCuentasSearch = 'Buscar cuenta por nombre de usuario';
const cambiaCuentasNoAccounts = 'Sin cuentas añadidas.';
const cambiaCuentasUsernamePlaceholder = 'Nombre de usuario';
const cambiaCuentasPasswordPlaceholder = 'Contraseña';

/*---------*/

/* ========
OPCIONAL: BOTÓN DE APERTURA
======== */

$(function(){
$('#skinwalker-button').on('click', function(){
$(this).toggleClass('active');
$('#skinwalker').toggleClass('active');
});
});

/*---------*/

$(function(){

	const SKINWALKER_ACCOUNTS = siglas + 'skinwalker';
	const SKINWALKER_PENDING_KEY = siglas + 'skinwalker_pending';

	if (localStorage.getItem(siglas + 'skinwalker') === null) {
	var skinWalkerList = '<i>Sin cuentas asignadas.</i>';
	} else {
	var skinWalkerList = '';
	}

	const skinWalkerHTML = `
	<div class="skinWalker-actions">
	  <button id="skinWalker-add-active" data-user="user">${cambiaCuentasAddActive}</button>
	  <button id="skinWalker-add-swap">${cambiaCuentasAddSwap}</button>
	</div>

	<input type="text"
		   id="skinWalker-filter"
		   placeholder="${cambiaCuentasSearch}"
		   style="display:none;">

	<div id="skinWalker-list"></div>
	`;

	const skinWalkerFormHTML = `
	<form action="/login" method="post" style="display:none;" id="skinWalker-form">
	  <button type="button" id="skinWalker-close">${cambiaCuentasClose}</button>
	  <h>${cambiaCuentasConfirm}</h>

	  <input type="text" id="skinWalker-username" name="sw-username" placeholder="${cambiaCuentasUsernamePlaceholder}">
	  <input type="password" id="skinWalker-password" name="sw-password" placeholder="${cambiaCuentasPasswordPlaceholder}">
	  <input title="Entrar automáticamente en cada visita" class="radio" type="checkbox" name="autologin" checked="checked" style="display:none;"/>
	  <button type="submit" id="skinWalker-submit">${cambiaCuentasSwap}</button>
	</form>
	`;

	$('#skinwalker').append(skinWalkerHTML);
	$('body').append(skinWalkerFormHTML);

	renderSkinWalkerAccounts();

	/* HELPERS */
	function getStoredAccounts() {
	  return JSON.parse(localStorage.getItem(SKINWALKER_ACCOUNTS) || '[]');
	}

	function saveCurrentUser() {
	  if (!isAuthenticatedUser()) return;

	  const accounts = getStoredAccounts();

	  const exists = accounts.some(
		a => a.user_id === _userdata.user_id
	  );
	  if (exists) return;

	  accounts.push({
		user_id: _userdata.user_id,
		username: _userdata.username,
		avatar: _userdata.avatar,
		groupcolor: _userdata.groupcolor,
		rank: _lang.rank_title
	  });

	  localStorage.setItem(SKINWALKER_ACCOUNTS, JSON.stringify(accounts));
	}

	function logoutThenLogin(username, password) {
	  $.get($('#logout').attr('href'), function () {
		$.post('/login', {
		  login: 1,
		  username,
		  password,
		  autologin: 1
		}, function () {
		  window.location.reload();
		});
	  });
	}

	const accounts = getStoredAccounts();
	const activeExists = accounts.some(a => a.user_id === _userdata.user_id);

	$('#skinWalker-add-active').toggle(!activeExists);
	$('#skinWalker-filter').toggle(accounts.length >= 2);

	function renderSkinWalkerAccounts() {
	  $('#skinWalker-filter').val('');

	  const accounts = getStoredAccounts();
	  const $list = $('#skinWalker-list');

	  $('#skinWalker-filter').toggle(accounts.length >= 2);

	  if (!accounts.length) {
		$list.html('<i>'+cambiaCuentasNoAccounts+'</i>');
		return;
	  }

	  const html = accounts.map(acc => {
		const isActive = acc.user_id === _userdata.user_id;

		return `
	<div class="skinWalker-skin ${isActive ? 'skinWalker-active' : ''}" style="--group:#${acc.groupcolor};">
	  <div class="skinWalker-avatar">
		${acc.avatar}
	  </div>

	  <div class="skinWalker-info">
		<a href="/u${acc.user_id}">${acc.username}</a>
		<span>${acc.rank}</span>
	  </div>
	  <div class="skinWalker-buttons">
	  ${
		!isActive
		  ? `<button class="skinWalker-swapper"
					 data-username="${acc.username}"
					 title="${cambiaCuentasSwapTxt}">
			   ${cambiaCuentasSwapIcon}
			 </button>`
		  : ''
	  }
	  ${
		isActive
		  ? `<button class="skinWalker-refresh"
					 data-user-id="${acc.user_id}"
					 title="${cambiaCuentasRefreshTxt}">
			   ${cambiaCuentasRefreshIcon}
			 </button>`
		  : ''
	  }
	  <button class="skinWalker-remove"
			  data-user-id="${acc.user_id}"
			  title="${cambiaCuentasRemoveTxt}">
		${cambiaCuentasRemoveIcon}
	  </button>
	</div>
	</div>
	`;
	  }).join('');

	  $list.html(html);
	}

	let skinWalkerMode = null;

	function openFormConfirm(username) {
	  skinWalkerMode = 'confirm';

	  $('#skinWalker-username')
		.val(username)
		.hide();

	  $('#skinWalker-password').val('');
	  $('#skinWalker-form').show();
	}

	function openFormFull() {
	  skinWalkerMode = 'full';

	  $('#skinWalker-username')
		.val('')
		.show();

	  $('#skinWalker-password').val('');
	  $('#skinWalker-form').show();
	}

	function closeForm() {
	  skinWalkerMode = null;
	  $('#skinWalker-form').hide();
	  $('#skinWalker-username').val('').show();
	  $('#skinWalker-password').val('');
	}

	function isAuthenticatedUser() {
	  return (
		typeof _userdata === 'object' &&
		Number(_userdata.user_id) > 0 &&
		_userdata.username &&
		_userdata.username !== 'Anonymous'
	  );
	}

	function finalizePendingAccount() {
	  if (!isAuthenticatedUser()) return;

	  const pendingUsername = localStorage.getItem(SKINWALKER_PENDING_KEY);
	  if (!pendingUsername) return;

	  if (_userdata.username !== pendingUsername) return;

	  saveCurrentUser();
	  localStorage.removeItem(SKINWALKER_PENDING_KEY);
	}

	/* EVENTS */
	$('#skinWalker-add-active').on('click', function () {
	  openFormConfirm(_userdata.username);
	});

	$('#skinWalker-add-swap').on('click', function () {
	  openFormFull();
	});

	$('#skinWalker-close').on('click', closeForm);

	$('#skinWalker-form').on('submit', function (e) {
	  e.preventDefault();

	  const username = $('#skinWalker-username').val();
	  const password = $('#skinWalker-password').val();

	  if (!password) return;

	  if (skinWalkerMode === 'full') {
		localStorage.setItem(SKINWALKER_PENDING_KEY, username);
	  }

	  if (skinWalkerMode === 'confirm') {
		saveCurrentUser();
	  }

	  logoutThenLogin(username, password);
	});

	$('#skinWalker-list').on('click', '.skinWalker-remove', function () {
	  const userId = $(this).data('user-id');

	  const accounts = getStoredAccounts().filter(a => a.user_id !== userId);
	  localStorage.setItem(SKINWALKER_ACCOUNTS, JSON.stringify(accounts));

	  renderSkinWalkerAccounts();
	});

	$('#skinWalker-list').on('click', '.skinWalker-swapper', function () {
	  const username = $(this).data('username');
	  openFormConfirm(username);
	});

	$('#skinWalker-list').on('click', '.skinWalker-refresh', function () {
	  const userId = $(this).data('user-id');
	  const accounts = getStoredAccounts();

	  const updated = accounts.map(acc => {
		if (acc.user_id !== userId) return acc;

		return {
		  user_id: _userdata.user_id,
		  username: _userdata.username,
		  avatar: _userdata.avatar,
		  groupcolor: _userdata.groupcolor,
		  rank: _lang.rank_title
		};
	  });

	  localStorage.setItem(SKINWALKER_ACCOUNTS, JSON.stringify(updated));
	  renderSkinWalkerAccounts();
	});

	$('#skinWalker-list').on('click', '.skinWalker-swapper', function () {
	  const username = $(this).data('username');

	  $('#skinWalker-username').val(username);
	  $('#skinWalker-password').val('');
	  $('#skinWalker-form').show();
	});

	$('#skinWalker-form').on('submit', function () {
	  $('#skinWalker-submit').prop('disabled', true);
	});

	$('#skinWalker-filter').on('keyup', function () {
	  const value = $(this).val().toLowerCase().trim();

	  $('.skinWalker-skin').each(function () {
		const name = $(this)
		  .find('.skinWalker-info a')
		  .text()
		  .toLowerCase();

		$(this).toggle(name.indexOf(value) > -1);
	  });
	});

	/* ==========================================================================
	   Initialize Skinwalker
	   ========================================================================== */

	$(document).ready(function () {
	if (!isAuthenticatedUser()) {
	  localStorage.removeItem(SKINWALKER_PENDING_KEY);
	}
	  finalizePendingAccount();
	  renderSkinWalkerAccounts();
	});

});
