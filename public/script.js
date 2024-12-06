document.getElementById("submit").addEventListener("click", (event) => {
    url = "https://chunk-url-shortener-b4adf6660818.herokuapp.com/api/shorturl"
    event.preventDefault();
    const originalUrl = document.getElementById("url-input").value;
    const output = document.getElementById("output");
    if ( !originalUrl ) {
        alert("URL is required");
        return
    }
    fetch(url, {
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
})