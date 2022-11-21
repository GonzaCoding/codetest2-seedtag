Seedtag Codetest 2: Backend Engineer
====================================

![Tendrando Arms](http://vignette4.wikia.nocookie.net/starwars/images/c/cd/Tendrando_Arms.svg/revision/latest/scale-to-width-down/500?cb=20080311193640)

Beloved **Commander Lando Calrissian**

We appreciate your labour during all these years in Varn and Kessel for the new republic. It's widely known your ability in the creation of droids and armament. Because these reasons we need your help to finish the new combat droid *YVH* still missing targets to attact selection module.

The *YVH* modules have a sofisticated communication system between them by **API HTTP** requests.

The mission's objective is to develop a **HTTP endpoint** that receives **JSON** data and returns **JSON** data.

The visioin module will send a **POST** request to ```/radar``` with the information of its environment. The module you have to develop should return which are the coordinates of the visible objective which should be attacked.

A request body example could be:
```{"protocols":["avoid-mech"],"scan":[{"coordinates":{"x":0,"y":40},"enemies":{"type":"soldier","number":10}}]}```

  - ```protocols```: Protocol or list of protocols to be used to determinate which of the following points should be attacked first.
  - ```scan```: List of extracted points from the vision module. It's an array of points with the number of targets in that position. It has the following sub-values:
      + ```coordinates``` : Coordinates ```x``` and ```y``` of the point.
      + ```enemies``` : Enemy type ```type``` and number ```number```. The suitable values of type are **soldier** y **mech**.
      + (optional) ```allies``` : Number of allies on the position. If not present, means that no allies in the zone.

The answer should contain coordinates ```x``` and ```y``` and the following point to destroy.

An example of the response body for the previous example would be ```{"x":0,"y":40}```. Hence, our *YVH* combat droid would know which is the following element to destroy.

To determine which is the following point to be destroyed, selected protocols and act by the rules should be followed.

Available protocols:
-----------------------

 - **closest-enemies** : Closest point in which there are enemies should be prioritized.
 - **furthest-enemies** : Furthest point in which there are enemies should be prioritized.

 - **assist-allies** : Points with allies should be prioritized.
 - **avoid-crossfire** : No point with allies should be attacked.

 - **prioritize-mech** : *mech* should be attacked if found. Else, any other type of objective will be valid.
 - **avoid-mech** : Any *mech* should be attacked.

It's important to mention that several protocols could be provided in the request. As an example, if we receive the protocols **closest-enemies** and **assist-allies**, we should choose the closest point having allies present.

In any case compatible protocols between each other will be provided. You could assume that in any case the module will recieve the protocols **closest-enemies** and **furthest-enemies** in the same request.

Finally it's important having into account that the targets on a distance above *100m* are considered too far to be attacked so these points should be ignored.

Additional considerations:
----------------------------

Our intelligence forces get new information and strategies every day, so it's fundamental that the generated code is easy to mantain and extend. To do that good practises as **object oriented programming** and **testing** should be applied.

Given that this labour is crucial for the New Republic, we have provided several test cases that will at least verify that the algorithm works correctly.

You should have ```curl``` installed and run the command ```./tests.sh``` in your OSX or Linux machine.

Delivery:
--------

When the mission is over, it is required to compress all source files with this repository included in a zip file named ```<username-en-github>_codetest2_seedtag.zip``` and send it as email to ```alianza@seedtag.com```

Good luck, **may the Force be with you**.

