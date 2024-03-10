function main(text, node) {
    let lines = text.split("\n");
    let order_details = lines.indexOf("The items in your order are:");
    if (order_details == -1) return;

    let evt_name = lines[order_details + 1];
    let loc = lines[order_details + 2];
    let dateTime = lines[order_details + 3];
    let seats = lines[order_details + 4];
    console.log(evt_name);
    console.log(loc);
    console.log(dateTime);
    console.log(seats);
    let res = JsonLd.newEventReservation();
    res.reservationFor.name = evt_name;
    res.reservationFor.startDate = JsonLd.toDateTime(
        dateTime,
        "dddd d MMM yyyy @ hh:mm",
        "en"
    );
    let address = res.reservationFor.location.address;
    address.buildingFullName = loc;
    if (loc == "Theatre Royal Haymarket") {
        address.streetAddress = "Haymarket";
        address.addressRegion = "London";
        address.addressCountry = "GB";
        address.postalCode = "SW1Y 4HT";
    }
    res.reservationFor.location.geo = {
        "latitude": 51.50861,
        "longitude": -0.13128
    };

    let seat_matches = seats.match(/^([A-Za-z]+)\s+([A-Za-z0-9-)]+)/);
    if (seat_matches) {
        let seat = res.reservedTicket.ticketedSeat;
        seat.seatSection = seat_matches[1];
        seat.seatNumber = seat_matches[2];
    }
    let order_number = text.match(/Your Booking Reference number is (\d+)./);
    if (order_number) {
        res.reservationNumber = order_number[1];
    }

    res.reservationFor.additionalType = "TheaterReservation";
    return res;

}
