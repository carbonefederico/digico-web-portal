
window.onload = async () => {
    console.log("onload");
    await getToken();
    skWidget = document.getElementsByClassName("skWidget")[0];
    startLogin();
}

async function startLogin() {
    console.log("startLogin");
    showWidget(props.loginFlowId, successCallback, errorCallback, onCloseModal);
}

function successCallback(response) {
    console.log("successCallback");
    singularkey.cleanup(skWidget);
    console.log(response.id_token);
    Android.handleLoginResponse(response.additionalProperties);
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

