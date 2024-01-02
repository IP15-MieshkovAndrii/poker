function respondWithJSON(res, statusCode, data) {
    res.writeHead(statusCode, getCommonHeaders());
    res.end(JSON.stringify(data));
}

function respondWithError(res, statusCode, errorMessage) {
    res.writeHead(statusCode, getCommonHeaders());
    res.end(JSON.stringify({ error: errorMessage }));
}

function responseWithText(res, statusCode, text) {
    res.writeHead(statusCode, getCommonHeaders());
    res.end(text);
}

  
function getCommonHeaders() {
    return {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        "Access-Control-Allow-Methods" : "GET, POST, PATCH, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Origin",

    };
}

module.exports = {
    respondWithJSON,
    respondWithError,
    responseWithText,
    getCommonHeaders,
};  