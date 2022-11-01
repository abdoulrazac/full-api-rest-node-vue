class ControllerBase {
  constructor({ params, query, body, send, user, uriGenerator, repository }) {
    this.uriGenerator = uriGenerator;
    this.params = params;
    this.query  = query;
    this.me     = user;
    this.body   = body;
    this.send   = send;
    this.repository = repository;
  }

  error(err) {
    const status = err.statusCode || err.status;
    const statusCode = status || 500;
    const statusMessage = err.message || err.error;
    // const response   = {
    //     "etat": {
    //           "code" : statusCode,
    //           "message" : statusMessage,
    //           "count": 0,
    //     },
    //     "response" : []
    // };
    this.send(statusCode, {message : statusMessage});
  }

  created(location, data) {
    if (location) {
      this.res.location(location);
    }
    // const response   = {
    //   "etat": {
    //         "code" : 201,
    //         "message" : "Created",
    //         "count": 0, 
    //   },
    //   "response" : data
    // };
    this.send(201, data);
  }

  ok(data) {
    // const response   = {
    //   "etat": {
    //         "code" : 200,
    //         "message" : "OK",
    //         "count": data.length,
    //   },
    //   "response" : data
    // };
    this.send(200, data);
  }

  noContent() {
    // const response   = {
    //   "etat": {
    //         "code" : 204,
    //         "message" : "Aucune donnée",
    //         "count": 0,
    //   },
    //   "response" : []
    // };
    this.send(200, data);
  }
}

module.exports = ControllerBase;
