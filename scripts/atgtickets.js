function main(pdf) {

    let lines = pdf.text.split("\n");
    let orderNo = lines[0].split(" ")[1];
    let playName = lines[2];
    let loc = lines[3];
    let dateTime = lines[4];
    let seatNo = lines[5].trim();
    let res = JsonLd.newEventReservation();
    res.reservationFor.name = playName;
    res.reservationFor.startDate = JsonLd.toDateTime(
        dateTime,
        "ddd d MMM yyyy hh:mm",
        "en"
    );
    console.log(res.reservationFor.startDate);
    res.reservationFor.location.name = loc;
    if (loc == "Harold Pinter Theatre, London") {
        let addr = res.reservationFor.location.address;
        addr.streetAddress = "Panton Street";
        addr.addressRegion = "London";
        addr.addressCountry = "GB";
        addr.postalCode = "SW1Y 4DN";
        res.reservationFor.location.geo = {
            "latitude": 51.5093377,
            "longitude": -0.1365409
        };

    }

    if (seatNo) {
        let seat = res.reservedTicket.ticketedSeat;
        // for the email we have, we could split this into section and number, but
        // unclear if different venues would follow the same pattern
        seat.seatNumber = seatNo;
    }
    if (orderNo) {
        res.reservationNumber = orderNo;
    }

    res.reservationFor.additionalType = "TheaterReservation";
    return res;

}
