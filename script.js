
const dalleEndpoint = 'https://api.openai.com/v1/images/generations';


const defaultApiKey = "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";

const reqButton = document.getElementById('button-request');
const reqStatus = document.getElementById('request-status');


reqButton.onclick = function () {

    reqButton.disabled = true;


    reqStatus.innerHTML = "Request started...";

    const key = defaultApiKey; 
    const prompt = document.getElementById('text-prompt').value;
    const count = Number(document.getElementById('image-count').value);
    const radios = document.getElementsByName('image-size');
    let size;
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            size = Number(radios[i].value);
            break;
        }
    }

    const reqBody = {
        prompt: prompt,
        n: count,
        size: size + "x" + size,
        response_format: 'url',
    };


    const reqParams = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify(reqBody)
    };

    fetch(dalleEndpoint, reqParams)
        .then(res => res.json())
        .then(json => addImages(json, prompt))
        .catch(error => {
            reqStatus.innerHTML = error;
            reqButton.disabled = false;
        });
};

/** 
 * @param {Obj} jsonData 
 * @param {String} prompt 
 */
function addImages(jsonData, prompt) {

    reqButton.disabled = false;

    if (jsonData.error) {
        reqStatus.innerHTML = 'ERROR: ' + jsonData.error.message;
        return;
    }
    
    const container = document.getElementById('image-container');
    for (let i = 0; i < jsonData.data.length; i++) {
        let imgData = jsonData.data[i];
        let img = document.createElement('img');
        img.src = imgData.url;
        img.alt = prompt;
        container.prepend(img);
    }

    reqStatus.innerHTML = jsonData.data.length + ' images received for "' + prompt + '"';
}
