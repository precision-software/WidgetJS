//'use strict';

class HttpFeed {

    // TODO: async nature - keep track of how many "next" and "prev"s have been issued to avoid race conditions.

    constructor(url, query, extractRows=null) {
        this.url = url;
        this.query = query;
        this.extractRows = extractRows? extractRows: ({data:{rows}}) => rows;

        this.highId = null;
        this.lowId = null;

        this.http = axios.create({
            timeout: 30000,
            responseType: 'json'
        });
    }


    first(n) {
        this.seek(null);
        return this.next(n);
    }


    last(n) {
        this.seek(null);
        return this.prev(n);
    }

    next(n) {
        return this.fetch(n, 'asc');
    }

    prev(n) {
        return this.fetch(n, 'desc')
    }

    seek(id) {
        this.lowId = this.highId = id;
    }

    fetch(n, dir) {

        // Use the lowid or the high id depending on
        let id = (dir === 'asc')?  this.highId: this.lowId;

        // Initiate the http request
        let query = {this.query..., dir:dir, id:id, count:n};
        let future = this.http.get(this.url, query );

        // When the request completes, check for errors, get the data and update our position.
        return future(this.checkForErrors).then(this.extractRows).then(this.updatePosition)
    }


    checkForErrors = (result) => {
        if (result.code < 200 || >= 300)
            throw (result);
        return result;
    };

    updatePosition = (rows) => {
        if (rows.length > 0)
            this.lowId = rows[0].id;
            this.highId = rows[rows.length - 1].id;
        }
    };


}
