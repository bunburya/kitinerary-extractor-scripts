function parseDateTime(dateStr, timeStr) {
    // Parse date and time strings in the format found in the email and output as a
    // properly formatted datetime
    // Doesn't handle timezones and returns a timezone-naive datetime.
    let day, month, year, hour, minute, hhmm, ampm;
    console.log(dateStr);
    let match = dateStr.match(/(\d+) ([A-Za-z]+) (\d{4})/);
    console.log(match);
    [day, month, year] = match.slice(1);
    console.log(day);
    [hhmm, ampm] = timeStr.split(" ");
    [hour, minute] = hhmm.split(":");
    if (ampm == "PM") {
        hour = Number(hour) + 12;
    }
    return JsonLd.toDateTime(
        `${day} ${month} ${year} ${hour}:${minute}`,
        "dd MMM yyyy hh:mm",
        "en"
    )
}

function main(msg, node, triggerNode) {
    let html = node.childNodes[0].content.root;
    let pkpassNode = node.childNodes[1];

    let res = pkpassNode ? pkpassNode.result[0] : JsonLd.newEventReservation();
    let resFor = res.reservationFor;
    let location = resFor.location;
    location.name = html.recursiveContent.match(/Cinema:\s*(.+)/)[1];
    resFor.name = html.recursiveContent.match(/Film\/Event:\s*(.+)/)[1];

    if (pkpassNode) {
        // If pkpass is attached, use it to get certain extra information
        let pass = pkpassNode.content;
        let cinemaAddress = pass.field["cinema-address"];
        if (cinemaAddress) {
            let address = JsonLd.newObject("PostalAddress");
            // This assumes that the street address is the first line, the region
            // is the second last line and the postcode is the last line.
            // Would need to see more samples to know if it is always like this.
            let lines = cinemaAddress.value.trim().split("\r\n");
            address.postalCode = lines[lines.length-1];
            address.addressRegion = lines[lines.length-2];
            address.streetAddress = lines[0];
            resFor.location.address = address;
            let seat = JsonLd.newObject("Seat");
            seat.seatNumber = pass.field["seats"].value;
            res.reservedTicket.ticketedSeat = seat
        }
    } else {
        // If no pkpass attached, we'll need to get certain additional information from
        // the email
        let dateStr = html.recursiveContent.match(/Date:\s*(.+)/)[1];
        let timeStr = html.recursiveContent.match(/Time:\s*(.+)/)[1];
        resFor.startDate = parseDateTime(dateStr, timeStr);
        console.log(resFor.startDate);
        resFor.location.address.addressCountry = "GB";
        res.reservedTicket.ticketNumber = html.recursiveContent.match(/Thank you for your order!\n([A-Z0-9]+)\n/)[1];
    }
    return res;
}
