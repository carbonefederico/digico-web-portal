let user_data
let token;
let skWidget;
let idTokenClaims;

window.onload = async () => {
    document.getElementById("login-button").addEventListener("click", () => startLogin());
    document.getElementById("register-button").addEventListener("click", () => startRegistration());
    document.getElementById("deposit-button").addEventListener("click", () => startDeposit());
    document.getElementById("username").addEventListener("click", () => startProfileUpdate());
    document.getElementById("logout").addEventListener("click", () => logout());
    document.getElementById("buy-btc-button").addEventListener("click", () => startBuy());
    skWidget = document.getElementsByClassName("skWidget")[0];

    let response = await fetch("https://carbonefederico.github.io/demo-data/digico-balances/data.json");
    user_data = await response.json();
}

async function startProfileUpdate() {
    console.log("startProfileUpdate for user " + idTokenClaims.username);
    showSpinner();
    await getToken();
    let parameters = {
        'username': idTokenClaims.username
    }
    showWidget(dav_props.preferencesPolicyId, inSessionCallback, errorCallback, onCloseModal, parameters);
}

async function startDeposit() {
    console.log("startDeposit for user " + idTokenClaims.username);
    showSpinner();
    await getToken();
    let parameters = {
        "userName": idTokenClaims.username
    }

    showWidget(dav_props.trxPolicyId, inSessionCallback, errorCallback, onCloseModal, parameters);
}

async function startBuy() {
    console.log("startBuy for user " + idTokenClaims.username);
    let amount = document.getElementById("btc-amount").value;
    showSpinner();
    await getToken();
    let parameters = {
        "userName": idTokenClaims.username,
        "amount": amount,
        "currency": "BTC"
    }

    showWidget(dav_props.buyPolicyId, inSessionCallback, errorCallback, onCloseModal, parameters);
}

async function startRegistration() {
    console.log("startRegistration");
    showSpinner();
    await getToken();
    showWidget(dav_props.registrationPolicyId, initSessionCallback, errorCallback, onCloseModal, null);
}

async function startLogin() {
    console.log("startLogin");
    showSpinner();
    await getToken();
    showWidget(dav_props.loginPolicyId, initSessionCallback, errorCallback, onCloseModal, null);
}

async function logout() {
    console.log("logout");
    idTokenClaims = null;
    updateUI(false);
}

function inSessionCallback(response) {
    console.log("inSessionCallback");
    davinci.cleanup(skWidget);
    hideSpinner();
}

function initSessionCallback(response) {
    console.log(response);
    davinci.cleanup(skWidget);
    idTokenClaims = response.additionalProperties;
    updateUI(true);
    hideSpinner();
}

function errorCallback(error) {
    console.log("errorCallback");
    console.log(error);
    davinci.cleanup(skWidget);
    hideSpinner();
}

function onCloseModal() {
    console.log("onCloseModal");
    console.log(document.cookie);
    davinci.cleanup(skWidget);
    hideSpinner();
}

function updateUI(isUserAuthenticated) {
    console.log("updateUI. Is user authenticated " + isUserAuthenticated);

    if (isUserAuthenticated) {
        document.getElementById("username").innerText = getDisplayName(idTokenClaims);
        setAmounts(idTokenClaims.username);
        hideElement("login-button");
        hideElement("register-button");
        hideElement("landing")
        displayElement("username");
        displayElement("logout");
        displayElement("home");
    } else {
        displayElement("login-button");
        displayElement("register-button");
        displayElement("landing");
        hideElement("username");
        hideElement("logout");
        hideElement("home")
    }
}

function setAmounts(username) {
    let data;
    if (user_data[username]) {
        displayElement("balance-chart");
        data = user_data[username]
    } else {
        hideElement("balance-chart");
        data = user_data["zero"]
    }
    let entries = Object.entries(data);
    entries.forEach((e) => {
        console.log("Setting " + e[0] + "," + e[1]);
        document.getElementById(e[0]).innerText = e[1];
    })
}


function displayElement(id) {
    document.getElementById(id).classList.remove("hidden");
}

function hideElement(id) {
    document.getElementById(id).classList.add("hidden");
}

function showSpinner() {
    displayElement("spinner");
}

function hideSpinner() {
    hideElement("spinner");
}

function getDisplayName(claims) {
    if (claims.given_name) {
        return claims.given_name;
    }

    return claims.email;
}

function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function getCookieValue(name) {
    return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';
}