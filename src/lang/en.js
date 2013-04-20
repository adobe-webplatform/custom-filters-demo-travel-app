{
    "preloader" : {
        "headline" : "Travel Guide",
        "title" : "LOS ANGELES",
        "btn_text" : "Explore Content"
    },

    "routes" : [
        {
            "route" : "^\\/?$",
            "section" : "splash"
        },
        {
            "route" : "^home\\/?$",
            "section" : "home"
        },
        {
            "route" : "^home\\/mood\\/?$",
            "section" : "mood"
        },
        {
            "route" : "^home\\/(mood|location)\\/[A-Za-z-_!0-9]+\\/?$",
            "section" : "location-list"
        },
        {
            "route" : "^home\\/(mood|location)\\/[A-Za-z-_!0-9]+\\/[A-Za-z-_!0-9]+\\/?$",
            "section" : "overview"
        },
        {
            "route" : "^home\\/schedule\\/?$",
            "section" : "schedule"
        },
        {
            "route" : "^home\\/schedule\\/(events|my-plans)\\/?$",
            "section" : "schedule"
        },
        {
            "route" : "^home\\/schedule\\/(events|my-plans)\\/[A-Za-z-_!0-9]+\\/?$",
            "section" : "overview"
        },
        {
            "route" : "^home\\/search\\/?$",
            "section" : "location-list"
        },
        {
            "route" : "^home\\/search\\/[A-Za-z-_!0-9]+\\/?$",
            "section" : "location-list"
        },
        {
            "route" : "^home\\/search\\/[A-Za-z-_!0-9]+\\/[A-Za-z-_!0-9]+\\/?$",
            "section" : "overview"
        }
    ],

    "header" : {
        "home" : "Los Angeles"
    },

    "schedule_prompt" : {
        "events_title" : "Events",
        "my_plans_title" : "Schedule it",
        "default_note" : "Type your note here",
        "close" : "Close",
        "save" : "Save to Calendar",
        "cancel" : "Cancel"
    },

    "sections" : {
        "splash" : {
            "headline" : "Travel Guide",
            "title" : "Los Angeles",
            "btn_text" : "Explore Content"
        },
        "home" : {
            "items" : [
                {
                    "id" : "mood",
                    "name" : "Mood",
                    "link" : "home/mood",
                    "color" : "#df8052"
                },
                {
                    "id" : "schedule",
                    "name" : "Schedule",
                    "link" : "home/schedule",
                    "color" : "#7dac94"
                },
                {
                    "id" : "search",
                    "name" : "Search",
                    "link" : "home/search",
                    "color" : "#4f5b6c"
                }
            ]
        },
        "mood" : {
            "items" : [
                {
                    "id" : "do",
                    "name" : "Do",
                    "link" : "home/mood/do",
                    "color" : "#00bdd3",
                    "highlight_color" : "#00cfe7"
                },
                {
                    "id" : "see",
                    "name" : "See",
                    "link" : "home/mood/see",
                    "color" : "#63344b",
                    "highlight_color" : "#834664"
                },
                {
                    "id" : "buy",
                    "name" : "Buy",
                    "link" : "home/mood/buy",
                    "color" : "#b44437",
                    "highlight_color" : "#c74d3f"
                },
                {
                    "id" : "eat",
                    "name" : "Eat",
                    "link" : "home/mood/eat",
                    "color" : "#a4a730",
                    "highlight_color" : "#bbbe38"
                }
            ]
        },
        "schedule" : {
            "events" : {
                "title" : "Events",
                "prompt_btn" : "View",
                "link" : "schedule/events",
                "hue_from" : 142,
                "hue_to" : 55
            },
            "my_plans" : {
                "title" : "My Plans",
                "prompt_btn" : "Edit",
                "link" : "schedule/my-plans",
                "hue_from" : 18,
                "hue_to" : 62
            }
        },

        "location-list" : {
            "search-default" : "Type here what you are looking for",
            "result" : " Results",
            "colors" : [
                {
                    "id" : "home/mood/do",
                    "hue_from" : 209,
                    "hue_to" : 180
                },
                {
                    "id" : "home/mood/see",
                    "hue_from" : 357,
                    "hue_to" : 331
                },
                {
                    "id" : "home/mood/buy",
                    "hue_from" : 6,
                    "hue_to" : 40
                },
                {
                    "id" : "home/mood/eat",
                    "hue_from" : 82,
                    "hue_to" : 62
                },
                {
                    "id" : "default",
                    "hue_from" : 285,
                    "hue_to" : 170
                }
            ]
        },
        "overview" : {
            "logo-text" : "Los Angeles",
            "favorites" : "Favorites",
            "schedule" : "Schedule it"
        }
    },

    "schedules" : {
        "events" : [
            {
                "location_id" : "chinatown",
                "datetime" : "2013-04-10T12:00",
                "note" : "foobar"
            },
            {
                "location_id" : "geffencontemporary",
                "datetime" : "2013-04-11T12:00",
                "note" : "foobar"
            },
            {
                "location_id" : "engineco-no-28",
                "datetime" : "2013-04-12T12:00",
                "note" : "foobar"
            },
            {
                "location_id" : "japaneseamerican-national-museum",
                "datetime" : "2013-04-13T12:00",
                "note" : "foobar"
            },
            {
                "location_id" : "littletokyo",
                "datetime" : "2013-04-14T12:00",
                "note" : "foobar"
            },
            {
                "location_id" : "grammymuseum",
                "datetime" : "2013-04-14T13:00",
                "note" : "foobar"
            },
            {
                "location_id" : "thebradbury-building",
                "datetime" : "2013-05-17T12:00",
                "note" : "foobar"
            }
        ],
        "my_plans" : [
            {
                "location_id" : "chinatown",
                "datetime" : "2013-04-10T12:00",
                "note" : "foobar"
            },
            {
                "location_id" : "geffencontemporary",
                "datetime" : "2013-04-11T12:00",
                "note" : "foobar"
            },
            {
                "location_id" : "engineco-no-28",
                "datetime" : "2013-04-12T12:00",
                "note" : "foobar"
            },
            {
                "location_id" : "japaneseamerican-national-museum",
                "datetime" : "2013-04-13T12:00",
                "note" : "foobar"
            },
            {
                "location_id" : "littletokyo",
                "datetime" : "2013-04-14T12:00",
                "note" : "foobar"
            },
            {
                "location_id" : "grammymuseum",
                "datetime" : "2013-04-14T13:00",
                "note" : "foobar"
            },
            {
                "location_id" : "thebradbury-building",
                "datetime" : "2013-05-17T12:00",
                "note" : "foobar"
            }
        ]
    },

    "locations" : [
        {
            "id": "chinatown",
            "name": "Chinatown",
            "mood": "see",
            "description": "Primarily centered around North Broadway; unlike Chinatowns in many other cities, it hasa wide, main, busy street filled with small shops and restaurants. At about themiddle point of N. Broadway in Chinatown is an open market much likethose found in Hong Kong. Besure to haggle!",
            "image": "assets/images/locations/1.jpg",
            "like": 44
        },
        {
            "id": "littletokyo",
            "name": "Little Tokyo",
            "mood": "see",
            "description": "Also known as J-Town, the Japanese district features restaurants, museums, andshops. It sits in the area between Temple and about 5th and Spring throughAlameda.",
            "image": "assets/images/locations/1.jpg",
            "like": 80
        },
        {
            "id": "olverastreet",
            "name": "Olvera Street",
            "mood": "see",
            "description": "This is where LA was founded as El Pueblo de Los Angeles. You can take a tourof the city's oldest house to see what it looked like at that time. The plazais mostly filled with Mexican trinket stands and Mexican restaurants.",
            "image": "assets/images/locations/1.jpg",
            "like": 89
        },
        {
            "id": "museumof-contemporary-art-moca",
            "name": "Museumof Contemporary Art (MOCA)",
            "mood": "see",
            "description": "250 S. Grand Avenue, Los Angeles, CA, 90012, Tel: +1-213-626-6222. Th-M:11AM-5PM. The permanent collection is fairly interesting, but the changing exhibitionscan be more hit or miss. The museum has no 'traditional' art, so bring an openmind. The gift shop (free entrance) is fun for at least 20 minutes of wonderand awe. $12, $7 student (includes admission to Geffen Contemporary).",
            "image": "assets/images/locations/1.jpg",
            "like": 23
        },
        {
            "id": "geffencontemporary",
            "name": "Geffen Contemporary",
            "mood": "see",
            "description": "152N. Central Avenue, Los Angeles, CA, 90013. A branch of MOCA tucked away inLittle Tokyo. Same opening hours and shared tickets as MOCA on Grand.",
            "image": "assets/images/locations/1.jpg",
            "like": 20
        },
        {
            "id": "japaneseamerican-national-museum",
            "name": "Japanese American National Museum",
            "mood": "see",
            "description": "369E. First Street, Los Angeles, CA, 90012, Tel: +1-213-625-0414. Tu-Su:10AM-5PM. Covers the Japanese-American experience, with a special emphasis onthe concentration camps of World War II. $8.",
            "image": "assets/images/locations/1.jpg",
            "like": 54
        },
        {
            "id": "oldplaza-firehouse",
            "name": "Old Plaza Firehouse",
            "mood": "see",
            "description": "134Paseo de la Plaza, Tel: +1 213 625-3741. Tu-F: 10AM-3PM, Sa-Su: 10AM-4:30PM. Thiswas the original fire station for the City of Los Angeles. Built in 1884, ithas been restored to its original condition. The knowledgeable docents offer apeek into Los Angeles in the 19th Century. Free (donations accepted).",
            "image": "assets/images/locations/1.jpg",
            "like": 93
        },
        {
            "id": "grammymuseum",
            "name": "Grammy Museum",
            "mood": "see",
            "description": "800W. Olympic Boulevard (entrance on Figueroa St), Tel: +1-213-765-6800. M-F 11:30AM-7:30PM, Sa-Su 10AM-7:30PM. History of music, withlistening posts. Adult $12.95.",
            "image": "assets/images/locations/1.jpg",
            "like": 17
        },
        {
            "id": "fashioninstitute-of-design-amp-merchandising",
            "name": "Fashion Institute of Design & Merchandising",
            "mood": "see",
            "description": "(FIDM),919 S. Grand Avenue, Los Angeles, CA, 90015, Tel: +1-800-624-1200, +1-213-624-1201.Gorgeous campus of FIDM and ongoing free exhibits make this a pleasant way tokill a couple of hours.",
            "image": "assets/images/locations/1.jpg",
            "like": 40
        },
        {
            "id": "thelos-angeles-central-public-library",
            "name": "The Los Angeles Central Public Library",
            "mood": "see",
            "description": "630W. 5th Street, Los Angeles, CA, 90071, Tel: +1-213-228-7000. Hugelibrary rebuilt in the 1980s and '90s. Almost always has a public exhibitiongoing.",
            "image": "assets/images/locations/1.jpg",
            "like": 90
        },
        {
            "id": "musiccenter-and-disney-hall",
            "name": "Music Center and Disney Hall",
            "mood": "see",
            "description": "135N. Grand Avenue, Los Angeles, CA, 90012, Tel: +1-213-972-7211.Impressive hall architecture complete with tours most days. The DorothyChandler Pavilion is open to the public Christmas Eve day with almost round theclock performances by amateur cultural arts groups. The Walt Disney Hall hasdaily tours, check website for schedules.",
            "image": "assets/images/locations/1.jpg",
            "like": 93
        },
        {
            "id": "thebradbury-building",
            "name": "The Bradbury Building",
            "mood": "see",
            "description": "304South Broadway, Los Angeles, CA, 90013. Built in 1893, the Bradbury Building isone of Southern California's most remarkable architectural achievements. Behindits modest exterior lies a magical light-filled Victorian court that rises 50feet with open cage elevators, marble stairs and ornate iron railings. Thebuilding has been a set for many movies, including Blade Runner in 1982.Visitors without business in the building are allowed into the lobby and up tothe first landing of the staircase.",
            "image": "assets/images/locations/1.jpg",
            "like": 65
        },
        {
            "id": "thecathedral-of-our-lady-of-the-angels",
            "name": "The Cathedral of Our Lady of the Angels",
            "mood": "see",
            "description": "555W. Temple Street (between Grand Ave & Hill St), Tel: +1213 680-5200. 6:30AM-6PM M-F, 9AM-6PM, Sa 7AM-6PM Su, hours extended to 7PMduring daylight savings time. This large and austere cathedral, dedicated toSaint Vibiana, is the head of the Archdiocese of Los Angeles. It was opened in 2002at a cost of nearly $200 million, replacing The Cathedral of St Vibiana whichwas heavily damaged in the 1994 earthquake.",
            "image": "assets/images/locations/1.jpg",
            "like": 23
        },
        {
            "id": "librarytower",
            "name": "Library Tower",
            "mood": "see",
            "description": "(USBank Tower), 633 W. Fifth Street, Los Angeles, CA, 90071 (across FifthStreet from the downtown central library). At 73 floors and 1,017 feet, itis said to be the tallest building between Chicago and Hong Kong. Note tophotographers: the Library Tower's security personnel will try to discourageyou from taking pictures of this building. As long as you are standing on apublic sidewalk you may legally take any picture you like in the United States.",
            "image": "assets/images/locations/1.jpg",
            "like": 94
        },
        {
            "id": "stvincent-court",
            "name": "St. Vincent court",
            "mood": "see",
            "description": "7thStreet, between Broadway and Hill. A tranquil hideaway tucked in the heart ofthe Jewelry District.",
            "image": "assets/images/locations/1.jpg",
            "like": 53
        },
        {
            "id": "thetheater-district",
            "name": "The Theater District",
            "mood": "see",
            "description": "TheTheater District along Broadway has been converted to discount jewelry,electronics and ethnic shops, but much of the architecture and the marqueesremain.",
            "image": "assets/images/locations/1.jpg",
            "like": 46
        },
        {
            "id": "unionstation",
            "name": "Union Station.",
            "mood": "see",
            "description": "No trip to downtown LA would be complete without a visit to thehistoric train station, built in 1939 with a Spanish mission exterior. Thelarge waiting room and restaurant is like it was in the 1940s. It is used inlots of movies, including Blade Runner, where the main hall was used as thepolice station.",
            "image": "assets/images/locations/1.jpg",
            "like": 91
        },
        {
            "id": "theautry-in-griffith-park",
            "name": "The Autry in Griffith Park",
            "mood": "see",
            "description": "4700Western Heritage Way. Tu-F 10AM-4PM, Sa-Su 11AM-5PM. The Autry National Centerwas formed by the merger of the Autry Museum of Western Heritage with theSouthwest Museum of the American Indian and the Women of the West Museum. Adult$10.",
            "image": "assets/images/locations/1.jpg",
            "like": 90
        },
        {
            "id": "laderby-dolls",
            "name": "L ADerby Dolls",
            "mood": "see",
            "description": "1910Temple St. LA has revived a sport that peaked in the 1970s, and tickets toroller derby matches can be purchased by those 21 and over. The sport isprobably best summarized with a quote from the Derby Doll's own site:&quot;Quad Skates. Short Skirts. Scars.&quot; $15.",
            "image": "assets/images/locations/1.jpg",
            "like": 46
        },
        {
            "id": "griffithpark-observatory",
            "name": "Griffith Park Observatory",
            "mood": "see",
            "description": "2800East Observatory Road, Tel: +1 213-473-0800. Tu-F Noon-10PM,Sa-Su 10AM-10PM, closed Mondays. Reopened in 2006 after a long remodel;reservations are no longer necessary. Popular tourist attraction that featuresan extensive array of space- and science-related displays. The outside offers abeautiful panorama of the city of Los Angeles, especially stunning at night.",
            "image": "assets/images/locations/1.jpg",
            "like": 89
        },
        {
            "id": "graumanschinese-theater",
            "name": "Grauman's Chinese Theater",
            "mood": "see",
            "description": "6925Hollywood Boulevard, Tel: +1 323 464-8111. The most famousmovie theatre in the world, Grauman's Chinese Theatre opened in 1927 and ishome to the cement footprints, handprints, and (in some cases) otherprintsof many of history's most famous movie stars. The theatre is also a former homeof the Oscars, and today hosts many movie premieres. The forecourt thatshowcases the star's prints is free to all visitors. Movies are shown for $10,and half-hour walking tours are available for $5.",
            "image": "assets/images/locations/1.jpg",
            "like": 58
        },
        {
            "id": "hollywoodsign",
            "name": "Hollywood Sign",
            "mood": "see",
            "description": "Hollywood'smost recognizable landmark is easy to spot high up on Mount Lee in GriffithPark. You can drive part way up for a closer look, but you can't hike all theway to the sign.",
            "image": "assets/images/locations/1.jpg",
            "like": 58
        },
        {
            "id": "hollywoodwax-museum",
            "name": "Hollywood Wax Museum",
            "mood": "see",
            "description": "6767Hollywood Blvd (located along the Hollywood Walk of Fame), Tel: +1 323-462-8860. 10AM-midnight. The Hollywood Wax Museum is the longest runningwax museum in the United States, with more than 45 years of continuousoperation by the same owners since 1965 and featuring over 180 figures ofcelebrities. Adults (13+) $15.95, children $8.95, 5 and under free. Discountsonline.",
            "image": "assets/images/locations/1.jpg",
            "like": 34
        },
        {
            "id": "losangeles-fire-department-hollywood-museum-27",
            "name": "Los Angeles Fire Department Hollywood Museum 27",
            "mood": "see",
            "description": "1355N. Caheunga Boulevard, Tel: +1 323 464-2727. Sa: 10AM-4PM. Thismuseum is in the old Los Angeles City Fire Station 27, opened in 1930. It isfully restored to how it appeared in 1930 and contains historic fire apparatus.",
            "image": "assets/images/locations/1.jpg",
            "like": 85
        },
        {
            "id": "ripleysbelieve-it-or-not",
            "name": "Ripley's Believe it or Not",
            "mood": "see",
            "description": "6780Hollywood Blvd, Tel: +1 323-466-6335. Musuem that focuses on the odd, theunusual and the unbelievable. Features interactive illusions and a gallery.",
            "image": "assets/images/locations/1.jpg",
            "like": 13
        },
        {
            "id": "walkof-fame",
            "name": "Walkof Fame",
            "mood": "see",
            "description": "AlongHollywood Boulevard and also Vine Street. The Hollywood Walk of Fame consistsof a series of stars embedded in the sidewalk to commemorate famous movie,radio, theatre, and TV personalities. Since 1960, over two thousand stars havebeen immortalized; the schedule for upcoming star ceremonies is listed on theWalk of Fame's website.",
            "image": "assets/images/locations/1.jpg",
            "like": 11
        },
        {
            "id": "naturalhistory-museum-of-los-angeles-county",
            "name": "Natural History Museum of Los Angeles County",
            "mood": "see",
            "description": "900Exposition Boulevard, Exposition Park. Every day 9:30AM-5PM. A crown jewel ofLos Angeles' museums. A national leader in exhibitions, education and research,the Museum was L.A.'s first cultural institution to open its doors to thepublic in 1913. It is the largest natural and historical museum in the WesternUnited States, safeguarding more than 35 million spectacular, diverse specimensand artifacts. $12.",
            "image": "assets/images/locations/1.jpg",
            "like": 82
        },
        {
            "id": "californiascience-center",
            "name": "California Science Center",
            "mood": "see",
            "description": "700Exposition Park Drive, Exposition Park. Every day 10AM-5PM. Best times to visitare weekdays after 1:30PM or weekends. Weekdays to 1:30PM are often busy.Permanent exhibition galleries free.",
            "image": "assets/images/locations/1.jpg",
            "like": 98
        },
        {
            "id": "californiaafrican-american-museum",
            "name": "California African American Museum",
            "mood": "see",
            "description": "600State Drive, Exposition Park. Tu-Sa 10AM-5PM, Su 11AM-5PM. Free.",
            "image": "assets/images/locations/1.jpg",
            "like": 62
        },
        {
            "id": "wattstowers-of-simon-rodia",
            "name": "Watts Towers of Simon Rodia",
            "mood": "see",
            "description": "17interconnected structures, two of which reach heights of over 99 feet (30 m).An example of non-traditional vernacular architecture and naïve art. The Towersare located near and visible from the 103rd Street-Kenneth Hahn Station of theMetro Rail LACMTA Blue Line. Next to the Towers is a small museum and acultural center.",
            "image": "assets/images/locations/1.jpg",
            "like": 77
        },
        {
            "id": "leimertpark",
            "name": "Leimert Park",
            "mood": "see",
            "description": "Afamous center for Los Angeles' African-American culture, this neighborhood(just south of Crenshaw/Martin Luther King- accessible by bus) is a must-see ifin the area. A quick sidetrip into nearby Baldwin Hills offers beautiful viewsofDowntown Los Angelesas well as a nice peek at lifestyles in the &quot;Black Beverly Hills&quot;.",
            "image": "assets/images/locations/1.jpg",
            "like": 68
        },
        {
            "id": "theshrine-auditorium",
            "name": "The Shrine Auditorium",
            "mood": "see",
            "description": "Ahuge venue that holds the Emmy's and other award shows. Located on JeffersonBlvd and Figueroa Street across the street from the University of SouthernCalifornia, famous for its red bricks and nightlife. Closed to visitors.",
            "image": "assets/images/locations/1.jpg",
            "like": 29
        },
        {
            "id": "losangeles-memorial-coliseum",
            "name": "Los Angeles Memorial Coliseum",
            "mood": "see",
            "description": "3911South Figueroa Street. The current official capacity of the Coliseum is 92,516.This is where the opening ceremonies of the Olympics were held. It is locatedon the south side of USC.",
            "image": "assets/images/locations/1.jpg",
            "like": 37
        },
        {
            "id": "gettymuseum-center-and-villa",
            "name": "Getty Museum Center and Villa",
            "mood": "see",
            "description": "Eachwith their unusual architecture which houses an exceptional collection of art,sculptures, gardens and featuring innovative spaces that encourages interactionwith some of the exhibits, the Center and the Villa are a &quot;must sees&quot;for your visit to the west side. The Getty Center is located at 1200 GettyDrive, off the 405 Freeway. Admission is always free. It is open Tuesday thruSunday from 10:00AM to 6:00PM, with later hours on Friday and Saturday (openuntil 9:00PM); parking on-site is $8 and is subject to availability. The GettyVilla, is in beautiful Malibu at 17985 Pacific Coast Highway (PCH) andadmission is always free; advance, timed tickets are required for eachindividual and can be obtained online or by call 310/440-7300. On site parkingis available for all ticket holder for $8. No walk-ins are permitted except byshowing a bus receipt or transfer, along with a Villa ticket. Hours areThursday through Monday 10:00AM to 5:00PM.",
            "image": "assets/images/locations/1.jpg",
            "like": 15
        },
        {
            "id": "museumof-jurassic-technology",
            "name": "Museumof Jurassic Technology",
            "mood": "see",
            "description": "inCulver City has weird displaysof fiction and fact.",
            "image": "assets/images/locations/1.jpg",
            "like": 12
        },
        {
            "id": "piersof-santa-monica",
            "name": "Piersof Santa Monica",
            "mood": "see",
            "description": "Endof Colorado Blvd. and Venice, end of Washington Blvd. Santa Monica Pieroffers restaurants, the famous merry-go-round, and Pacific Park rides andamusements, an aquarium and exciting events. Open daily year-round. The VenicePier offers fishing and of course, the famouse waterfront Boardwalk.",
            "image": "assets/images/locations/1.jpg",
            "like": 30
        },
        {
            "id": "westwoodvillage",
            "name": "Westwood Village",
            "mood": "see",
            "description": "Anarea southwest of UCLA (405 Freeway at Wilshire Blvd.) is known for it'seclectic shopping, theater premiers and of course, the UCLA Bruins. The LosAngeles National Cemetery and Veterans Administration Center is also located inWestwood.",
            "image": "assets/images/locations/1.jpg",
            "like": 57
        },
        {
            "id": "rodeodrive-and-beverly-drive",
            "name": "Rodeo Drive and Beverly Drive",
            "mood": "see",
            "description": "Famousstreets in Beverly Hills, very pleasant to walk through",
            "image": "assets/images/locations/1.jpg",
            "like": 41
        },
        {
            "id": "losangeles-county-museum-of-art-lacma",
            "name": "Los Angeles County Museum of Art (LACMA)",
            "mood": "see",
            "description": "5905Wilshire Boulevard, Tel: +1-323-857-6000. M/T/Th: 12:00pm-8:00pm, F:12:00pm-9:00pm, Sat/Sun: 11:00am-8:00pm. Has great permanent and changingexhibitions. $15.",
            "image": "assets/images/locations/1.jpg",
            "like": 25
        },
        {
            "id": "pagemuseum",
            "name": "Page Museum",
            "mood": "see",
            "description": "PageMuseum at the La Brea Tar Pits, 5801 Wilshire Boulevard, Tel: +1-323-934-PAGE (7243). 9:30AM-5PM daily. Displays fossils of animals –including saber-toothed cats, dire wolves and mammoths – That got stuck in tarpits during the Ice Age 10,000 to 40,000 years ago. Visitors can watch fossilsbeing prepared. The Pleistocene Garden in Hancock Park, outside the Museum, haslife-size replicas of extinct mammals. Adults $11. Free 1st Tu of the month,except July and August.",
            "image": "assets/images/locations/1.jpg",
            "like": 51
        },
        {
            "id": "petersenautomotive-museum",
            "name": "Petersen Automotive Museum",
            "mood": "see",
            "description": "6060Wilshire Boulevard. Tu-Su: 10:00am-6:00pm. Has a great display of rare cars.Adults: $12, Seniors (62+): $8, Students: $5, Children (5-12): $3, ActiveMilitary (w/ ID), Children (-5), Museum Members: free.",
            "image": "assets/images/locations/1.jpg",
            "like": 11
        },
        {
            "id": "apexfine-art",
            "name": "Apex Fine Art",
            "mood": "see",
            "description": "152N. La Brea Avenue, Los Angeles, CA, 90036, Tel: +1-323-634-7887",
            "image": "assets/images/locations/1.jpg",
            "like": 73
        },
        {
            "id": "faheykleingallery",
            "name": "Fahey/ KleinGallery",
            "mood": "see",
            "description": "148N. La Brea Avenue, Los Angeles, CA, 90036, Tel: +1-323-934-2250. Home ofsome great photographers, such as Herb Ritts",
            "image": "assets/images/locations/1.jpg",
            "like": 23
        },
        {
            "id": "jankessner-gallery",
            "name": "Jan Kessner Gallery",
            "mood": "see",
            "description": "164N. La Brea Avenue, Los Angeles, CA, 90036, Tel: +1-323-938-6834",
            "image": "assets/images/locations/1.jpg",
            "like": 19
        },
        {
            "id": "paulkopeiken-gallery",
            "name": "Paul Kopeiken Gallery",
            "mood": "see",
            "description": "138N. La Brea Avenue, Los Angeles, CA, 90036, Tel: +1-323-937-0765",
            "image": "assets/images/locations/1.jpg",
            "like": 86
        },
        {
            "id": "arroyoseco-historic-parkway",
            "name": "Arroyo Seco Historic Parkway",
            "mood": "do",
            "description": "(110Freeway), (starts at the intersection of the CA-110 and the CA-101,heading north from that junction), [33]. Drive the Parkway, aNational Scenic Byway that runs for 9.4 miles (15.1 km) between Downtown LosAngeles and Pasadena. The Parkway passes from the skyscrapers of Downtown,through Chinatown into the Arts-and-Crafts style neighborhoods of South Pasadenaand ends in Pasadena at Colorado Blvd., home to the famous Rose Parade.",
            "image": "assets/images/locations/1.jpg",
            "like": 13
        },
        {
            "id": "angelsflight",
            "name": "Angel'sFlight",
            "mood": "do",
            "description": "351South Hill Street (on the north side of Grand Central Market), [34]. 6:45am-10pm. Ride the world'sshortest railway - at only 298'(91m) long, Angel's Flight is functionally anelevator which takes you from Hill Street to California Plaza on Grand Ave. Foronly 50 cents! $0.50.",
            "image": "assets/images/locations/1.jpg",
            "like": 37
        },
        {
            "id": "downtownart-walk",
            "name": "DowntownArt Walk",
            "mood": "do",
            "description": "Afree monthly self guided tour--and free walking tours, reservations required--heldon the second Thursday of every month, to art galleries and museums in DowntownL.A.",
            "image": "assets/images/locations/1.jpg",
            "like": 60
        },
        {
            "id": "laconservancy-walking-tours",
            "name": "L. A.Conservancy Walking Tours",
            "mood": "do",
            "description": "Seethe grand Vaudeville/Movie theaters of the 20s and the impressive Art Decooffice buildings in several easy to handle walking tours. Strongly recommendedfor those wanting to grasp a feel of LA's history. Reservations are stronglyrecommended.",
            "image": "assets/images/locations/1.jpg",
            "like": 42
        },
        {
            "id": "lasangelitas-del-pueblo",
            "name": "Las Angelitas del Pueblo",
            "mood": "do",
            "description": "Thisis a group of volunteer docents who give free tours of El Pueblo de Los Angelesto the public.",
            "image": "assets/images/locations/1.jpg",
            "like": 21
        },
        {
            "id": "raymondchandlers-los-angeles-in-a-lonely-place-bus-tour",
            "name": "Raymond Chandler's Los Angeles: In A Lonely Place bus tour",
            "mood": "do",
            "description": "Anoccasional bus tour of sites downtown and in Hollywood from the films, booksand lives of Raymond Chandler and his anti-hero Philip Marlowe. $58, includessnacks.",
            "image": "assets/images/locations/1.jpg",
            "like": 31
        },
        {
            "id": "thereal-black-dahlia-bus-tour",
            "name": "The Real Black Dahlia bus tour",
            "mood": "do",
            "description": "Atrue crime and social history tour that intimately explores the last weeks ofElizabeth Short's life, asking not &quot;who killed her?&quot; but &quot;whowas she?&quot; $58.",
            "image": "assets/images/locations/1.jpg",
            "like": 37
        },
        {
            "id": "johnfantes-dreams-of-bunker-hill-bus-and-walking-tour",
            "name": "John Fante's Dreams of Bunker Hill bus and walking tour",
            "mood": "do",
            "description": "Anoccasional bus and walking tour of sites downtown and in Hollywood from thelife and work of novelist John Fante and his great fan Charles Bukowski, pluscrime scenes from forgotten horrors of old Bunker Hill, Sonora Town and beyond.$58, includes snacks.",
            "image": "assets/images/locations/1.jpg",
            "like": 41
        },
        {
            "id": "staplescenter",
            "name": "Staples Center",
            "mood": "do",
            "description": "Hometo five of LA's pro sports franchises; Lakers (NBA), Kings (NHL), Clippers(NBA), Avengers (AFL), and Sparks (WNBA), plus many concerts, shows andconventions.",
            "image": "assets/images/locations/1.jpg",
            "like": 71
        },
        {
            "id": "dodgerstadium",
            "name": "Dodger Stadium",
            "mood": "do",
            "description": "Hometo the Los Angeles Dodgers, Major League Baseball franchise of the NationalLeague.",
            "image": "assets/images/locations/1.jpg",
            "like": 62
        },
        {
            "id": "losangeles-memorial-coliseum",
            "name": "Los Angeles Memorial Coliseum",
            "mood": "do",
            "description": "Hometo the University of Southern California Trojans NCAA football team, members ofthe Pacific Twelve conference. Site was host to the Olympics in 1932 and 1984,the home to LA's former NFL franchises the Los Angeles Rams and Raiders from1946-1979 and 1982-1994 respectively, and the home of UCLA football until 1982,when they moved to the Rose Bowl.",
            "image": "assets/images/locations/1.jpg",
            "like": 70
        },
        {
            "id": "echopark",
            "name": "Echo Park",
            "mood": "do",
            "description": "Anice lakeside park which is good for picnics, but is frequently very crowded.The area is a hub for underground/indie culture and houses a number of venues.",
            "image": "assets/images/locations/1.jpg",
            "like": 30
        },
        {
            "id": "elcid-theatre",
            "name": "El Cid Theatre",
            "mood": "do",
            "description": "Wasbuilt around turn of the century and, after several reincarnations, offers oneof the only dinner theatre options left in Los Angeles. The menu is heavilySpanish and the shows differ depending on the night and range from flamencoperformances to tongue-in-cheek burlesque.",
            "image": "assets/images/locations/1.jpg",
            "like": 15
        },
        {
            "id": "griffithpark",
            "name": "Griffith Park",
            "mood": "do",
            "description": "Alarge municipal park at the eastern end of the Santa Monica Mountains in LosFeliz. The park covers 4,210 acres of land, making it one of the largest urbanparks in North America. It has also been referred to as the Central Park of LosAngeles, but it is much larger and with a much more untamed, rugged character.",
            "image": "assets/images/locations/1.jpg",
            "like": 64
        },
        {
            "id": "macarthurpark",
            "name": "MacArthurPark",
            "mood": "do",
            "description": "Hasbeen famous for a long time, starting with Charlie Chaplin. Chaplin made severalfilms at the lake here, which was one of his favorite places. More recently itsreputation was tainted by perceptions of violence and drug use, but the parkhas been cleaned up over the last few years, and is once again a nice place tovisit. Take a paddle boat out on the small lake or watch one of theever-present soccer matches.",
            "image": "assets/images/locations/1.jpg",
            "like": 60
        },
        {
            "id": "silverlake-reservoir",
            "name": "Silver Lake Reservoir",
            "mood": "do",
            "description": "Encompassedby a nice walking and jogging path. Just over 2 miles long, it offers abeautiful way to get outdoors.",
            "image": "assets/images/locations/1.jpg",
            "like": 35
        },
        {
            "id": "thevista-theatre",
            "name": "The Vista Theatre",
            "mood": "do",
            "description": "AnLA landmark, is a large cinema with one screen, typically screening popularfilms.",
            "image": "assets/images/locations/1.jpg",
            "like": 50
        },
        {
            "id": "barnsdallart-park",
            "name": "Barnsdall Art Park",
            "mood": "do",
            "description": "4800Hollywood Blvd. A small hill with sweeping views and a Frank Lloyd Wrightcomplex on top serves as an art park for the community.",
            "image": "assets/images/locations/1.jpg",
            "like": 30
        },
        {
            "id": "dolbytheatre",
            "name": "DolbyTheatre",
            "mood": "do",
            "description": "6801Hollywood Bld, Tel: +1 323 308-6300. Located at the Hollywood & HighlandCenter (see &quot;Buy&quot; below). Hosts a wide range of live performances,including the annual Academy Awards.",
            "image": "assets/images/locations/1.jpg",
            "like": 24
        },
        {
            "id": "hollywoodbowl",
            "name": "HollywoodBowl",
            "mood": "do",
            "description": "2301North Highland Avenue, Tel: +1 323 426-2829. America's mostfamous outdoor theatre hosts the Los Angeles Philharmonic Orchestra as well asnumerous other concert events. Traffic and parking can be a nightmare, so the$5 round-trip public shuttles [14] are highlyrecommended.",
            "image": "assets/images/locations/1.jpg",
            "like": 48
        },
        {
            "id": "cemeterymovie-screenings",
            "name": "Cemetery Movie Screenings",
            "mood": "do",
            "description": "HollywoodForever Cemetery, 6000 Santa Monica Blvd. Saturdays at 7PM, May-September. TheCinespia film society screens creepy older movies (recent showings include TheShining, Pee Wee's Big Adventure and Invasion of the BodySnatchers) every Saturday during the summer in the Hollywood ForeverCemetery, with most proceeds going toward cemetery restoration. Crowds can behuge, so arrive prior to gates opening if you want a good vantage point. Mostpeople bring a picnic dinner, blanket and jacket, and a DJ plays music prior tothe showing to create a fun outdoor atmosphere. Parking is free within thecemetery, but a $10 donation is required for each person.",
            "image": "assets/images/locations/1.jpg",
            "like": 57
        },
        {
            "id": "mulhollanddrive",
            "name": "MulhollandDrive",
            "mood": "do",
            "description": "MulhollandDrive (Hollywood Hills). If you have a car, it is worth driving up toMulholland Drive - the home of the stars. Apart from star seeking, the viewsacross Los Angeles and San Fernando Valley are breathtaking.",
            "image": "assets/images/locations/1.jpg",
            "like": 29
        },
        {
            "id": "studiotours",
            "name": "Studio Tours",
            "mood": "do",
            "description": "WarnerBrothers, NBC and Disney studios are all headquartered in Burbank, and all (except Disney)offer some kind of public tour. Universal Studios is in Universal City. CBS studiosis in Studio City but doesnot offer public tours.",
            "image": "assets/images/locations/1.jpg",
            "like": 76
        },
        {
            "id": "shopping",
            "name": "Shopping",
            "mood": "do",
            "description": "Forsheer length and diversity, Ventura Blvd. in the San Fernando Valley wouldsatiate any shopping need in its 10-mile stretch. The Metro Rapid 750 bus isthe best way to explore the boulevard if you choose not to drive.",
            "image": "assets/images/locations/1.jpg",
            "like": 25
        },
        {
            "id": "universityof-southern-california",
            "name": "Universityof Southern California",
            "mood": "do",
            "description": "Hostsmany musical and theatrical performances throughout the year that are free orcheap. USC football games are one option. Tickets can be purchased on campus atthe Ticket Office next to Tommy Trojan, but can sometimes be hard to come by.",
            "image": "assets/images/locations/1.jpg",
            "like": 71
        },
        {
            "id": "baptistor-ame-african-american-church",
            "name": "Baptist(or AME) African-American Church",
            "mood": "do",
            "description": "Fora peek into local spiritual culture.",
            "image": "assets/images/locations/1.jpg",
            "like": 37
        },
        {
            "id": "leimertpark-coffee-shop",
            "name": "Leimert Park coffee shop",
            "mood": "do",
            "description": "Atnight for some spoken word or freestyle rap.",
            "image": "assets/images/locations/1.jpg",
            "like": 58
        },
        {
            "id": "thestrand",
            "name": "The Strand",
            "mood": "do",
            "description": "Abike and skate path on the beach stretches from upper Santa Monica in the northall the way to Redondo Beachin the SouthBay and ends at Torrance Beach. It passes by many interesting places, suchas the Marina del Rey waterfront area with it's boats and numerous restaurants,the Venice Beach shops, and Santa Monica pier.",
            "image": "assets/images/locations/1.jpg",
            "like": 13
        },
        {
            "id": "marinadel-reys-fishermans-village",
            "name": "Marinadel Rey's Fisherman's Village",
            "mood": "do",
            "description": "Takea trip to New England without ever leaving the Westside! This replica of a NewEngland seaport and fishing town is the place to go to get out on the water.There are several companies to rent boats -- both sail and motor, kayaks,wind-surfboards and more. Charter a harbor cruise or reserve your place on oneof the public dinner cruises or Sunday Champagne Brunch cruises. Or join one ofthe exciting fishing adventures with Marina del Rey Sportfishing's open party trips.Both 1/2 day and 3/4 day trips are available with rod rentals, tackle, bait andfishing licenses available. Enjoy waterfront dining, shop for souvenirs, orstroll along the cobblestone paths to enjoy views of the Marina. On theweekends (weather permitting) there are free outdoor concerts in the LighthousePlaza area.",
            "image": "assets/images/locations/1.jpg",
            "like": 68
        },
        {
            "id": "beach",
            "name": "Beach",
            "mood": "do",
            "description": "FromMalibu north to Playa del Rey south, these are some of the most filmed beachesin the world.",
            "image": "assets/images/locations/1.jpg",
            "like": 65
        },
        {
            "id": "venicecanals",
            "name": "Venice Canals",
            "mood": "do",
            "description": "(parkon Dell near Washington Blvd.) and see some of the most interestingarchitecture and local gardens that the Westside has to offer.",
            "image": "assets/images/locations/1.jpg",
            "like": 76
        },
        {
            "id": "marinadel-reys-fishermans-village",
            "name": "Marinadel Rey's Fisherman's Village",
            "mood": "do",
            "description": "Renta boat -- sail or motor, kayak or wind surfboard. Join an open party sportfishing excursion for 1/2 or 3/4 day, with rod rentals, tackle, bait andfishing licenses available. Or book a weekend dinner cruise or Sunday ChampagneBrunch cruise. Or charter your own adventure with one of the many privatecharter companies.",
            "image": "assets/images/locations/1.jpg",
            "like": 40
        },
        {
            "id": "losangeles-beaches-bike-trail",
            "name": "Los Angeles Beaches Bike Trail",
            "mood": "do",
            "description": "Over22 miles of a paved bike path streching from Will Rogers State Beach north, toTorrance Beach south. With numerous outlets for renting bikes, rest stops andfood concessions this gentle, fairly flat path is an easy ride for the entirefamily.",
            "image": "assets/images/locations/1.jpg",
            "like": 15
        },
        {
            "id": "ballonafreshwater-marsh",
            "name": "Ballona Freshwater Marsh",
            "mood": "do",
            "description": "This51-arce marsh system is at the base of the Westchester Bluffs, just south ofMarina del Rey. Home to more than 73 native bird species it is an urban oasisfor people and wildlife alike. There are trails bordering the marsh, with aprofusion of native trees and shrubs where you can see mallard ducks, snowyegret and great blue herons. Located at the southwest corner of Lincoln andJefferson Boulevards.",
            "image": "assets/images/locations/1.jpg",
            "like": 84
        },
        {
            "name": "Fashion District",
            "mood": "buy",
            "description": "Wherestyle and cheap textiles smash together. Important for the addicted shopper.You can find the district in the Southeast corner of Downtown roughly whereSpring and Main meet going Southeast.",
            "image": "assets/images/locations/1.jpg",
            "like": 31,
            "id": "fashiondistrict"
        },
        {
            "name": "Flower District",
            "mood": "buy",
            "description": "(766Wall Street} The best place to get the best cut and potted flowers andplants, plus just a great site to see.",
            "image": "assets/images/locations/1.jpg",
            "like": 29,
            "id": "flowerdistrict"
        },
        {
            "name": "Jewelry District",
            "mood": "buy",
            "description": "Wonderwhere all of those West Coast Rappers get their bling bling? Well, if they arefrugal, they get it in the Jewelry District. Bounded by Olive-Broadway and6th-7th, it is conveniently close to Pershing Square (parking and Red lineaccess).",
            "image": "assets/images/locations/1.jpg",
            "like": 59,
            "id": "jewelrydistrict"
        },
        {
            "name": "Mikawaya",
            "mood": "buy",
            "description": "(800E. 4th St. Little Tokyo), Their moto says it best: &quot;The finest name inJapanese pastries since 1910&quot;",
            "image": "assets/images/locations/1.jpg",
            "like": 94,
            "id": "mikawaya"
        },
        {
            "name": "Capucci Optics",
            "mood": "buy",
            "description": "(7th+FigMall), Great place to get a pair of great glasses, sunglasses or contactsat a reasonable price. Ask for Fatima for friendly service.",
            "image": "assets/images/locations/1.jpg",
            "like": 92,
            "id": "capuccioptics"
        },
        {
            "name": "Santee Alley",
            "mood": "buy",
            "description": "(FashionDistrict), Home of knock off designer labels and everything else you couldpossibly imagine, located between Santee Street and Maple Avenue, starting onOlympic Boulevard.",
            "image": "assets/images/locations/1.jpg",
            "like": 14,
            "id": "santeealley"
        },
        {
            "name": "Los Feliz Village",
            "mood": "buy",
            "description": "Ahip and trendy strip of N. Vermont Ave, with shops such as X-Large,Weltenbuerger, and Squaresville.",
            "image": "assets/images/locations/1.jpg",
            "like": 82,
            "id": "losfeliz-village"
        },
        {
            "name": "Sunset Junction",
            "mood": "buy",
            "description": "(roughlySunset Blvd. and Santa Monica Blvd.) in Silverlake has long been known forcheap furniture and antique shops, and now is home to several trendy clothingstores and some good restaurants and cafés. It's also the center of asummertime street fair of the same name known for its indie rock shows.",
            "image": "assets/images/locations/1.jpg",
            "like": 13,
            "id": "sunsetjunction"
        },
        {
            "name": "Beverly Center",
            "mood": "buy",
            "description": "8500Beverly Center. This shopping center includes 200 stores over 8 differentlevels. Great view of the city from the top floor of the mall.",
            "image": "assets/images/locations/1.jpg",
            "like": 17,
            "id": "beverlycenter"
        },
        {
            "name": "The Grove",
            "mood": "buy",
            "description": "189The Grove Drive, Tel: (888) 315-8883. Shopping and entertainment complex thatwill appeal to tourists that want to shop, while locals stop by to pick upfresh produce from the nearby Farmers Market.",
            "image": "assets/images/locations/1.jpg",
            "like": 60,
            "id": "thegrove"
        },
        {
            "name": "Hollywood& Highland Center",
            "mood": "buy",
            "description": "6801Hollywood Boulevard. Home of the Dolby Theatre (where the Oscars are held) andGrauman's Chinese Theatre, the 387,000-square-foot Hollywood & Highlandcenter is also a major shopping destination.",
            "image": "assets/images/locations/1.jpg",
            "like": 34,
            "id": "hollywoodamp-highland-center"
        },
        {
            "name": "Amoeba Music",
            "mood": "buy",
            "description": "6400Sunset Blvd, Tel: +1 323-245-6400. The country's largest independent musicstore, Amoeba has three locations including Hollywood, Berkeley and San Francisco. Prices areslightly higher than at the discount stores, but the selection is enormous andjust about any obscure record you could imagine is to be found somewhere on theshelves.",
            "image": "assets/images/locations/1.jpg",
            "like": 96,
            "id": "amoebamusic"
        },
        {
            "name": "Decades",
            "mood": "buy",
            "description": "8214Melrose Ave, Tel: (323) 655-1960. This Melrose Avenue shop is the place togo for vintage 1960s and 1970s couture and accessories.",
            "image": "assets/images/locations/1.jpg",
            "like": 16,
            "id": "decades"
        },
        {
            "name": "Frederick'sof Hollywood",
            "mood": "buy",
            "description": "6751Hollywood Blvd., Tel: (323) 957-5953. During the golden years of Hollywood, allthe superstars were wearing Fredericks, from Greta Garbo to Mae West to MarilynMonroe. Today, the store is a lot less polished but still a good place to pickup glamorous lingerie.",
            "image": "assets/images/locations/1.jpg",
            "like": 22,
            "id": "fredericksof-hollywood"
        },
        {
            "name": "I PEDFoot Spa",
            "mood": "buy",
            "description": "6767Sunset Blvd Suite 22 (Sunset & Highland), Tel: 323-466-1038. 11am-10pm. 6767 Sunset blvd (cross road highland). Easy to reachlocation. If you are tired of walking a long day in Hollywood. Iped offers 1hour foot massage for as less as $25. 25+.",
            "image": "assets/images/locations/1.jpg",
            "like": 73,
            "id": "ipedfoot-spa"
        },
        {
            "name": "Monsier Marcel",
            "mood": "buy",
            "description": "6333W 3rd St, Tel: +1 (323) 939 7792. If you enjoy cheese and wine, thenyou'll love shopping here! Monsier Marcel is a delightful French deli in theFarmers Markets on 3rd Avenue where you can stock up on a range of gourmetproduce, but most importantly there's over 500 vintage of wine on offer with arange of experienced staff to help you make your decisions.",
            "image": "assets/images/locations/1.jpg",
            "like": 38,
            "id": "monsiermarcel"
        },
        {
            "id": "cliftonscafeteria",
            "name": "Clifton's Cafeteria",
            "mood": "eat",
            "description": "648S. Broadway, Los Angeles, CA, 90014 (Downtown), Tel: +1-213-627-1673. Daily: 6:30AM-7:30PM. Since 1935, located on Broadway, servescafeteria style food. One should experience the history, the food at affordableprices, and of course view the redwood forest theme. (currently closed forrenovations)",
            "image": "assets/images/locations/1.jpg",
            "like": 44
        },
        {
            "id": "colespacific-electric-buffet",
            "name": "Cole's Pacific Electric Buffet",
            "mood": "eat",
            "description": "118E. 6th Street, Los Angeles, CA, 90014 (on 6th, between Main and Los Angeles),Tel:+1-213-622-4090. Daily: 9AM-10PM. Bar/restaurant in nearly continuous operationsince 1908, but recently shut for a year and a extensive upscale redesign.Along with Philippe The Original, one of the possible originators of the FrenchDip sandwich.",
            "image": "assets/images/locations/1.jpg",
            "like": 93
        },
        {
            "id": "empresspavilion",
            "name": "Empress Pavilion",
            "mood": "eat",
            "description": "988N. Hill Street, Los Angeles, CA, 90012 (Chinatown), Tel: +1-213-617-9898. Most people come here for the dim sum on carts butthere is also a menu.",
            "image": "assets/images/locations/1.jpg",
            "like": 52
        },
        {
            "id": "famima",
            "name": "Famima",
            "mood": "eat",
            "description": "(Variouslocations Downtown). Daily: 6:00AM-10:00PM, some are 24 hr. Famima is aconvenience store similar to 7-11 but with a fantastic selection of prepackagedlunches, snacks, drinks and fresh fruit. Has a selection of asian drinks,candies, and even hot pork buns at the front counter. $2-$10.",
            "image": "assets/images/locations/1.jpg",
            "like": 22
        },
        {
            "id": "fryingfish",
            "name": "Frying Fish",
            "mood": "eat",
            "description": "120Japanese Village Plaza (Little Tokyo), Tel: 213-680-0567. Sushi restaurant with a food conveyor belt built into the bar,located in the Japanese village. Don't miss the excellent California roll!",
            "image": "assets/images/locations/1.jpg",
            "like": 70
        },
        {
            "id": "grandcentral-market",
            "name": "Grand Central Market",
            "mood": "eat",
            "description": "317S. Broadway, Los Angeles, CA, 90013, Tel: +1-213-624-2378. Daily 9AM-6PM. Hugeindoor bazaar of Central and South American vendors. Get fresh tortillas, hugeMexican papayas and tasty Tortas. On Hill and Broadway between 3rd and 4th(closer to 3rd). Conveniently near the Bradbury Building (unique architecture)and the Pershing Square Red line stop (Northeast access).",
            "image": "assets/images/locations/1.jpg",
            "like": 61
        },
        {
            "id": "theoriginal-pantry-cafe",
            "name": "The Original Pantry Cafe",
            "mood": "eat",
            "description": "877S. Figueroa Street, Los Angeles, CA, 90017, Tel: +1-213-972-9279. ThePantry boasts that it has never closed or been without a customer since itfirst opened in 1924. (Want proof? The front entrance has no lock on it). Comehere on any morning and you will see a line stretching around the block - thewait is worth it, and the fast service will have hot plate of food in front ofyou within minutes of sitting down. Best place for breakfast after midnight.Cash only.",
            "image": "assets/images/locations/1.jpg",
            "like": 38
        },
        {
            "id": "originaltommys",
            "name": "Original Tommy's",
            "mood": "eat",
            "description": "2575W. Beverly Blvd, Los Angeles, CA, 90057 (On the corner of Beverly andRampart just west of Downtown Los Angeles), Tel: +1-213-389-9060. Open 24 hours/7 days a week. A Los Angeles landmark since 1946Tommy's is a can't-miss for any hamburger lover. Serving hamburgers, frenchfries, hot dogs, and tamales with their &quot;secret blend&quot; of chili youwill always find a line for food at all hours, especially late night/earlymornings.",
            "image": "assets/images/locations/1.jpg",
            "like": 33
        },
        {
            "id": "philippes",
            "name": "Philippe's",
            "mood": "eat",
            "description": "1001N. Alameda Street, Los Angeles, CA, 90012 (Chinatown, one block from UnionStation), Tel: +1-213-628-3781. Daily: 6AM-10PM. Aaaah...an LA landmarksituated a couple of blocks north of Olvera St. and Union Station is anostalgic shop with hay and sawdust covered floors. Famous for their 'FrenchDip' sandwiches dipped in au jus ($4.90), but the real reason to go is theatmosphere and the pastrami — the joint opened in 1908 and the menu stillfeatures things like pickled eggs and pig's feet. Coffee is ten cents a cup,but their 60-cent lemonade is even more popular. Expect to queue at any timeand the place is mobbed on the nights of Lakers and Dodgers games.",
            "image": "assets/images/locations/1.jpg",
            "like": 51
        },
        {
            "id": "senorfish",
            "name": "Señor Fish",
            "mood": "eat",
            "description": "422E 1st Street, Los Angeles, CA, 90012, Tel: +1-213-625-0566. Not reallyauthentic -- it's sort of a variation on Baja-style Mexican -- Senor Fishdowntown does just one thing well, but they do it better than anyone. Luckily,that one thing is an important thing: grilled fish tacos. Grilled, not fried.Their Shrimp Taco is amazing as well.",
            "image": "assets/images/locations/1.jpg",
            "like": 86
        },
        {
            "id": "springstreet-smokehouse",
            "name": "Spring Street Smokehouse",
            "mood": "eat",
            "description": "640N. Spring Street, Los Angeles, CA 90012 (in China Town, on Cesar Chavez andNorth Spring), Tel: +1-213-626-0535. M-Tu: 10:30AM-8PM, Wednesday-Friday:10:30AM-9PM, Sat: 12PM-9PM. The best barbecue in town. 27 microbrews.",
            "image": "assets/images/locations/1.jpg",
            "like": 74
        },
        {
            "id": "weilandbrewery",
            "name": "Weiland Brewery",
            "mood": "eat",
            "description": "400E. 1st Street, Los Angeles, CA, 90012 (in Little Tokyo, on Central and First),Tel:+1-213-680-2881. M-F: 11AM-2AM, Sat: 5PM-2AM. The cheese fries are to die for.Very affordable place for drinks. One of the few bars with a weekend happy hourlasting until 2AM",
            "image": "assets/images/locations/1.jpg",
            "like": 89
        },
        {
            "id": "engineco-no-28",
            "name": "Engine Co. No. 28",
            "mood": "eat",
            "description": "(FigueroaCorridor). Comfort food at its best. A restored actual fire station thatchurns out LA's best meatloaf, fried chicken and lemonade, all in an elegantatmosphere with great service.",
            "image": "assets/images/locations/1.jpg",
            "like": 45
        },
        {
            "id": "jrestaurant-amp-lounge",
            "name": "J Restaurant & Lounge",
            "mood": "eat",
            "description": "1119S. Olive St (at 11th St), Tel: +1-800-850-6074. Dining andentertainment, located near the Staples Center. The vibe is equal parts hip andcasual; the large space has a glitzy lounge, featuring live music, and a megapatio with fire pit and skyline views of the city. Inspired décor. Menu isMediterranean-meets-American.",
            "image": "assets/images/locations/1.jpg",
            "like": 44
        },
        {
            "id": "kendallsbrasserie",
            "name": "Kendall's Brasserie",
            "mood": "eat",
            "description": "135N. Grand Ave (at the Music Center), Tel: +1-213-972-7322. GreatFrench menu at a perfect location to catch any of the great evening programs atthe surrounding venues. Whatever you order, do not miss their French Fries!Mains from $15.",
            "image": "assets/images/locations/1.jpg",
            "like": 29
        },
        {
            "id": "thenickel-diner",
            "name": "The Nickel Diner",
            "mood": "eat",
            "description": "(OldBank district), 524 S Main St (between 5th & 6th). 8am-3pm,6pm-10:30pm, closed Mondays. early 1900s style diner, lots of choices forbreakfast (try the polenta, or the mountain of french toast) and home ofnovelty pastries - bacon donuts, homemade pop tarts! Open for lunch &dinner, too. $7-$15.",
            "image": "assets/images/locations/1.jpg",
            "like": 79
        },
        {
            "id": "riordanstavern",
            "name": "Riordan's Tavern",
            "mood": "eat",
            "description": "875South Figueroa St., Tel: +1 213-627-6879. Good (but slightly pricey) pub food inthe heart of downtown near the Staples Center. The Mayor's Burger is a onepound beast with chili, bacon, and all the fixings, or you can try the dailycarvery sandwich. Steaks and seafood are also decent, and the drinks are pouredstiff. $15-$30.",
            "image": "assets/images/locations/1.jpg",
            "like": 44
        },
        {
            "id": "royale",
            "name": "Royale",
            "mood": "eat",
            "description": "2619Wilshire Blvd (inside Wilshire Royale Hotel), Tel: +1-213-388-8488. Located in the renovated Wilshire Royale Hotel, Chef EricErnest's new, culinary digs features a groovy cocktail lounge and menu that’sdescribed as &quot;sophisticated yet approachable.&quot;",
            "image": "assets/images/locations/1.jpg",
            "like": 17
        },
        {
            "id": "thewood-spoon",
            "name": "The Wood Spoon",
            "mood": "eat",
            "description": "107W 9th St, Tel: +1-213-629-1765. M 11AM-3PM, T-Fr 11AM-3PM, 6PM-9PM, Sa12PM-3PM, 6PM-10PM, closed Sunday. Located in a relatively non-descript settingdowntown, this restaurant features Brazilian-inspired dishes that are differentfrom what most American restaurants serve as &quot;Brazilian&quot;. Rice, beansand plantains are in use, but entrees such as a Brazilian-inspired pot pie andcinnamon water will be new to most diners. Jacqueline, the very gracious chef,will usually make the rounds once the kitchen closes and can tell some veryinteresting stories about her life after coming to the States. $10-$20 perperson.",
            "image": "assets/images/locations/1.jpg",
            "like": 13
        },
        {
            "id": "yangchow",
            "name": "Yang Chow",
            "mood": "eat",
            "description": "819N Broadway (at Alpine Street), Tel: +1-213-625-0811. Located inChinatown. Award-winning restaurant. Be sure to order the slippery shrimp andthe dry sauteed vegetables (green beans and asparagus).",
            "image": "assets/images/locations/1.jpg",
            "like": 84
        },
        {
            "id": "yorkshiregrill",
            "name": "Yorkshire Grill",
            "mood": "eat",
            "description": "610W 6th St (6th st & Grand), Tel: 213-623-3362. M-F 6:00 AM -3:30 PM,SAT 8:00 AM - 2:30 PM. Yorkshire Grill has been operating since 1954, with manya lucrative business deal having been negotiated over the famous Yorkshirepastrami sandwich. Open early, the Yorkshire breakfast dishes are some of thebest in the area and their old school diner coffee will get you off to a strongstart to your day! Lunch is always packed at Yorkshire so be sure to get thereearly, however Yorkshire also offers delivery to your home or place ofbusiness. $10.",
            "image": "assets/images/locations/1.jpg",
            "like": 13
        },
        {
            "id": "zucca",
            "name": "Zucca",
            "mood": "eat",
            "description": "801S. Figueroa St (at Eighth Ave), Tel: +1-213-614-7800. JoachimSplichal (of Patina) and chef Giancarlo Gottardo strike the right chord withtheir sleek, alluring bistro featuring classic Italian fare. The pastas andfresh fish are wonderful - one entrée representing every major region in Italy.Between the cuisine and pleasing milieu, it's quite a lovely dining experience.",
            "image": "assets/images/locations/1.jpg",
            "like": 10
        },
        {
            "id": "cafepinot",
            "name": "Cafe Pinot",
            "mood": "eat",
            "description": "(CentralLibrary Courtyard). A romantic French/Italian restaurant and a uniquesetting as part of the central library's front yard.",
            "image": "assets/images/locations/1.jpg",
            "like": 24
        },
        {
            "id": "ciaotrattoria",
            "name": "Ciao Trattoria",
            "mood": "eat",
            "description": "815W. Seventh St (near Figueroa). Harry Hagani's homage to fantasticItalian food is a cozy and elegant restaurant popular at lunchtime with thebusy executive crowd.",
            "image": "assets/images/locations/1.jpg",
            "like": 43
        },
        {
            "id": "cicada",
            "name": "Cicada",
            "mood": "eat",
            "description": "617S. Olive St (at 7th St), Tel: +1-213-488-9488. M-Fr 5:30PM-9PM.Situated in the beautiful Arts Deco Oviatt Building, Cicada deftly blendselegance of design and superior Italian fare. A chic bar is upstairs, completewith marble dance floor. A perfect place for special occasions, a fine mealbefore the theatre or just any excuse to be dazzled, both by the atmosphere andthe cooking.",
            "image": "assets/images/locations/1.jpg",
            "like": 30
        },
        {
            "id": "nickand-stefs",
            "name": "Nickand Stef's",
            "mood": "eat",
            "description": "330South Hope St. Fantastic steak house, run by the Patina restaurant empire. Ifyou like beef, this is some of the best in town, with a glass-enclosed agingroom where you can view the meat as it ages. Try the dry-aged Ribeye, it willmake your head spin. They also have 12 kinds of potatoes on the menu. Not surewhy, but they're all good. In the Wells Fargo Center, across from MOCA.",
            "image": "assets/images/locations/1.jpg",
            "like": 30
        },
        {
            "id": "pacificdining-car",
            "name": "Pacific Dining Car",
            "mood": "eat",
            "description": "1310West 6th St. Don't be surprised if you run into a city politician or otherpublic figuers in this LA landmark that is located partly inside a railwaytrain car, and has been open since 1921. Ask for the breakfast menu any time,day or night, for a more affordable and quite delicious menu.",
            "image": "assets/images/locations/1.jpg",
            "like": 98
        },
        {
            "id": "thepalm",
            "name": "The Palm",
            "mood": "eat",
            "description": "(Acrossfrom the Staples Center). The Palm is a casual white tablecloth restaurantwith a mix of Italian, seafood and great steaks. Check out the collection ofcaricatures on the walls too.",
            "image": "assets/images/locations/1.jpg",
            "like": 31
        },
        {
            "id": "traxx",
            "name": "Traxx",
            "mood": "eat",
            "description": "(UnionStation). Fancy-Schmansy restaurant in Union Station. Good food, pricey butthe ambiance of Union Station makes it worth a splurge.",
            "image": "assets/images/locations/1.jpg",
            "like": 53
        },
        {
            "id": "watergrill",
            "name": "Water Grill",
            "mood": "eat",
            "description": "(TheOld Bank District). The best seafood and overall service period. Perhaps abit pricey, but elegant and wonderful.",
            "image": "assets/images/locations/1.jpg",
            "like": 35
        },
        {
            "id": "demitasse",
            "name": "Demitasse",
            "mood": "eat",
            "description": "(LittleTokyo), 135 S. San Pedro Street (On the corner of 2nd & San Pedro).7am-10pm weekdays; 8am-10pm weekends. Demitasse serves up coffee, tea &pastries in what looks like a tidy inventor's laboratory. Friendly staff, nicepatio. Free wifi! $4-$6.",
            "image": "assets/images/locations/1.jpg",
            "like": 80
        },
        {
            "id": "theparish",
            "name": "The Parish",
            "mood": "eat",
            "description": "(FashionDistrict), 840 S. Spring Street (at Spring & 9th), Tel: >213 225 2400. opens at 8am. Pastries, coffee and tea. Relaxin the cafe downstairs, or get a more substantial (aaand more substantiallyexpensive) meal/drinks upstairs. Free wifi.$4-$10.",
            "image": "assets/images/locations/1.jpg",
            "like": 20
        },
        {
            "id": "tomamp-toms-little-tokyo-333-s-alameda-st-ste-108-entranceon-4th-at-alameda-in-the-little-tokyo-shopping-center-7am-2am-thisplace-seems-to-have-been-built-for-the-kind-of-customer-who-brings-a-laptop-orbook-and-stays-all-day-there-are-plenty-of-tables-and-even-some-glass-walledbooths-to-have-meetings-in-tons-of-power-outlets-free-wifi-be-carefulgetting-here--its-right-on-the-edge-of-skid-row-2-6",
            "name": "Tom& Tom's (Little Tokyo), 333 S Alameda St, Ste 108 (entranceon 4th at Alameda, in the Little Tokyo Shopping Center). 7am-2am. Thisplace seems to have been built for the kind of customer who brings a laptop orbook and stays all day. There are plenty of tables and even some glass-walledbooths to have meetings in. Tons of power outlets. Free wifi. (be carefulgetting here - it's right on the edge of Skid Row.) $2-$6.",
            "mood": "eat",
            "description": "LaCita. Curious mix of Latinos and hipsters.",
            "image": "assets/images/locations/1.jpg",
            "like": 13
        },
        {
            "id": "librarybar",
            "name": "Library Bar",
            "mood": "eat",
            "description": "630W. 6th Street, Tel: +1 213 488-1931. An upscale pub style bar with afloor-to-ceiling and wall-to-wall library that houses a wide range of literaryclassics, while playing great music from Jim Hendrix to The Who. Knowledgeablebartenders offer an extensive beer selection and cocktails that are bothclassic and innovative.",
            "image": "assets/images/locations/1.jpg",
            "like": 23
        },
        {
            "id": "therooftop-bar-the-standard",
            "name": "The Rooftop Bar @ The Standard",
            "mood": "eat",
            "description": "550S. Flower St (at Sixth). Open daily 12:00PM until 1:30 AM. This uniquebar offers a hipster hangout with excellent views of the city from thirteenstories up. Wear warm clothes during cold weather, and be prepared for drinkprices in the $10+ range for mixed drinks. Don't forget to try the waterbeds oreven jump in their pool for a swim.",
            "image": "assets/images/locations/1.jpg",
            "like": 61
        },
        {
            "id": "sevengrand",
            "name": "Seven Grand",
            "mood": "eat",
            "description": "Popularwhiskey bar owned by the owner of the Golden Gopher and Broadway Bar.",
            "image": "assets/images/locations/1.jpg",
            "like": 80
        },
        {
            "id": "thevarnish",
            "name": "The Varnish",
            "mood": "eat",
            "description": "118E 6th St (inside Cole's). 7pm-2am. Varnish is a restored speakeasy withold-timey music and drinks. Walk through the unmarked black door in the back ofCole's and there you are! mid to expensive.",
            "image": "assets/images/locations/1.jpg",
            "like": 98
        },
        {
            "id": "falafelarax",
            "name": "Falafel Arax",
            "mood": "eat",
            "description": "5101Santa Monica Blvd, Tel: (323) 663-9687. Open Tues-Sat 10am-8pm; Sun 10am-6pm.Hole in the wall with what many consider the best falafel and best shawermasandwiches in Los Angeles. An institution among Armenians. $8.",
            "image": "assets/images/locations/1.jpg",
            "like": 99
        },
        {
            "id": "sassounbakery",
            "name": "Sassoun Bakery",
            "mood": "eat",
            "description": "5114Santa Monica Blvd. 7:30 a.m. - 6:30 p.m. Incredibly good Lahmejun (a super thincrust Armenian meat pizza - under a dollar), plus great boreg and zahtar bread.Have a tahini bread for dessert. $4.",
            "image": "assets/images/locations/1.jpg",
            "like": 38
        },
        {
            "id": "carouselrestaurant",
            "name": "Carousel Restaurant",
            "mood": "eat",
            "description": "5112Hollywood Blvd., Tel: (323) 660-8060. 11:30 a.m. - 8:00 p.m., later onSaturday, closed Monday. Truly fantastic Arabic and Armenian food for cheap.The mezzes (appetizers) alone can make an amazing meal. $9.",
            "image": "assets/images/locations/1.jpg",
            "like": 65
        },
        {
            "id": "alegriaon-sunset",
            "name": "Alegriaon Sunset",
            "mood": "eat",
            "description": "3510Sunset Blvd., Silverlake, Tel: +1 323 913-1422. A fresh anddelicious take on Mexican cuisine. Good veggie options and fantastic moles.",
            "image": "assets/images/locations/1.jpg",
            "like": 18
        },
        {
            "id": "elchavo-restaurant",
            "name": "El Chavo Restaurant",
            "mood": "eat",
            "description": "4441West Sunset Boulevard (El Chavo is located at the Historic 5 PointInstersection at the point where Hollywood and Sunset Boulevard meet. Locatedbetween the bustling East Side Neighborhoods of Silver Lake & Los Feliz.).4 pm - 12 am. Historic El Chavo Restaurant serves Traditional Mexican Fareranging from Sweet Green Corn Tamales to our infamous &quot;El Chavo&quot;Butterfly New York Steak. We offer a full bar specializing in Hand-CraftedMargaritas. Our dining room is a great place to entertain an intimate dinner toa large group of friends and family. We also have a gorgeous outdoor patio toenjoy El Chavo under the stars. $9 - $12.",
            "image": "assets/images/locations/1.jpg",
            "like": 54
        },
        {
            "id": "auntieems-kitchen",
            "name": "Auntie Em's Kitchen",
            "mood": "eat",
            "description": "4616Eagle Rock Blvd, Eagle Rock, Tel: +1 (323) 255-0800. Very popularbreakfast spot in Eagle Rock, great food in a homey environment.",
            "image": "assets/images/locations/1.jpg",
            "like": 31
        },
        {
            "id": "burritoking",
            "name": "Burrito King",
            "mood": "eat",
            "description": "2827Hyperion Ave. (at Sunset Blvd., Silverlake). A low-rent burrito stand, wellknown for delicious and cheap burritos well into the night. Come here for acheap lunch or to satisfy late-night cravings after last call.",
            "image": "assets/images/locations/1.jpg",
            "like": 76
        },
        {
            "id": "elarco-iris",
            "name": "El Arco Iris",
            "mood": "eat",
            "description": "5684York Blvd., Highland Park. Good Mexican food and margaritas in one of LA’soldest neighborhoods.",
            "image": "assets/images/locations/1.jpg",
            "like": 65
        },
        {
            "id": "elsiete-mares-restaurante",
            "name": "El Siete Mares Restaurante",
            "mood": "eat",
            "description": "3131Sunset Blvd., Los Angeles. As the names suggests, a Mexican restaurantspecializing in seafood. Great ceviche tostadas. Eat in the restaurant, oroutside on a patio next to their take-out stand.",
            "image": "assets/images/locations/1.jpg",
            "like": 39
        },
        {
            "id": "eltaurino",
            "name": "El Taurino",
            "mood": "eat",
            "description": "2306West 11th St., Tel: +1 213 738-9197. Utterly delicious and authentic Mexicanfast food for those on a budget, and a favorite hangout of the locals. In alower-income neighborhood on the corner of Olympic & Hoover; a good placeto eat if passing near USC. Looks questionable from the outside, but don't letthat deceive you; El Taurino is the real deal.",
            "image": "assets/images/locations/1.jpg",
            "like": 37
        },
        {
            "id": "fred62",
            "name": "Fred62",
            "mood": "eat",
            "description": "1850N. Vermont Ave., Los Feliz. This hipster diner features a diverse range of foodsfrom Udon to mac and cheeze balls, with Thai cobb salad and chicken pot pie inbetween. Their Bearded Frenchy (french toast covered with corn flakes and thendeep fried) are a late night/early breakfast favorite for stoners or sweettooths alike. Most menu items end with $.62.",
            "image": "assets/images/locations/1.jpg",
            "like": 88
        },
        {
            "id": "houseof-pies",
            "name": "Houseof Pies",
            "mood": "eat",
            "description": "1869N Vermont Ave., Tel: +1 323 666-9961. A diner in the extremely hip LosFeliz/Silverlake district where you're likely to see and be snubbed by thestars of your favorite up-and-coming indie bands. Has a huge selection ofdelicious pies along with a typical diner menu. Sandwiches and breakfast itemsare great, too. Anything else can be hit or miss. Opens at 6:30 AM and closesat 1:00 AM Sunday through Thursday; open until 2:00 AM on Friday and Saturday.",
            "image": "assets/images/locations/1.jpg",
            "like": 71
        },
        {
            "id": "jadecafe",
            "name": "Jade Café",
            "mood": "eat",
            "description": "1521Griffith Park Blvd.. A small, casual yet elegant space decorated in simplemodern decor. Raw Fusion vegetarian cuisine is carefully prepared andbeautifully presented. Unique flavors. Menu is small but interesting.",
            "image": "assets/images/locations/1.jpg",
            "like": 42
        },
        {
            "id": "langersdeli",
            "name": "Langer's Deli",
            "mood": "eat",
            "description": "704S. Alvarado St., MacArthur Park, Tel: +1 213 483-8050. Known citywide forits pastrami sandwiches and other deli delights.",
            "image": "assets/images/locations/1.jpg",
            "like": 55
        },
        {
            "id": "mamashot-tamales",
            "name": "Mama's Hot Tamales",
            "mood": "eat",
            "description": "2124W. Seventh St., MacArthur Park, Tel: +1 213 487-7474. A good selection oftamales and other Mexican food. Visit their carts along the sidewalks aroundMacArthur Park on the weekends.",
            "image": "assets/images/locations/1.jpg",
            "like": 98
        },
        {
            "id": "nickyds-wood-fired-pizza",
            "name": "Nicky D's Wood-fired Pizza",
            "mood": "eat",
            "description": "2764Rowena Ave., Los Angeles, Tel: +1 323 664-3333. A cozy pizza (andpasta) joint with a nice deck out back for warm LA nights.",
            "image": "assets/images/locations/1.jpg",
            "like": 55
        },
        {
            "id": "originaltommys",
            "name": "Original Tommy's",
            "mood": "eat",
            "description": "2575W. Beverly Blvd (On the corner of Beverly and Rampart just west of DowntownLos Angeles), Tel: +1-213-389-9060, [14].Open 24 hours/7 days a week. A Los Angeles landmark since 1946, Tommy's is acan't-miss for any hamburger lover. Although they have 30 locations acrossSouther California, you cannot miss the atmosphere of the 1st Tommy's(especially late at night on weekends). Serving hamburgers, french fries, hotdogs, and tamales with their &quot;secret blend&quot; of chili you will alwaysfind a line for food at all hours, especially late night/early mornings.",
            "image": "assets/images/locations/1.jpg",
            "like": 44
        },
        {
            "id": "phocafe",
            "name": "Pho Café",
            "mood": "eat",
            "description": "2841W. Sunset Blvd. (at Silver Lake Blvd.), Tel: +1 213 413-0888. Greatfor cheap cold or hot Vietnamese noodles in a hip atmosphere. Also try theVietnamese iced coffees. There's no sign, it's in the middle of a strip mall, afew doors to the left of Rambutan Thai retaurant. $7-10.",
            "image": "assets/images/locations/1.jpg",
            "like": 71
        },
        {
            "id": "tacozone-truck",
            "name": "Taco Zone Truck",
            "mood": "eat",
            "description": "OnAlvarado just north of Reservoir (Parked next to the Vons grocery store onthe northbound side of Alvarado). One of the best taco trucks on the eastside and the best in the neighborhood! Cheap delicious tacos, burritos, andquesadillas. Be prepared to wait if there is a crowd, and there usually is, butthe homemade salsas alone are well worth it. Opens around 8-8:30 pm",
            "image": "assets/images/locations/1.jpg",
            "like": 55
        },
        {
            "id": "chichenitza",
            "name": "Chichen Itza",
            "mood": "eat",
            "description": "2501W 6th St, MacArthur Park, Tel: +1 213 380-0051. M-Th 11:30AM-9PM,Fr-Sa 11:30AM-11PM, Su 11:30AM-9PM. A new Mexican restaurant across fromMacArthur Park specializing in Yucatan cuisine. Live music on Fridays andSaturdays from 7-10PM, beer and wine available. Mains $10-15.",
            "image": "assets/images/locations/1.jpg",
            "like": 17
        },
        {
            "id": "cobrasamp-matadors",
            "name": "Cobras& Matadors",
            "mood": "eat",
            "description": "4655Hollywood Blvd., Los Feliz, Tel: +1 323-669-3922. While the sangriais to be avoided, this place features delicious Spanish tapas with some greatSpanish wines. As tapas are usually served in small portions, this place canget very expensive very quickly for those who are hungry.",
            "image": "assets/images/locations/1.jpg",
            "like": 76
        },
        {
            "id": "elfcafe",
            "name": "Elf Cafe",
            "mood": "eat",
            "description": "2135W Sunset Blvd, Tel: 213 484-6829. Excellent vegetarian food in a teeny andsuitably hip setting.",
            "image": "assets/images/locations/1.jpg",
            "like": 90
        },
        {
            "id": "figaro",
            "name": "Figaro",
            "mood": "eat",
            "description": "1802N. Vermont Ave., Los Angeles, 90027, Tel: 323662-1587. Simple French food in a pretty cafe setting with outdoor dining aswell. Great place to have a drink and watch people walk by.",
            "image": "assets/images/locations/1.jpg",
            "like": 86
        },
        {
            "id": "gingergrass",
            "name": "Gingergrass",
            "mood": "eat",
            "description": "2396Glendale Blvd., Silverlake. Excellent Vietnamese food with good vegetarianoptions.",
            "image": "assets/images/locations/1.jpg",
            "like": 65
        },
        {
            "id": "malo",
            "name": "Malo",
            "mood": "eat",
            "description": "4326W. Sunset Blvd., Silverlake, Tel: +1 323-664-1011. A very cool bar andrestaurant with good Mexican food, best known for its giant selection oftequilas and mojitos. Valet parking.",
            "image": "assets/images/locations/1.jpg",
            "like": 75
        },
        {
            "id": "palermo",
            "name": "Palermo",
            "mood": "eat",
            "description": "1858N. Vermont Ave., Los Feliz. Popular &quot;old school&quot; Italian restaurantin Los Feliz Village, next to Fred 62. Best known for its pizza.",
            "image": "assets/images/locations/1.jpg",
            "like": 12
        },
        {
            "id": "rambutanthai",
            "name": "Rambutan Thai",
            "mood": "eat",
            "description": "2835W. Sunset Blvd, Tel: (213) 273.8424. Su-Th 11:30AM-10:30PM, F-Sa 11:30PM-12AM.Delicious Thai food, moody atmosphere, really popular and open late onweekends. Mains $10-15.",
            "image": "assets/images/locations/1.jpg",
            "like": 83
        },
        {
            "id": "tantra",
            "name": "Tantra",
            "mood": "eat",
            "description": "3705W. Sunset Blvd., Silverlake. Delicious and well-prepared Indian food in atrendy setting.",
            "image": "assets/images/locations/1.jpg",
            "like": 92
        },
        {
            "id": "casbahcafe",
            "name": "Casbah Café",
            "mood": "eat",
            "description": "3900W. Sunset Blvd., Silverlake, Tel: +1 323 664-7000. A great Moroccancafe serving authentic Moroccan mint tea, coffee and other drinks and snacks.Attached is a little store selling items imported by the owner.",
            "image": "assets/images/locations/1.jpg",
            "like": 57
        },
        {
            "id": "intelligentsiacoffee-amp-tea",
            "name": "Intelligentsia Coffee & Tea",
            "mood": "eat",
            "description": "3922W. Sunset Blvd., Silverlake, Tel: +1 323 663-6173. The Chicago-basedcompany recently launched its Silverlake store, which makes some of the bestcoffee in LA. It's prime location and free wifi keep the limited seating prettyfull.",
            "image": "assets/images/locations/1.jpg",
            "like": 20
        },
        {
            "id": "pinkshot-dogs",
            "name": "Pink's Hot Dogs",
            "mood": "eat",
            "description": "709N. La Brea Avenue, Tel: +1 323-931-4223. Su-Th 9:30AM-2AM, F-Sa 9:30AM-3AM.Serving the most famous hot dogs in Los Angeles since 1939, their chili dogwill set you back just $2.50. Open every day from 9:30AM to 2AM or later.Expect a long but fairly fast-moving line.",
            "image": "assets/images/locations/1.jpg",
            "like": 76
        },
        {
            "id": "scoops",
            "name": "Scoops",
            "mood": "eat",
            "description": "712North Heliotrope Dr, Tel: +1 (323) 906 2649. M-Sa. 12PM - 10PMSun. 2PM - 6PM. There's nothing quite like a giant cone of ice cream on a hotsummer's day in LA, and scoops does all your favourite flavours plus someinnovative creations like black currant lychee and brown bread!",
            "image": "assets/images/locations/1.jpg",
            "like": 16
        },
        {
            "id": "in-n-outburger",
            "name": "In- N-OutBurger",
            "mood": "eat",
            "description": "7009W Sunset Blvd, Hollywood, CA, 90028. This hugely popular Southern Californiaburger chain has a surprisingly basic menu, but serves up some of the mostpopular burgers around, and does burgers well.",
            "image": "assets/images/locations/1.jpg",
            "like": 19
        },
        {
            "id": "yai",
            "name": "Yai",
            "mood": "eat",
            "description": "Bygeneral learned agreement, the most authentic Thai food in the States can befound at &quot;the Thai restaurant behind the 7-11 on Hollywood Boulevard bythe 101.&quot; That's how it is known. If you are not from L.A., this can alsoserve as an introduction to L.A.-style directions. (The cross street, by theway, is Taft Avenue.) The Pad Thai here is light and perfumed and the currieshot enough to kill. And by authentic, that's exactly what ismeant...don't expect any catering to tastes here.",
            "image": "assets/images/locations/1.jpg",
            "like": 48
        },
        {
            "id": "palmsthai-restaurant",
            "name": "Palms Thai Restaurant",
            "mood": "eat",
            "description": "5900Hollywood Blvd, Tel: +1 323-462-5073. 11AM-2AM. Home of the infamous ThaiElvis, who will serenade you through dinner. The decor's authentically cheesyand Elvis sings the hits. While plain dishes such as fried rice or pad Thai arenothing to write home about, the curries (duck and panang), pad prik king, andanything off the &quot;wild things&quot; menu are excellent choices.",
            "image": "assets/images/locations/1.jpg",
            "like": 33
        },
        {
            "id": "parus",
            "name": "Paru's",
            "mood": "eat",
            "description": "5140W Sunset Blvd. (just west of Normandie Ave.). M-F 4-10PM, Sa-Su11AM-10PM. Head here for excellent South Indian vegetarian food in a charminggarden. Especially wonderful masala dosas.",
            "image": "assets/images/locations/1.jpg",
            "like": 93
        },
        {
            "id": "blujam-cafe",
            "name": "Blu Jam Cafe",
            "mood": "eat",
            "description": "7371Melrose Ave (Melrose at Martel in the middle of all the best shopping).M-F 8AM to 6PM. Good food with options for everyone. Even some Czech items.Almost every meal is under $10.",
            "image": "assets/images/locations/1.jpg",
            "like": 97
        },
        {
            "id": "littlearmenia",
            "name": "Little Armenia",
            "mood": "eat",
            "description": "EastHollywood's Little Armenia district has a few excellent cheap food options. FalafelArax at 5101 Santa Monica Blvd. has excellent Falafel and Shawerma. SassounBakery, at 5114 Santa Monica has great Lahmejun (Armenia pizza), boregs,zahtar (thyme) and tahini breads. Zankou Chicken at 5065 W. Sunset Blvd.has popular rotiserrie chicken with great garlic sauce. Carousel at 5112Hollywood Blvd. has an amazing mezze (appetizer) selection, and great food.",
            "image": "assets/images/locations/1.jpg",
            "like": 78
        },
        {
            "id": "101coffee-shop",
            "name": "101 Coffee Shop",
            "mood": "eat",
            "description": "6145Franklin Ave (at Vista Del Mar Avenue), Tel: +1-323-467-1175. 7AM-3AM, 7 days a week. Previously known as the HollywoodHills Coffee Shop, this place has been popular for years, and the new ownershave only improved it. Great selection of sandwiches, burgers, sweet potatofrench fries(!!), coffee and tea. It's not unheard of to spot celebs here.",
            "image": "assets/images/locations/1.jpg",
            "like": 39
        },
        {
            "id": "ammo",
            "name": "Ammo",
            "mood": "eat",
            "description": "1155N. Highland Ave. Great for lunch or dinner, excellent and fashionable food.",
            "image": "assets/images/locations/1.jpg",
            "like": 70
        },
        {
            "id": "cheebo",
            "name": "Cheebo",
            "mood": "eat",
            "description": "7533W. Sunset Blvd, Tel: +1 323-850-7070. Everyone loves the Cheeb! A play on&quot;cibo&quot; (Italian for food), this place has great and creative food anda fun atmosphere. All-day breakfasts, excellent sandwiches, salads, pizzas bythe foot and nice dinners to boot. Eat here for breakfast and you'll be backfor lunch.",
            "image": "assets/images/locations/1.jpg",
            "like": 24
        },
        {
            "id": "electrickarma",
            "name": "Electric Karma",
            "mood": "eat",
            "description": "82221/2 W. 3rd St., Tel: +1 323-653-2121. Su-Th 11:30AM-10:30PM, F-Sa11:30AM-11PM. The &quot;Most Romantic Indian Restaurant in Los Angeles&quot;offers authentic Punjabi cuisine at reasonable prices for lunch and dinner; abeautiful, candle-lit dining room and open-air courtyard; unique cocktails; andwarm, professional staff.",
            "image": "assets/images/locations/1.jpg",
            "like": 58
        },
        {
            "id": "thegriddle-cafe",
            "name": "The Griddle Café",
            "mood": "eat",
            "description": "7916Sunset Blvd (east of Fairfax Ave), Tel: +1 323-874-0377. TheGriddle Café is the best breakfast experience in LA. It features pages of everytype of pancake you can imagine, which also happen to be twice as large as anypancake you've ever had, and still manage to be fluffy-thick and light on thetummy. Coffee is fresh, in a french press, and the menu features more than justbreakfast. Short story: Food is awesome, service is great, but its always crowded.Don't worry though, they serve fast and you will feel the wait is worth it.",
            "image": "assets/images/locations/1.jpg",
            "like": 70
        },
        {
            "id": "mcafe",
            "name": "M Café",
            "mood": "eat",
            "description": "7119Melrose Ave, Tel: +1 323-525-0588. M-Sa 9AM-10PM, Su 9AM-9PM. One of thehottest new places in Hollywood. If you've been infected with Organica orMacrobiotica, head here now. It's often impossibly crowded and parking'sa nightmare. They've got lots of premade things that are handy if you're shorton time, otherwise it's better to order fresh, considering how far you'll beset back. Most mains hover around the $10-15 range.",
            "image": "assets/images/locations/1.jpg",
            "like": 67
        },
        {
            "id": "melsdrive-in",
            "name": "Mel's Drive-In",
            "mood": "eat",
            "description": "1660N. Highland Ave, Tel: +1-323-465-3111. Su-Th 6:30AM-3AM, F-Sa 24 Hrs.. Comehere for traditional diner fare: cheeseburgers, french fries, and milkshakes.Part of the chain that opened in San Francisco in the late '40s. There isanother location on the Sunset Strip in West Hollywood.",
            "image": "assets/images/locations/1.jpg",
            "like": 25
        },
        {
            "id": "mussoamp-frank-grill",
            "name": "Musso& Frank Grill",
            "mood": "eat",
            "description": "6667Hollywood Blvd, Tel: +1-323-467-7788. For a taste of old Hollywood, this isthe place. It's been famous for generations.",
            "image": "assets/images/locations/1.jpg",
            "like": 32
        },
        {
            "id": "rainbowbar-amp-grill",
            "name": "Rainbow Bar & Grill",
            "mood": "eat",
            "description": "9015Sunset Blvd. (between N. Doheny Dr. and Hammond St.), Tel: +1310-278-4232. This vintage lounge offers great appetizers (especially thecalamari), pizza, pasta, burgers, and pricier steak and seafood dishes in ahard rock atmosphere. If you like the '80s L.A. metal scene, there's no betterplace to spot rock stars (and lesser lights like Ron Jeremy.) A $10 covercharge comes with two drink vouchers. The Roxy is next door. A crowded outdoorsmoking patio is available for the real rockers. &nbsp;",
            "image": "assets/images/locations/1.jpg",
            "like": 19
        },
        {
            "id": "sushiike",
            "name": "Sushi Ike",
            "mood": "eat",
            "description": "6051Hollywood Blvd (in a mini-mall on the corner of Gower), Tel: +1-323-856-9972. A small and moderately-priced authentic Japanese restaurantwith a great sushi bar and friendly chefs--one of the best this side of the101.",
            "image": "assets/images/locations/1.jpg",
            "like": 62
        },
        {
            "id": "allangelo-ristorante",
            "name": "All' Angelo Ristorante",
            "mood": "eat",
            "description": "7166melrose ave. - los angeles - CA 90046, Tel: +1 323 933-9540. Lunch -Friday: 12 - 2:30PM / Dinner - M-Sa: 6 - 10:30PM / Closed Sunday. Thisauthentic Italian eatery combines the relaxed atmosphere of a Los Angelesrestaurant with a menu that's as close to a ticket to Rome as you can getwithout a passport. Their seasonal menu includes mouth watering timbale ofcauliflower, authentic tripe, gourmet pastas, and hearty entrees. The ownersbring a warm Italian sensibility to fresh dishes that would please any palate.This place is perfect for that special occasion!",
            "image": "assets/images/locations/1.jpg",
            "like": 75
        },
        {
            "id": "yamashiro",
            "name": "Yamashiro",
            "mood": "eat",
            "description": "1999N. Sycamore Avenue, Tel: +1-323-466-5125. This Japanese restaurant is perchedabove Hollywood, and on most nights provides an unbeatable view of the city,from downtown to Palos Verdes. The food is excellent, the gardens andarchitecture are elegant, and the restaurant has a fascinating history (thestory's on the menu). Look for the small sign just west of the Magic Castle;valet parking only.",
            "image": "assets/images/locations/1.jpg",
            "like": 43
        },
        {
            "id": "geishahouse",
            "name": "Geisha House",
            "mood": "eat",
            "description": "Tel: +1 323-460-6300. Su-Th 6PM-1AM, F-Sa 6PM-1:30AM. Geisha House is a ModernJapanese Restaurant, Sushi Bar and Sake Lounge that embraces the flavor oftraditional Japan while catering to the hip, sophisticated clientèle of LosAngeles. Don't be surprised by celebrity clientèle either. $31-50.",
            "image": "assets/images/locations/1.jpg",
            "like": 42
        },
        {
            "id": "katsuya",
            "name": "Katsuya",
            "mood": "eat",
            "description": "6300Hollywood Blvd (at Vine St), Tel: +1 (323) 871-8777. The newestrestaurant from acclaimed chef Katsuya Uechi, designed by Philippe Starck.Mouth-watering Japanese menu, destined to be a new Hollywood institution. Hisother restaurants around the LA area are rated as some of the best in the city.",
            "image": "assets/images/locations/1.jpg",
            "like": 32
        },
        {
            "id": "theivy",
            "name": "The Ivy",
            "mood": "eat",
            "description": "Tel: +1 310-274-6300. M-F 11:30AM-11PM, Sa 11AM-11PM, Su 10:30AM-10AM. The Ivy is aLos Angeles mainstay and is frequented by celebrities. As for the menu, thinkcomfort food, like fried chicken, Cajun prime rib and fish and fresh cornchowder. Request a seat on the famed patio for the best people watching.$31-50.",
            "image": "assets/images/locations/1.jpg",
            "like": 45
        },
        {
            "id": "cefiore",
            "name": "ce Fiore",
            "mood": "eat",
            "description": "6922Hollywood Blvd #107, Tel: +1 323-465-9097. Everyday 11AM-11PM.Right across the street from Grauman's Chinese Theatre you'll find one of LA'sbest places for tart Italian non-fat frozen yogurt and yogurt smoothies. Choosefrom 4 different frozen yogurt flavors: Original, Blackberry,Raspberry-Pomogranate, and Green Tea, along with a wide variety of fresh fruitsand dry toppings. They also offer smoothies, herbal teas, and coffees.",
            "image": "assets/images/locations/1.jpg",
            "like": 40
        },
        {
            "id": "pinkberry",
            "name": "Pinkberry",
            "mood": "eat",
            "description": "7123Melrose Ave (just west of La Brea), Tel: +1 323-730-9889. A new,overly-hyped and rapidly spreading frozen yogurt chain. Choose from vanilla orgreen tea yogurt, and a great assortment of toppings from fresh berries toCap'n Crunch. $2-5.",
            "image": "assets/images/locations/1.jpg",
            "like": 47
        },
        {
            "id": "chanos",
            "name": "Chanos",
            "mood": "eat",
            "description": "Ataco stand frequented by USC students is located on Figueroa Street very closeto the Shrine Auditorium. It is delicious, has a drive through and is open verylate.",
            "image": "assets/images/locations/1.jpg",
            "like": 61
        },
        {
            "id": "roscoeschicken-amp-wafflesnbsp",
            "name": "Roscoe's Chicken & Waffles&nbsp;",
            "mood": "eat",
            "description": "Technicallylocated in Inglewood (just outside LA City boundaries) on Manchester (orfurther north on La Brea in Country Club Park), this is the most well-known ofthe ubiquitous LA-area chicken & waffles restaurants. Cheap, and with goodservice, this restaurant is a convenient, quick dinner spot.",
            "image": "assets/images/locations/1.jpg",
            "like": 28
        },
        {
            "id": "lataquiza",
            "name": "La Taquiza",
            "mood": "eat",
            "description": "OnFigueroa two blocks north of USC, this restaurant serves its famous&quot;mulitas de res,&quot; a must-try Mexican dish.",
            "image": "assets/images/locations/1.jpg",
            "like": 78
        },
        {
            "id": "tuktuk",
            "name": "Tuk Tuk",
            "mood": "eat",
            "description": "OnPico Boulevard near Robertson, on the border between Beverlywood and BeverlyHills.",
            "image": "assets/images/locations/1.jpg",
            "like": 23
        },
        {
            "id": "indiasoven",
            "name": "India's Oven",
            "mood": "eat",
            "description": "11645Wilshire Boulevard (2nd Floor) 310-207-5522 or 7231 Beverly Blvd 323-936-1000.The original location on Pico near Fairfax was burned down in the Los Angelesriots in the '90s.",
            "image": "assets/images/locations/1.jpg",
            "like": 30
        },
        {
            "id": "gardenof-taxco",
            "name": "Gardenof Taxco",
            "mood": "eat",
            "description": "inWest Hollywood offers an unforgettable experience, with the &quot;menu&quot;recited by colorful waiters.",
            "image": "assets/images/locations/1.jpg",
            "like": 51
        },
        {
            "id": "versailles",
            "name": "Versailles",
            "mood": "eat",
            "description": "10319Venice Blvd, 310-558-3168; 1415 S. La Cienega, 310-289-0392 and otherlocations.",
            "image": "assets/images/locations/1.jpg",
            "like": 47
        },
        {
            "id": "yeolde-kings-head",
            "name": "Ye Olde King's Head",
            "mood": "eat",
            "description": "Apub and notable hangout for tourists, celebrities, and locals on Santa MonicaBoulevard and 2nd Street, arguably has the best fish and chips in the world.Most of Los Angeles' pubs are located west of the 405, in this area.",
            "image": "assets/images/locations/1.jpg",
            "like": 22
        },
        {
            "id": "maoskitchen",
            "name": "Mao's Kitchen",
            "mood": "eat",
            "description": "inVenice, on Pacific and Windward, serves Hunan cuisine.",
            "image": "assets/images/locations/1.jpg",
            "like": 35
        },
        {
            "id": "thecorner-place",
            "name": "The Corner Place",
            "mood": "eat",
            "description": "2819James M. Wood Blvd., Koreatown (just east from the corner of Vermont), Tel: +1 213 487-0968. 11AM-10PM, closed Sundays. Good Korean BBQ at a really greatprice (around $20 is enough to stuff two people). The decor isn't as fancy asmore expensive places, but it has charm. The menu is family style, so one orderis enough to feed two people. Like most Korean BBQ places, servers bring themeat out for you to cook at your table (but that doesn't mean you shouldn't tip!)With your meal comes a variety of traditional Korean side dishes and a plate ofjulienned scallions to enjoy with your freshly grilled meat. For finicky eatersor those new to Korean food, the bulgoki (marinated beef) is always a goodchoice. On warmer days, or whenever you want a lighter meal, try their coldnoodle soup (white somen noodles in a cold soup of clear, mild kimchi) withyour meal instead of rice.",
            "image": "assets/images/locations/1.jpg",
            "like": 62
        },
        {
            "id": "labrea-bakery-cafe",
            "name": "La Brea Bakery Cafe",
            "mood": "eat",
            "description": "624South La Brea Ave, Tel: +1 323-939-6813. Excellent bread, sandwiches, cookies,pastries and coffee.",
            "image": "assets/images/locations/1.jpg",
            "like": 21
        },
        {
            "id": "toast",
            "name": "Toast",
            "mood": "eat",
            "description": "8221W 3rd St, Tel: +1 323-655-5018. Serves traditional American breakfastall day for a reasonable price. Also great lunch food! Popular with famouspeople.",
            "image": "assets/images/locations/1.jpg",
            "like": 93
        },
        {
            "id": "veganglory",
            "name": "Vegan Glory",
            "mood": "eat",
            "description": "8393Beverly Blvd. Offers a variety of soy meat-substitutes & tofu choices inthe entrees. Also veggie burgers, salads, soups, and noodles. Recommend thepapaya salad, spring rolls, spicy eggplant, and yummy carrot cake. The lunchspecials are good bargains (soup, salad, spring roll, brown rice, and choice ofentree). Friendly service in a casual, clean setting. Open daily 11am-10pm.Parking available in the lot and on the street.",
            "image": "assets/images/locations/1.jpg",
            "like": 45
        },
        {
            "id": "bcdtofu-house",
            "name": "B CDTofu House",
            "mood": "eat",
            "description": "Westernand 9th; Wilshire and Kingsley; ('various locations in Koreatown, Downtown, andGreater Los Angeles'). The menu includes various types of soon tofustews (at around $8) and combination meals including other traditional Koreanentrées (Korean BBQ, bibimbap, etc.) along with a small bowl of soontofu stew (at around $11-$14). Each order comes with a bowl of rice and thestandard array of traditional Korean side dishes. Service and atmosphere arealways great. The décor at the location on Wilshire is particularly nice. Forthose new to eating soon tofu, particularly at BCD Tofu House, there isa certain order to follow in eating your meal (such as cracking the optionalraw egg into the stew while it's still boiling). Don't be afraid to wave yourserver down and ask questions. (Many Korean restaurants have implemented bellsat each table in case you have a particularly hard time getting the attentionof any servers). Several locations (including the 2 in Koreatown) are open 24hours.",
            "image": "assets/images/locations/1.jpg",
            "like": 49
        },
        {
            "id": "buddhasbelly",
            "name": "Buddha's Belly",
            "mood": "eat",
            "description": "7475Beverly Blvd, Tel: +1 323-931-8588. Tasty California-style Asian food.",
            "image": "assets/images/locations/1.jpg",
            "like": 43
        },
        {
            "id": "cantersdeli",
            "name": "Canter's Deli",
            "mood": "eat",
            "description": "419N. Fairfax Ave, Tel: +1 323-651-2030. Awesome Jewish deli on Fairfax, a fewblocks north of 3rd. This place has been around for over 70 years and you'llknow why if you stop by. It's 24 hours too.",
            "image": "assets/images/locations/1.jpg",
            "like": 60
        },
        {
            "id": "cobrasamp-matadors",
            "name": "Cobras& Matadors",
            "mood": "eat",
            "description": "7615W. Beverly Blvd., Tel: +1 323-932-6178. Great for Spanish tapas over a glass ofSpanish wine, which you must buy from the wine shop next door since C&Mdon't have a license to sell it at this location, only to serve it. Anotherbranch in Los Feliz.",
            "image": "assets/images/locations/1.jpg",
            "like": 98
        },
        {
            "id": "elcholo",
            "name": "El Cholo",
            "mood": "eat",
            "description": "1121S. Western Ave., Koreatown. One of the original LA Mexican restaurants iswildly popular, especially for their green corn tamales, when they're inseason.",
            "image": "assets/images/locations/1.jpg",
            "like": 15
        },
        {
            "id": "elcoyote-cafe",
            "name": "El Coyote Cafe",
            "mood": "eat",
            "description": "7312Beverly Blvd., Tel: (323) 939-2255. Known for its margaritas, fun atmosphere,and cute/tacky decor, this Mexican restaurant opened in 1931 at First and LaBrea, and in 1951 moved to its present location on Beverly Blvd. It is therestaurant where Sharon Tate and her friends ate their last meal before beingmurdered by the Charles Manson family in 1969.",
            "image": "assets/images/locations/1.jpg",
            "like": 88
        },
        {
            "id": "guelaguetza",
            "name": "Guelaguetza",
            "mood": "eat",
            "description": "3337W. Eighth St., Koreatown, Tel: +1 213 427-0779. For the best molethis side of Oaxaca, go to Guelaguetza in Koreatown. The interior is charming,often with a Mexican band is playing. But the star is the mole -- three typesare on offer. Try them all, and from then forward when you are stuck eating aneveryday lunch, you will dream of Guelaguetza.",
            "image": "assets/images/locations/1.jpg",
            "like": 71
        },
        {
            "id": "nickscoffee-shop",
            "name": "Nick's Coffee Shop",
            "mood": "eat",
            "description": "8536West Pico Blvd (corner of Pico & La Cienaga), Tel: +1-310-652-3567. Located in the same location since 1946, this classic dinerhas a six-page menu with several hundred items for all tastes. American dinerfare is combined with Mexican specialties for a mind-numbing variety of mealoptions, and portions are generous. Prices are reasonable, service is amazinglyfast and friendly, and the decor is guaranteed to have you waxing nostalgic.$10-$15 per person.",
            "image": "assets/images/locations/1.jpg",
            "like": 75
        },
        {
            "id": "swingersdiner",
            "name": "Swingers Diner",
            "mood": "eat",
            "description": "8020Beverly Blvd (at Laurel Ave), Tel: +1 323-653-5858. Overly trendy andvery popular for an update on diner-style food. Great for breakfast at anytimeof the day... and salads, sandwiches, a large menu. Prepare to be assaulted byhipness.",
            "image": "assets/images/locations/1.jpg",
            "like": 28
        },
        {
            "id": "animal",
            "name": "Animal",
            "mood": "eat",
            "description": "435N. Fairfax Ave, Tel: (323) 782-9225. Somewhat of an anomaly in an increasinglyvegetarian Los Angeles, Animal does what it does extremely well. Jon and Vinny(Two Dudes Catering, Iron Chefs) have finally opened their firstrestaurant, and their hard work and determination most certainly shows up in thesuper tasty and creative cuisine. Pescatarians will do just fine with the dailyfish, but vegetarians beware, there's not much here for you. Mains ~ $30.",
            "image": "assets/images/locations/1.jpg",
            "like": 39
        },
        {
            "id": "aoc",
            "name": "A OC",
            "mood": "eat",
            "description": "8022W. 3rd St, Tel: +1 (323) 653-6359. Fantastic food in every way, in anelegant atmosphere. Great cheeses, great wines, great desserts. The dishes lookreasonably priced at a glance, but they arrive in tapa-style proportions, andquickly add up, making it a great place to splurge.",
            "image": "assets/images/locations/1.jpg",
            "like": 86
        },
        {
            "id": "campanile",
            "name": "Campanile",
            "mood": "eat",
            "description": "624S. La Brea Ave., Tel: +1 323-938-1447 It's been around for years, and itsItalian menu just keeps getting better.",
            "image": "assets/images/locations/1.jpg",
            "like": 96
        },
        {
            "id": "grace",
            "name": "Grace",
            "mood": "eat",
            "description": "7360Beverly Blvd., Tel: +1 323-934-4400. French-inspired, unique and delicious.",
            "image": "assets/images/locations/1.jpg",
            "like": 89
        },
        {
            "id": "jar",
            "name": "Jar",
            "mood": "eat",
            "description": "8225Beverly Blvd., Tel: +1 323-655-6566. Popular for yummy steaks and aninventive menu.",
            "image": "assets/images/locations/1.jpg",
            "like": 30
        }
    ]


}
