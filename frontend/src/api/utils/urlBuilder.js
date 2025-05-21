function appendArrayParams(baseUrl, key, values) {
    // Gestisce array di valori per un parametro di query
    values.forEach(value => {
        if (value !== null && value !== undefined) {
            baseUrl += `${key}=${encodeURIComponent(value)}&`;
        }
    });
    return baseUrl;
}

function buildQueryParams(baseUrl, params) {
    // Genera i parametri di query per un oggetto
    for (const key in params) {
        let value = params[key];
        if (typeof value == "string"){
            value = value.replace(/ /gi, '+')
        }

        //console.log('key: ', key, ', val: ', value)
        if (Array.isArray(value)) {
            baseUrl = appendArrayParams(baseUrl, key, value);
        } else if (value !== null && value !== undefined) {
            baseUrl += `${key}=${encodeURIComponent(value)}&`;
        }
    }
    //console.log('baseurl: ', baseUrl)
    return baseUrl;
}

export function generateUrl(baseUrl, filters = {}, pagination = {}) {
    // Costruisce l'URL completo con filtri e paginazione
    let queryParams = "";

    if (filters && Object.keys(filters).length > 0) {
        queryParams = buildQueryParams(queryParams, filters);
    }

    if (pagination && Object.keys(pagination).length > 0) {
        queryParams = buildQueryParams(queryParams, pagination);
    }

    if (queryParams) {
        // Rimuove l'ultimo "&" e aggiunge il prefisso "?"
        queryParams = queryParams.slice(0, -1);
        return `${baseUrl}?${queryParams}`;
    }

    return baseUrl; // Restituisce solo l'URL di base se non ci sono parametri
}
