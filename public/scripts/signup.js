// sign up front end script

const signupButton = document.getElementById('done');

signupButton.addEventListener('click', async (event) => {

    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPW = document.getElementById('confirmPassword').value.trim();

    if (!username || !email || !password || !confirmPW) {
        alert('Please enter a valid username, email, and matching passwords');
        return;
    }

    if (password !== confirmPW) {
        alert('Passwords do not match');
        return;
    }

    if (username && email && password && confirmPW) {

        const response = await fetch('/api/users/signup', {
            method: 'POST',
            body: JSON.stringify({ username, email, password}),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            document.location.replace('/homepage');
        }
        if (!response.ok) {
            const errorMessage = await response.text();
            alert('Failed to Sign-Up');
            console.log(errorMessage)
        }
    }
});