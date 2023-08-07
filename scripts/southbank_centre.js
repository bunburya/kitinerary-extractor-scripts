// Map abbreviations to full building names
const buildings = {
    QEH: "Queen Elizabeth Hall",
    RFH: "Royal Festival Hall"
}

function parseDateTime(str) {
    let match = str.match(/(\d{1,2} [A-Za-z]+ \d{4}) (\d{2}):(\d{2})/);
    let date = match[1];
    let hour = Number(match[2]);
    if (hour < 10) {
        hour += 12;
    }
    let minute = match[3];
    return JsonLd.toDateTime(
        `${date} ${hour}:${minute}`,
        "dd MMM yyyy hh:mm",
        "en"
    );
}


function main(html) {
    let fields = html.eval("//table//table//table//table/tr/td");
    let description = fields[0];
    let additionalInfo = fields[1];
    console.log(additionalInfo.recursiveContent.split("\n"));
    let seats = fields[2];

    let descLines = description.recursiveContent.split("\n");
    let eventName = descLines[0];
    let building = descLines[1];
    let dateTime = descLines[2];

    let res = JsonLd.newEventReservation();
    res.reservationFor.startDate = parseDateTime(dateTime);
    let address = res.reservationFor.location.address;
    let buildingFullName = buildings[building] || building;
    address.streetAddress = `${buildingFullName}, Southbank Centre`
    address.addressRegion = "London";
    address.addressCountry = "GB";
    address.postalCode = "SE1 8XX";
    res.reservationFor.location.geo = {
        "latitude": 51.50583,
        "longitude": -0.11679
    };
    res.reservationFor.name = eventName;
    let seat = res.reservedTicket.ticketedSeat;
    for (const line of additionalInfo.recursiveContent.split("\n")) {
        console.log(line);
        if (line.startsWith("Balcony")) {
            seat.seatSection = line;
            break;
        }
    }
    seat.seatNumber = seats.recursiveContent.replace("\n", ";");
    res.reservedTicket.ticketNumber = html.root.recursiveContent.match(/Order number: (\d+)/)[1];

    return res;
}
