document.getElementById("submit-btn").addEventListener("click", (event) => {
    event.preventDefault();
    const originalUrl = document.getElementById("url-input").value;
    const output = document.getElementById("output");
    const urlRequest = `https://chunk-url-shortener-b4adf6660818.herokuapp.com/api/shorturl`
    fetch(urlRequest, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: originalUrl })
    })
    .then(response => response.json())
    .then(data => {
        if ( data.error ) {
            output.innerText = `Error: ${data.error} (protocol required)`
        }   else    {
            output.innerHTML = `
            <p>Original URL: ${data.original_url}</p>
            <p>Short URL: ${data.short_url}</p>`;
            console.log(`
            <p>Original URL: ${data.original_url}</p>
            <p>Short URL: ${data.short_url}</p>`);
        }
    })
    .catch(error => {
        output.innerText = `Server error (${error}) - please try again`
    })
});