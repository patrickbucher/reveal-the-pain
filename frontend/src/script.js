(function() {
    const usernameField = document.getElementById('usernameField');
    const passwordField = document.getElementById('passwordField');
    const loginButton = document.getElementById('loginButton');

	const navLogin = document.getElementById('navLogin');
	const navLogout = document.getElementById('navLogout');
	const navJournal = document.getElementById('navJournal');
	const navReport = document.getElementById('navReport');

	let loggedIn = false;

    registerLoginEvents();
	initializeNavigation();
	navigateTo('Login');
	logout();

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
		localStorage.removeItem('accessToken');
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
        const tokenEndpoint = 'http://localhost:8000/token';
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
				localStorage.setItem('accessToken', body.access_token);
				loggedIn = true;
				navigateTo('Journal');
				toggleNav([navJournal, navReport, navLogout], [navLogin]);
			})
            .catch(window.alert);
    }
})();
