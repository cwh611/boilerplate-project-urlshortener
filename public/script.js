document.getElementById("submit-btn").addEventListener("click", (event) => {
    event.preventDefault();
    const originalUrl = document.getElementById("url-input").value;
    const output = document.getElementById("output");
    if ( !originalUrl ) {
        alert("URL is required");
        return
    }
    const urlRequest = `https://chunk-url-shortener-b4adf6660818.herokuapp.com/api/shorturl/${originalUrl}`
    fetch(urlRequest, {
        method: "POST",
        body: JSON.stringify({ url: originalUrl })
    })
    .then(response => response.json)
    .then(data => {
        if ( data.error ) {
            output.innerText = `Error: ${data.error}`
        }   else    {
            output.innerHTML = `
            <p>Original URL: ${data.original_url}</p>
            <p>Short URL: ${data.short_url}</p>`
        }
    })
    .catch(error => {
        output.innerText = `Server error (${error}) - please try again`
    })
});

document.getElementById("redirect-btn").addEventListener("click", (event) => {
    event.preventDefault();
    const shortUrl = document.getElementById("url-input").value;
    const output = document.getElementById("output");
    if ( !shortUrl || /^[0-9]+$/.test(shortUrl) ) {
        alert("Short URL (integers only) is required");
        return
    }
    const redirectRequest = `https://chunk-url-shortener-b4adf6660818.herokuapp.com/api/shorturl/${shortUrl}`;
    fetch(redirectRequest)
        .then(response => {
            if ( !response.ok ) {
                alert("Short URL not found");
            }   else    {
                window.location.href = response.url
            }
        })
        .catch(error => {
            output.innerText = `Error: ${error}`
        })       
})