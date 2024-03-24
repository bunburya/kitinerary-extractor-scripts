function parseFlight(match, bookingRef) {
    // NOTE: Almost certainly won't work where arrival time is the next day.
    var airlineIata = match[1];
    var flightNo = match[2];
    var airlineName = match[3];
    var date = match[4];
    var departTime = match[5];
    var arriveTime = match[6];
    var departAirportIata = match[7];
    var arriveAirportIata = match[8];

    var res = JsonLd.newFlightReservation();
    res.reservationNumber = bookingRef;
    res.reservationFor.flightNumber = airlineIata + ' ' + flightNo;
    res.reservationFor.departureTime = JsonLd.toDateTime(date + ' ' + departTime,
                                                         "ddd, d MMM yyyy HH:mm", "en");
    res.reservationFor.arrivalTime = JsonLd.toDateTime(date + ' ' + arriveTime,
                                                       "ddd, d MMM yyyy HH:mm", "en");
    res.reservationFor.airline.iataCode = airlineIata;
    res.reservationFor.airline.name = airlineName;
    res.reservationFor.departureAirport.iataCode = departAirportIata;
    res.reservationFor.arrivalAirport.iataCode = arriveAirportIata;
    return res;
}

function main(html) {
    var reservations = new Array();

    const bookingRef = html.root.recursiveContent.match(/Booking Reference: ([A-Z0-9]{6})/)[1];
    const flightRegEx = /([A-Z]{2}) (\d{4}) Operated by (.+)\n.+\n(.+)\n(\d{2}:\d{2})\n(\d{2}:\d{2})\n(.+)\n(.+)/g;
    while ((m = flightRegEx.exec(html.root.recursiveContent)) != null) {
        reservations.push(parseFlight(m, bookingRef));
    }

    return reservations;
}

function extractPdfBoardingPass(pdf, node, barcode) {
    let res = barcode.result[0];
    const text = pdf.pages[barcode.location].text;
    const times = text.match(/(\d\d:\d\d) +\d+[A-Z] +(\d\d:\d\d)/);
    res.reservationFor.departureTime = JsonLd.toDateTime(times[1], 'hh:mm', 'en');
    res.reservationFor.boardingTime = JsonLd.toDateTime(times[2], 'hh:mm', 'en');
    return res;


}
