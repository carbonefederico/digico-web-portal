
window.onload = async () => {
    console.log("onload");
    await getToken();
    skWidget = document.getElementsByClassName("skWidget")[0];
    startLogin();
}

async function startLogin() {
    console.log("startLogin");
    showWidget(dav_props.tvLoginPolicyId, successCallback, errorCallback, onCloseModal);
}

function successCallback(response) {
    console.log("successCallback");
    singularkey.cleanup(skWidget);
    console.log(response.additionalProperties);
    Android.handleLoginResponse(response.additionalProperties.given_name);
}

function errorCallback(error) {
    console.log("errorCallback");
    console.log(error);
    singularkey.cleanup(skWidget);
}

function onCloseModal() {
    console.log("onCloseModal");
    singularkey.cleanup(skWidget)
}

