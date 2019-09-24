(function() {
    const usernameField = document.getElementById('usernameField');
    const passwordField = document.getElementById('passwordField');
    const loginButton = document.getElementById('loginButton');

    registerEvents();

    function registerEvents() {
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
                console.log(response);
                if (response.status == 200) {
                    return response.json();
                } else {
                    throw new Error('unauthorized');
                }
            })
            .then(body => console.dir(body))
            .catch(console.log);
    }
})();
