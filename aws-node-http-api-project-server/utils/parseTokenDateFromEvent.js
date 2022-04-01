const jwt = require("jsonwebtoken");

const parseTokenDateFromEvent = (event) => {
    const token = event.multiValueHeaders["Authorization"][0].split(" ")[1];
    const decodedData = jwt.decode(token);
    return decodedData;
}

module.exports = parseTokenDateFromEvent;