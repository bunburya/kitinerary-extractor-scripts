# kitinerary-extractor-scripts

This is a repository for custom extractor scripts I wrote to work with the [KItinerary](https://invent.kde.org/pim/kitinerary) data extraction engine. KItinerary can extract information about events, reservations, etc, from emails, PDFs and other documents. It uses extractor scripts to assist with the parsing of different types of document. A lot of scripts are [bundled](https://invent.kde.org/pim/kitinerary/-/tree/master/src/lib/scripts) with KItinerary. I wrote the additional scripts in this repository to handle certain emails I receive that are not handled by the bundled scripts.

In most cases these scripts have only been tested on a handful of emails (sometimes just one email) and so may not work in all circumstances (this is why I haven't contributed them to the KItinerary project). If you spot any problems please open an issue and to the extent that you would like to share any emails you have received from the relevant entity (which will not be published or shared further) please reach out.

The following scripts are included in this repository:

|Email sender|Email type|
|-----------:|----------|
|Picturehouse Cinemas (picturehouses.com)|Confirmation of film booking|
|Southbank Centre (southbankcentre.co.uk)|Confirmation of event booking|
|Theatre Royal Haymarket (boxoffice@trh.co.uk)|Confirmation of event booking|
|Tickemaster (ticketmaster.co.uk)|Confirmation of event booking|

