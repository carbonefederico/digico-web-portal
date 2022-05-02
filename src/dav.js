const dav_props = {
    "companyId": "2bdaf281-44e3-4009-9e9b-b9e33777f5df",
    "loginPolicyId": "2CLOLGfNf9SEBcEyfkqCgIP3WNHljhUY",
    "tvLoginPolicyId": "2CLOLGfNf9SEBcEyfkqCgIP3WNHljhUY",
    "preferencesPolicyId": "iUL6OlMwI5spwBuCoZdD7GC9QhUOTuiY",
    "trxPolicyId": "9a369b200bdda575c77db3fdcefa4f20",
    "registrationPolicyId": "078b975b1e71575e1f48a5015c155e7a",
    "apiKey": "vC3IApdZFgp874z2VpZupiw7XuZqfiDFOM2si6rEAJ7dGL1SJAOO0CpUaykZ5pouTcerPpza418gNCIQ2MTebBKnQVY0bgKUeYPI7KSBddVV1C7DkXznvWFtdyk0uZsNuDqDIs09LLDZ381BjytPwLYcYxLvggAg0mfw77fAZnTm0whihQFgp4qUzrfmMkW5S1uCowE18eHH2fxuvAhcCdlWushJjZI4LaMglSlBRfmSvDLxpRgd6wUGI1t5Tr7T"
}

async function getToken() {
    const url = "https://api.singularkey.com/v1/company/" + dav_props.companyId + "/sdkToken";
    let response = await fetch(url, {
        method: "GET",
        headers: {
            "X-SK-API-KEY": dav_props.apiKey
        }
    });

    token = await response.json();
    console.log(token);
}

async function showWidget(policyId, successCallback, errorCallback, onCloseModal, parameters) {
    let widgetConfig = {
        config: {
            method: "runFlow",
            apiRoot: "https://api.singularkey.com/v1",
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

    singularkey.skRenderScreen(skWidget, widgetConfig);
}

