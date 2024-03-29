const dav_props = {
    "companyId": "2bdaf281-44e3-4009-9e9b-b9e33777f5df",
    "loginPolicyId": "2CLOLGfNf9SEBcEyfkqCgIP3WNHljhUY",
    "tvLoginPolicyId": "b000cb5e66c3b89afe46f1ac8655ffd4",
    "preferencesPolicyId": "iUL6OlMwI5spwBuCoZdD7GC9QhUOTuiY",
    "trxPolicyId": "9a369b200bdda575c77db3fdcefa4f20",
    "buyPolicyId": "68523fcf1ac161c101bfeb184a072da6",
    "registrationPolicyId": "078b975b1e71575e1f48a5015c155e7a",
    "apiKey": "vC3IApdZFgp874z2VpZupiw7XuZqfiDFOM2si6rEAJ7dGL1SJAOO0CpUaykZ5pouTcerPpza418gNCIQ2MTebBKnQVY0bgKUeYPI7KSBddVV1C7DkXznvWFtdyk0uZsNuDqDIs09LLDZ381BjytPwLYcYxLvggAg0mfw77fAZnTm0whihQFgp4qUzrfmMkW5S1uCowE18eHH2fxuvAhcCdlWushJjZI4LaMglSlBRfmSvDLxpRgd6wUGI1t5Tr7T"

}

async function getToken() {
    const url = "https://orchestrate-api.pingone.com/v1/company/" + dav_props.companyId + "/sdktoken";
    let response = await fetch(url, {
        method: "GET",
        headers: {
            "X-SK-API-KEY": dav_props.apiKey
        },
        redirect: "follow",
    });

    token = await response.json();
    console.log(token);
}

async function showWidget(policyId, successCallback, errorCallback, onCloseModal, parameters) {
    let widgetConfig = {
        config: {
            method: "runFlow",
            apiRoot: "https://auth.pingone.com/",
            accessToken: token.access_token,
            companyId: dav_props.companyId,
            policyId: policyId,
            parameters: parameters
        },
        useModal: true,
        successCallback,
        errorCallback,
        onCloseModal
    };

    davinci.skRenderScreen(skWidget, widgetConfig);
}

