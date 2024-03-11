function main(content) {
    let evt_details = content.eval("//td[@class='stackTbl mobile-title nomargintop']")[0]
        .recursiveContent.split("\n");
    let res = JsonLd.newEventReservation();
    res.reservationFor.name = evt_details[0];
    let addr = res.reservationFor.location.address;
    let addr_tokens = evt_details[1].split(/,\s*/);
    res.reservationFor.location.name = addr_tokens[0];
    if (addr_tokens.length > 1) {
        addr.addressRegion = addr_tokens.pop();
    }
    addr.addressCountry = "GB"; // I think emails from .co.uk should always be in the UK
    res.reservationFor.startDate = JsonLd.toDateTime(
        evt_details[2].replace(/\s+/g, " "), // Can sometimes be double space after @
        "ddd d MMM yyyy @ h:mm ap",
        "en"
    );
    // TODO: seat numbers
    return res;
}
