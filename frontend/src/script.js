(function() {
	const baseUrl = 'http://localhost:8000';

    const usernameField = document.getElementById('usernameField');
    const passwordField = document.getElementById('passwordField');
    const loginButton = document.getElementById('loginButton');

	const navLogin = document.getElementById('navLogin');
	const navLogout = document.getElementById('navLogout');
	const navJournal = document.getElementById('navJournal');
	const navReport = document.getElementById('navReport');

	const sectionInit = {
		'Journal': loadJournal,
		'Report': loadReport
	};

    registerLoginEvents();
	initializeNavigation();

	let loggedIn = isLoggedIn();
	if (loggedIn) {
		navigateTo('Journal');
		toggleNav([navLogout, navJournal, navReport], [navLogin]);
	} else {
		navigateTo('Login');
		toggleNav([navLogin], [navLogout, navJournal, navReport]);
	}

	function loadJournal() {
		// TODO: fetch 'dates' (additional endpoint needed)
		const prom = requestWithSessionToken('tags', 'GET');
		prom.then(response => response.json())
			.then(console.dir);
	}

	function loadReport() {
		console.log('TODO: load report'); // TODO
	}

	function requestWithSessionToken(userEndpoint, method) {
		const username = sessionStorage.getItem('username');
		if (username == null) {
			alert('You are not logged in.');
			navigateTo('Login');
			return;
		}
		const accessToken = sessionStorage.getItem('accessToken');
		if (accessToken == null) {
			alert('Your token is expired.');
			navigateTo('Login');
			return;
		}
		const endpoint = `${baseUrl}/${username}/${userEndpoint}`;
		const prom = fetch(endpoint, {
			headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
				'Authorization': `Bearer ${accessToken}`
			},
			method: method
		});
		return prom.then(response => {
				if (method == 'GET' && response.status == 200 ||
					method == 'PUT' && response.status == 201) {
					return response;
				}
			}).catch(err => `Error fetching ${endpoint}: ${err}`);
	}

	function isLoggedIn() {
		const accessToken = sessionStorage.getItem('accessToken');
		return accessToken != null;
	}

    function registerLoginEvents() {
        const loginOnReturnKeyPress = () => {
            const returnKey = 13;
            if (window.event.keyCode == returnKey) {
                login();
            }
        };
        usernameField.addEventListener('keypress', loginOnReturnKeyPress);
        passwordField.addEventListener('keypress', loginOnReturnKeyPress);
        loginButton.addEventListener('click', login);
    }

	function initializeNavigation() {
		const navLinkNodes = document.getElementsByClassName('navLink');
		for (const navLinkNode of navLinkNodes) {
			const linkTarget = extractLinkTarget(navLinkNode.href);
			navLinkNode.addEventListener('click', () => {
				if (linkTarget == 'Logout') {
					logout();
				} else {
					navigateTo(linkTarget);
				}
			});
		}
	}

	function logout() {
		loggedIn = false;
		sessionStorage.removeItem('accessToken');
		toggleNav([navLogin], [navLogout, navJournal, navReport]);
	}

	function toggleNav(showNavs, hideNavs) {
		for (const showNav of showNavs) {
			showNav.style.display = 'inline-block';
		}
		for (const hideNav of hideNavs) {
			hideNav.style.display = 'none';
		}
	}

	function navigateTo(section) {
		const navLinkNodes = document.getElementsByClassName('navLink');
		for (const navLinkNode of navLinkNodes) {
			const linkTarget = extractLinkTarget(navLinkNode.href);
			if (section == linkTarget) {
				hideSectionsBut(section);
				if (sectionInit[section] != undefined) {
					sectionInit[section]();
				}
				break;
			}
		}
	}

	function extractLinkTarget(href) {
		const linkTarget = href.split('#');
		if (linkTarget.length != 2) {
			throw new Error(`link ${href} has no target`);
		}
		return linkTarget[1];
	}

	function hideSectionsBut(unhideSection) {
		const sectionNodes = document.getElementsByTagName('section');
		for (const sectionNode of sectionNodes) {
			if (sectionNode.id == 'sec' + unhideSection) {
				sectionNode.style.display = 'block';
			} else {
				sectionNode.style.display = 'none';
			}
		}
	}

    function login() {
        const tokenEndpoint = `${baseUrl}/token`;
        const username = usernameField.value;
        const password = passwordField.value;
        const loginPromise = fetch(tokenEndpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({username, password})
        });
        loginPromise
            .then(response => {
                if (response.status == 200) {
                    return response.json();
                } else {
                    throw new Error('unauthorized');
                }
            })
            .then(body => {
				sessionStorage.setItem('username', username);
				sessionStorage.setItem('accessToken', body.access_token);
				loggedIn = true;
				navigateTo('Journal');
				toggleNav([navJournal, navReport, navLogout], [navLogin]);
			})
            .catch(window.alert);
    }
})();
