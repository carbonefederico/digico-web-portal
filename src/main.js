const props = {
    "companyId": "2bdaf281-44e3-4009-9e9b-b9e33777f5df",
    "loginPolicyId": "2CLOLGfNf9SEBcEyfkqCgIP3WNHljhUY",
    "preferencesPolicyId": "iUL6OlMwI5spwBuCoZdD7GC9QhUOTuiY",
    "apiKey": "vC3IApdZFgp874z2VpZupiw7XuZqfiDFOM2si6rEAJ7dGL1SJAOO0CpUaykZ5pouTcerPpza418gNCIQ2MTebBKnQVY0bgKUeYPI7KSBddVV1C7DkXznvWFtdyk0uZsNuDqDIs09LLDZ381BjytPwLYcYxLvggAg0mfw77fAZnTm0whihQFgp4qUzrfmMkW5S1uCowE18eHH2fxuvAhcCdlWushJjZI4LaMglSlBRfmSvDLxpRgd6wUGI1t5Tr7T"
}

let token;
let skWidget;
let idTokenClaims;
let application_session_id;

window.onload = () => {
    console.log("onload");
   
    document.getElementById("home").addEventListener("click", () => startLogin());
    document.getElementById("username").addEventListener("click", () => startProfileUpdate());
    document.getElementById("logout").addEventListener("click", () => logout());
    skWidget = document.getElementsByClassName("skWidget")[0];
    
    if (getCookieValue ("sid")) {
        application_session_id = getCookieValue ("sid");
    } else {
        application_session_id = generateSessionId();
    }

    console.log("Session id " + application_session_id);
    initSecuredTouch(function () {
        console.log("callback function. session id " + application_session_id);
        _securedTouch.init({
            url: "https://us.securedtouch.com",
            appId: "ping-te-3",
            appSecret: "EJBgAz1mFeQFveSDqD6eYf6Dgs5T",
            userId: null,   // todo: Set the userId if the user is already logged-in.
            // If the user state is unknown when initializing the SDK, do not use this parameter.
            sessionId: application_session_id, // todo: Set your applicative sessionId if you have it
            isDebugMode: false,
            isSingleDomain: false, // todo: set to true if your website uses only one domain and no subdomains
        }).then(function () {
            console.log("SecuredTouchSDK initialized successfully");
            let curl = "curl --location --request GET 'https://us-api.securedtouch.com/SecuredTouch/rest/v4/ping-te-3/sessionRisk/" + application_session_id + "?verbose=true' --header 'Authorization: Hw7abzGYSiTPTtHe6qj1'--header 'X-St-Token: " + window['_securedTouchToken'] + "'";
            console.log("*** CURL ***");
            console.log(curl);
        }).catch(function (e) {
            console.error("An error occurred. Please check your init configuration", e);
        });
    });
}

function generateSessionId() {
    console.log("generateSessionId");
    let id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    return id;
}

function initSecuredTouch(callback) {
    console.log("initSecuredTouch");
    if (window['_securedTouchReady']) {
        console.log("calling callback");
        callback();
    } else {
        console.log("adding event listener");
        document.addEventListener('SecuredTouchReadyEvent', callback);
    }
}


async function startProfileUpdate() {
    console.log("startProfileUpdate for user " + idTokenClaims.username);
    await getToken();
    let parameters = {
        'username': idTokenClaims.username
    }
    showWidget(props.preferencesPolicyId, porfileChangeSuccessCallback, errorCallback, onCloseModal, parameters);
}

async function startLogin() {
    console.log("startLogin");
    let parameters = {
        "sessionId": application_session_id,
        "stToken": window['_securedTouchToken']
    }
    showSpinner ();
    await getToken();
    showWidget(props.loginPolicyId, successCallback, errorCallback, onCloseModal,parameters);
}

async function logout() {
    console.log("logout");
    idTokenClaims = null;
    deleteCookie ("sid");
    _securedTouch.logout(application_session_id);
    updateUI(false);
}

async function getToken() {
    console.log("getToken");

    const url = "https://api.singularkey.com/v1/company/" + props.companyId + "/sdkToken";
    let response = await fetch(url, {
        method: "GET",
        headers: {
            "X-SK-API-KEY": props.apiKey
        }
    });

    token = await response.json();
    console.log(token);
}

async function showWidget(policyId, successCallback, errorCallback, onCloseModal, parameters) {
    console.log("showWidget");
    let widgetConfig = {
        config: {
            method: "runFlow",
            apiRoot: "https://api.singularkey.com/v1",
            accessToken: token.access_token,
            companyId: props.companyId,
            policyId: policyId,
            parameters: parameters
        },
        useModal: true,
        successCallback,
        errorCallback,
        onCloseModal
    };

    singularkey.skRenderScreen(skWidget, widgetConfig);
}

function porfileChangeSuccessCallback(response) {
    console.log("porfileChangeSuccessCallback");
    singularkey.cleanup(skWidget);
    hideSpinner ();
}

function successCallback(response) {
    console.log("successCallback");
    console.log (document.cookie);
    console.log(response);
    singularkey.cleanup(skWidget);
    idTokenClaims = response.additionalProperties;
    updateUI(true);
    hideSpinner ();
    _securedTouch.login(idTokenClaims.username, application_session_id);
}

function errorCallback(error) {
    console.log("errorCallback");
    console.log(error);
    singularkey.cleanup(skWidget);
    hideSpinner ();
}

function onCloseModal() {
    console.log("onCloseModal");
    console.log (document.cookie);
    singularkey.cleanup(skWidget);
    hideSpinner ();
}

function updateUI(isUserAuthenticated) {
    console.log("updateUI. Is user authenticated " + isUserAuthenticated);

    if (isUserAuthenticated) {
        showPage("dashboard");
        document.getElementById("username").innerText = getDisplayName(idTokenClaims);
        document.getElementById("navbar").classList.remove("hidden");
    } else {
        showPage("home");
        document.getElementById("username").innerText = "Account";
        document.getElementById("navbar").classList.add ("hidden");
    }
}

function showSpinner () {
    document.getElementById ("spinner").classList.remove ("hidden");
}

function hideSpinner () {
    document.getElementById ("spinner").classList.add ("hidden");
}

function getDisplayName(claims) {
    if (claims.given_name) {
        return claims.given_name;
    }

    return claims.email;
}

function showPage(idToShow) {
    hideAll();
    document.getElementById(idToShow).classList.remove ("hidden");
}

function hideAll() {
    console.log("hideAll");
    document.querySelectorAll(".home-image").forEach((e) => e.classList.add ("hidden"));
}

function deleteCookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

function getCookieValue (name) {
    return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';
}