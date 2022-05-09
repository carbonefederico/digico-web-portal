const fraud_props = {
    "app_id": "2bdaf281-44e3-4009-9e9b-b9e33777f5df",
    "app_secret": "ae72b7eaaeb544abae559e8947abe404",
    "data_endpoint": "https://p1f-api.pingone.com"
}

let user_data
let token;
let skWidget;
let idTokenClaims;
let application_session_id;

window.onload = async () => {
    document.getElementById("login-button").addEventListener("click", () => startLogin());
    document.getElementById("register-button").addEventListener("click", () => startRegistration());
    document.getElementById("deposit-button").addEventListener("click", () => startTransaction());
    document.getElementById("username").addEventListener("click", () => startProfileUpdate());
    document.getElementById("logout").addEventListener("click", () => logout());

    skWidget = document.getElementsByClassName("skWidget")[0];

    if (getCookieValue("sid")) {
        application_session_id = getCookieValue("sid");
    } else {
        application_session_id = generateSessionId();
    }

    initSecuredTouch(function () {
        _securedTouch.init({
            url: fraud_props.data_endpoint,
            appId: fraud_props.app_id,
            appSecret: fraud_props.app_secret,
            userId: null,
            sessionId: application_session_id,
            isDebugMode: false,
            isSingleDomain: false,
        }).then(function () {
            console.log("SecuredTouchSDK initialized successfully with Session id " + application_session_id);
        }).catch(function (e) {
            console.error("An error occurred. Please check your init configuration", e);
        });
    });

    let response = await fetch ("https://carbonefederico.github.io/demo-data/digico-balances/data.json");
    user_data = await response.json ();
}

window.onbeforeunload = () => {
    console.log("onbeforeunload. Loggin out Fraud session " + application_session_id);
    _securedTouch.logout(application_session_id);
}

function initSecuredTouch(callback) {
    if (window['_securedTouchReady']) {
        callback();
    } else {
        document.addEventListener('SecuredTouchReadyEvent', callback);
    }
}

function generateSessionId() {
    console.log("generateSessionId");
    let id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    return id;
}


async function startProfileUpdate() {
    console.log("startProfileUpdate for user " + idTokenClaims.username);
    showSpinner();
    await getToken();
    let parameters = {
        'username': idTokenClaims.username
    }
    showWidget(dav_props.preferencesPolicyId, porfileChangeSuccessCallback, errorCallback, onCloseModal, parameters);
}

async function startTransaction() {
    console.log("startTransaction for user " + idTokenClaims.username);
    showSpinner();
    await getToken();
    let parameters = {
        "sessionId": application_session_id,
        "stToken": window['_securedTouchToken']
    }
    showWidget(dav_props.trxPolicyId, porfileChangeSuccessCallback, errorCallback, onCloseModal, parameters);
}

async function startRegistration() {
    console.log("startRegistration");
    let parameters = {
        "sessionId": application_session_id,
        "stToken": window['_securedTouchToken']
    }
    showSpinner();
    await getToken();
    showWidget(dav_props.registrationPolicyId, successCallback, errorCallback, onCloseModal, parameters);
}

async function startLogin() {
    console.log("startLogin");
    let parameters = {
        "sessionId": application_session_id,
        "stToken": window['_securedTouchToken']
    }
    showSpinner();
    await getToken();
    showWidget(dav_props.loginPolicyId, successCallback, errorCallback, onCloseModal, parameters);
}

async function logout() {
    console.log("logout");
    idTokenClaims = null;
    deleteCookie("sid");
    _securedTouch.logout(application_session_id);
    updateUI(false);
}

function porfileChangeSuccessCallback(response) {
    console.log("porfileChangeSuccessCallback");
    singularkey.cleanup(skWidget);
    hideSpinner();
}

function successCallback(response) {
    console.log(response);
    singularkey.cleanup(skWidget);
    idTokenClaims = response.additionalProperties;
    updateUI(true);
    hideSpinner();
    console.log("Calling ST login with username " + idTokenClaims.username + "for session " + application_session_id);
    _securedTouch.login(idTokenClaims.username, application_session_id);
}

function errorCallback(error) {
    console.log("errorCallback");
    console.log(error);
    singularkey.cleanup(skWidget);
    hideSpinner();
}

function onCloseModal() {
    console.log("onCloseModal");
    console.log(document.cookie);
    singularkey.cleanup(skWidget);
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