Seedtag Codetest 2: Backend Engineer
====================================

![Tendrando Arms](http://vignette4.wikia.nocookie.net/starwars/images/c/cd/Tendrando_Arms.svg/revision/latest/scale-to-width-down/500?cb=20080311193640)

Beloved **General Lando Calrissian**,

We appreciate your labour during all these years in Varn and Kessel for the New Republic. You are notably known for your skill in creating droids and weaponry. That is why we need your help to finish the new battle droid *YVH* that still lacks the targeting module to attack.

The *YVH* modules have a sophisticated communication system between them via **API HTTP** requests.

The mission's objective is to develop a **HTTP endpoint** that receives **JSON** data and returns **JSON** data.

The vision module will send a **POST** request to ```/radar``` with the information from its environment. The radar module you have to develop should return the coordinates of the visible objective to attack.

The request body could look like this:
```{"protocols":["avoid-mech"],"scan":[{"coordinates":{"x":0,"y":40},"enemies":{"type":"soldier","number":10}}]}```

  - ```protocols```: Protocol or list of protocols to be used to determine which of the following points should be attacked first.
  - ```scan```: List of extracted points from the vision module. It's an array of points with the number of targets in that position. It has the following sub-values:
      + ```coordinates``` : Coordinates ```x``` and ```y``` of the point.
      + ```enemies``` : Enemy type ```type``` and number ```number```. The suitable values for the type are **soldier** y **mech**.
      + (optional) ```allies``` : Number of allies on the position. If not present, means that no allies in the zone.

The answer should contain coordinates ```x``` and ```y``` and the next point to destroy.

An example of the response body for the previous example would be ```{"x":0,"y":40}```. Hence, our *YVH* combat droid would know which is the following element to destroy.

To determine the next point to destroy, follow the rules for each of the requested protocols.

Available protocols
-----------------------

 - **closest-enemies** : prioritize closest enemy point.
 - **furthest-enemies** : prioritize furthest enemy point.

 - **assist-allies** : priorityze enemy points with allies.
 - **avoid-crossfire** : do not attack enemy points with allies.

 - **prioritize-mech** : attach *mech* enemies if found. Otherwise, any other enemy type is valid.
 - **avoid-mech** : do not attack any *mech* enemies.

It's important to mention that several protocols could be provided in the request. As an example, if we receive the protocols **closest-enemies** and **assist-allies**, we should choose the closest point having allies present.

Compatible protocols will always be provided. You can assume that the module will not recieve the protocols **closest-enemies** and **furthest-enemies** in the same request.

Finally, it's important to note that targets above a distance of *100m* are considered too far to be attacked and should be ignored.

Additional considerations
----------------------------

Our intelligence forces get new information and strategies every day, so it's fundamental that the generated code is easy mantainable and extendable. To do that, good practises such as **object oriented programming** and **testing** should be applied.

Given that this labour is crucial for the New Republic, we have provided several test cases that will at least verify that the algorithm works correctly.

You should have ```curl``` installed and run the command ```./tests.sh``` in your machine.

Delivery
--------

When the mission is over, it is required to compress all source files within this repository in a zip file named ```<username-en-github>_codetest2_seedtag.zip``` and send it via email to ```alianza@seedtag.com```

Good luck, **may the Force be with you**.

