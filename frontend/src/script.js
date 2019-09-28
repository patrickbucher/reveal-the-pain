(function() {
	const baseUrl = 'http://localhost:8000';

    const usernameField = document.getElementById('usernameField');
    const passwordField = document.getElementById('passwordField');
    const loginButton = document.getElementById('loginButton');

    const dateField = document.getElementById('dateField');
    const existingTagField = document.getElementById('existingTagField');
    const newTagField = document.getElementById('newTagField');
    const addJournalEntryButton = document.getElementById('addJournalEntryButton');

	const journalList = document.getElementById('journalList');

    const ailmentTagField = document.getElementById('ailmentTagField');
    const correlationList = document.getElementById('correlationList');

	const navLogin = document.getElementById('navLogin');
	const navLogout = document.getElementById('navLogout');
	const navJournal = document.getElementById('navJournal');
	const navReport = document.getElementById('navReport');

	const sectionInit = {
		'Journal': loadJournal,
		'Report': loadReport
	};

    registerLoginEvents();
    registerJournalEvents();
    registerReportEvents();
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
		fetchTags(existingTagField);
		fetchJournal();
	}

	function fetchTags(tagField) {
        const newTagOption = (tag) => {
            const tagOption = document.createElement('option');
            tagOption.setAttribute('value', tag);
            tagOption.textContent = tag;
            return tagOption;
        };
		const prom = requestWithSessionToken('tags', 'GET');
		prom.then(response => response.json())
			.then(tags => {
				tags.sort();
				deleteAllChildren(tagField);
                tagField.append(newTagOption(''));
                for (const tag of tags) {
                    tagField.append(newTagOption(tag));
                }
            })
            .catch(console.log);
	}

	function loadReport() {
        fetchTags(ailmentTagField);
        deleteAllChildren(correlationList);
	}

	function fetchJournal() {
		const newJournalEntry = (date) => {
			console.log(date);
		}
		const prom = requestWithSessionToken('dates', 'GET');
		prom.then(response => response.json())
			.then(dates => {
				deleteAllChildren(journalList);
				dates.sort();
				dates.reverse(); // newest on top
				const tagProms = [];
				const journalEntries = new Map();
				for (const date of dates) {
					const resource = `${date}/tags`;
					const tagsProm = requestWithSessionToken(resource, 'GET');
					const resProm = tagsProm
						.then(response => response.json())
						.then(dateTags => {
							journalEntries.set(date, dateTags);
						})
						.catch(console.log);
					tagProms.push(resProm);
				}
				Promise.all(tagProms).then(() => {
					const sorted = [...journalEntries.entries()].sort().reverse();
					let sortedJournalEntries = new Map(sorted);
					for (const [key, value] of sortedJournalEntries.entries()) {
						addJournalEntry(key, value);
					}
				})
				.catch(console.log);
			})
			.catch(console.err);
	}

	function addJournalEntry(date, tags) {
		const dateItem = document.createElement('li');
		dateItem.textContent = date;
		journalList.append(dateItem);

        const deleteTag = (date, tag) => {
            const resource = `logentry/${date}/${tag}`;
            requestWithSessionToken(resource, 'DELETE')
                .then(fetchJournal)
                .catch(console.log);
        };

		const tagList = document.createElement('ul');
		for (const tag of tags) {
			const tagItem = document.createElement('li');
			tagItem.textContent = tag;
			tagItem.classList.add('tag');
            tagItem.addEventListener('click', () => {
                deleteTag(date, tag);
            });
			tagList.append(tagItem);
		}
		dateItem.append(tagList);
	}

	function deleteAllChildren(node) {
		let child = node.lastElementChild;
		while (child) {
			node.removeChild(child);
			child = node.lastElementChild;
		}
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
            if (response.status == 401) {
                navigateTo('Login');
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

    function registerJournalEvents() {
        // TODO: test with other locales if date format stays the same
        const addJournalEntry = () => {
            const date = dateField.value;
            const tag = newTagField.value.trim() != '' ?
                newTagField.value : existingTagField.value;
            const endpoint = `logentry/${date}/${tag}`;
            const prom = requestWithSessionToken(endpoint, 'PUT');
            prom.then(newTagField.value = '').catch(alert);
			loadJournal();
        };
        addJournalEntryButton.addEventListener('click', addJournalEntry);
        existingTagField.addEventListener('change', () => {
            newTagField.value = '';
        });
        newTagField.addEventListener('keypress', () => {
            existingTagField.value = '';
        });
    }

    function registerReportEvents() {
        const createCorrelationItem = (tag, corr) => {
            const item = document.createElement('li');
            const corrSpan = document.createElement('span');
            const tagSpan = document.createElement('span');
            tagSpan.textContent = tag;
            tagSpan.classList.add('tag');
            let corrStr = corr.toFixed(3);
            if (corr == 0) {
                corrStr = '±' + corrStr;
                corrSpan.classList.add('neutral');
            } else if (corr > 0) {
                corrStr = '+' + corrStr;
                corrSpan.classList.add('positive');
            } else {
                corrSpan.classList.add('negative');
            }
            corrSpan.textContent = corrStr;
            corrSpan.classList.add('correlation');
            item.append(corrSpan);
            item.append(tagSpan);
            return item;
        };
        ailmentTagField.addEventListener('change', () => {
            const tag = ailmentTagField.value;
            requestWithSessionToken(`correlation/${tag}`, 'GET')
                .then(response => response.json())
                .then(correlations => {
                    correlations.sort((a, b) => {
                        return b.correlation - a.correlation;
                    });
                    deleteAllChildren(correlationList);
                    for (const {tag, correlation} of correlations) {
                        correlationList.append(createCorrelationItem(tag, correlation));
                    }
                })
                .catch(console.log);
        });
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
        navigateTo('Login');
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
