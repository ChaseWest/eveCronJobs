eveCronJobs
===========

##Overview

eveCronJobs uses `nodeJS` and `Firebase` to setup cron jobs that run every hour. These jobs pull data from
eve-central, format the results to `JSON` and store the results in `Firebase`.

The data contained is the current buy and sell prices for ore and minerals for a given hour.

This provides a few nice features.


###RESTful API calls via `Firebase`:

This alone was enough to make me want to pursue this project. Calls are simple and easy to construct.

The main calls are to obtain the buy and sell prices for a given ore/mineral.

Ore: `https://tcwtest.firebaseio.com/Ore/ORENAME/YEAR/MONTH/DAY/HOUR.json`

ex: https://tcwtest.firebaseio.com/Ore/Scordite/2013/4/16/5.json

	{
		sell: "37.58",
		buy: "25.04"
	}

Minerals: `https://tcwtest.firebaseio.com/Minerals/MINERALNAME/YEAR/MONTH/DAY/HOUR.json`

ex: https://tcwtest.firebaseio.com/Minerals/Tritanium/2013/4/16/5.json

	{
		sell: "6.33",
		buy: "4.72"
	}

Also provided is an array of objects containing all details of a given ore needed:

ore details: `https://tcwtest.firebaseio.com/ore details/ORENAME.json`

ex: https://tcwtest.firebaseio.com/ore%20details/Scordite.json

	{
		typeId: 1228,
		volume: 0.15,
		refinesTo: {
		Tritanium: 833,
		Pyerite: 416
		},
		percentIncrease: 0,
		security: "high",
		batch: 333
	}


Please note that these parameters are optional, so for example, if you wanted to pull all the data you could use the following:
https://tcwtest.firebaseio.com/.json

or

https://tcwtest.firebaseio.com/Ore/Scordite.json

for all the `Scordite` data.


###`Firebase`'s real-time updates:

By using the `Firebase` api on the client-side, you can listen for changes to the data and update your page accordingly. This
allows you to have graphs that redrawn with new data is added, adjusting calculations, or anything else you may find interesting.

You can view more regarding the `Firebase` API here: https://www.firebase.com/docs/creating-references.html


###The data is in JSON!

This is a great benefit, as most other APIs are other formats, such as XML.
