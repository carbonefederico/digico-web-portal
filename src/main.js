const props = {
    "companyId": "2bdaf281-44e3-4009-9e9b-b9e33777f5df",
    "loginPolicyId": "2CLOLGfNf9SEBcEyfkqCgIP3WNHljhUY",
    "preferencesPolicyId": "iUL6OlMwI5spwBuCoZdD7GC9QhUOTuiY",
    "apiKey": "vC3IApdZFgp874z2VpZupiw7XuZqfiDFOM2si6rEAJ7dGL1SJAOO0CpUaykZ5pouTcerPpza418gNCIQ2MTebBKnQVY0bgKUeYPI7KSBddVV1C7DkXznvWFtdyk0uZsNuDqDIs09LLDZ381BjytPwLYcYxLvggAg0mfw77fAZnTm0whihQFgp4qUzrfmMkW5S1uCowE18eHH2fxuvAhcCdlWushJjZI4LaMglSlBRfmSvDLxpRgd6wUGI1t5Tr7T"
}

let token;
let skWidget;
let idTokenClaims;

window.onload = async () => {
    console.log("onload");
    document.getElementById("home").addEventListener("click", () => startLogin());
    document.getElementById("username").addEventListener("click", () => startProfileUpdate());
    document.getElementById("logout").addEventListener("click", () => logout());
    skWidget = document.getElementsByClassName("skWidget")[0];
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
    showSpinner ();
    await getToken();
    showWidget(props.loginPolicyId, successCallback, errorCallback, onCloseModal);
}

async function logout() {
    console.log("logout");
    idTokenClaims = null;
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
    console.log(response);
    singularkey.cleanup(skWidget);
    idTokenClaims = response.additionalProperties;
    updateUI(true);
    hideSpinner ();
}

function errorCallback(error) {
    console.log("errorCallback");
    console.log(error);
    singularkey.cleanup(skWidget);
    hideSpinner ();
}

function onCloseModal() {
    console.log("onCloseModal");
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
        document.getElementById("username").innerText = "Account";
        eachElement(".auth", (e) => e.style.display = "none");
        eachElement(".non-auth", (e) => e.style.display = "block");
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
    document.getElementById(idToShow).style.display = "block";
}

function hideAll() {
    console.log("hideAll");
    document.querySelectorAll(".home-image").forEach((e) => e.style.display = "none");
}

function eachElement(selector, fn) {
    for (let e of document.querySelectorAll(selector)) {
        fn(e);
    }
}