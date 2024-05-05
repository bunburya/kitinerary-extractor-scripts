function parseReservation(bookingRef, match) {
    var dateStr = match[1];
    var depAirport = match[2];
    var arrAirport = match[3];
    var depTime = dateStr + ' ' + match[4];
    var arrTime = dateStr + ' ' + match[5];
    var flightNo = match[6];

    var res = JsonLd.newFlightReservation();
    res.reservationNumber = bookingRef;
    res.reservationFor.flightNumber = flightNo;
    res.reservationFor.departureTime = JsonLd.toDateTime(depTime, "dddd, dd MMMM yyyy HH:mm", "en");
    res.reservationFor.arrivalTime = JsonLd.toDateTime(arrTime, "dddd, dd MMMM yyyy HH:mm", "en");
    res.reservationFor.airline.iataCode = flightNo.slice(0, 2);
    res.reservationFor.departureAirport.iataCode = depAirport;
    res.reservationFor.arrivalAirport.iataCode = arrAirport;
    return res;
}


function main(text) {
    var reservations = new Array();
    var bookingRef = text.match(/Booking code: ([A-Z0-9]+)\n/)[1];
    console.log(bookingRef);
    var resPattern = /([A-Za-z]+, \d{2} [A-Za-z]+ \d{4})\n[^\n]*\n([A-Z]{3})\n([A-Z]{3})\n(\d{2}:\d{2})h (\d{2}:\d{2})h\n([A-Z]{2}\d+)\n/g;
    //console.log(text.match(resPattern));
    while ((m = resPattern.exec(text)) != null) {
        reservations.push(parseReservation(bookingRef, m));
    }
    return reservations;
}
