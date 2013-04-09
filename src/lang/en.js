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
            "route" : "^home\\/location\\/?$",
            "section" : "district"
        },
        {
            "route" : "^home\\/search\\/?$",
            "section" : "location-list"
        },
        {
            "route" : "^home\\/(mood|location)\\/[A-Za-z-_!0-9]+\\/?$",
            "section" : "location-list"
        },
        {
            "route" : "^home\\/search\\/[A-Za-z-_!0-9]+\\/?$",
            "section" : "location-list"
        },
        {
            "route" : "^home\\/search\\/[A-Za-z-_!0-9]+\\/[A-Za-z-_!0-9]+\\/?$",
            "section" : "overview"
        },
        {
            "route" : "^home\\/(mood|location)\\/[A-Za-z-_!0-9]+\\/[A-Za-z-_!0-9]+\\/?$",
            "section" : "overview"
        }
    ],

    "header" : {
        "home" : "Los Angeles"
    },

    "schedule_prompt" : {
        "title" : "Schedule it",
        "default_note" : "Type your note here",
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
        "district" : {
            "items" : [
                {
                    "id" : "downtown",
                    "name" : "DownTown",
                    "color" : "#f00"
                },
                {
                    "id" : "eastside",
                    "name" : "Eastside",
                    "color" : "#f00"
                },
                {
                    "id" : "south-central",
                    "name" : "South Central",
                    "color" : "#f00"
                },
                {
                    "id" : "westside",
                    "name" : "Westside",
                    "color" : "#f00"
                }
            ]
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

    "locations" : [
        {
            "id": "arroyo-seco-historic-parkway",
            "name": "Arroyo Seco Historic Parkway ",
            "mood": "do",
            "district": "downtown",
            "description": "(starts at the intersection of the CA-110 and the CA-101, heading north from that junction), [33]. Drive the Parkway, a National Scenic Byway that runs for 9.4 miles (15.1 km) between Downtown Los Angeles and Pasadena. The Parkway passes from the skyscrapers of Downtown, through Chinatown into the Arts-and-Crafts style neighborhoods of South Pasadena and ends in Pasadena at Colorado Blvd., home to the famous Rose Parade.",
            "image": "assets/images/locations/0.jpg",
            "like": 8
        },
        {
            "id": "angels-flight-351-south-hill-street",
            "name": "Angel's Flight, 351 South Hill Street",
            "mood": "do",
            "district": "downtown",
            "description": "(on the north side of Grand Central Market), [34]. 6:45am-10pm. Ride the world's shortest railway - at only 298'(91m) long, Angel's Flight is functionally an elevator which takes you from Hill Street to California Plaza on Grand Ave. For only 50 cents! $0.50.",
            "image": "assets/images/locations/1.jpg",
            "like": 37
        },
        {
            "id": "downtown-art-walk",
            "name": "Downtown Art Walk",
            "mood": "do",
            "district": "downtown",
            "description": "A free monthly self guided tour--and free walking tours, reservations required--held on the second Thursday of every month, to art galleries and museums in Downtown L.A.",
            "image": "assets/images/locations/2.jpg",
            "like": 70
        },
        {
            "id": "la-conservancy-walking-tours",
            "name": "L.A. Conservancy Walking Tours",
            "mood": "do",
            "district": "downtown",
            "description": "See the grand Vaudeville/Movie theaters of the 20s and the impressive Art Deco office buildings in several easy to handle walking tours. Strongly recommended for those wanting to grasp a feel of LA's history. Reservations are strongly recommended.",
            "image": "assets/images/locations/2.jpg",
            "like": 46
        },
        {
            "id": "las-angelitas-del-pueblo",
            "name": "Las Angelitas del Pueblo",
            "mood": "do",
            "district": "downtown",
            "description": "This is a group of volunteer docents who give free tours of El Pueblo de Los Angeles to the public.",
            "image": "assets/images/locations/1.jpg",
            "like": 32
        },
        {
            "id": "raymond-chandlers-los-angeles",
            "name": "Raymond Chandler's Los Angeles",
            "mood": "do",
            "district": "downtown",
            "description": "In A Lonely Place bus tour, [38]. An occasional bus tour of sites downtown and in Hollywood from the films, books and lives of Raymond Chandler and his anti-hero Philip Marlowe. $58, includes snacks.",
            "image": "assets/images/locations/0.jpg",
            "like": 12
        },
        {
            "id": "the-real-black-dahlia-bus-tour",
            "name": "The Real Black Dahlia bus tour",
            "mood": "do",
            "district": "downtown",
            "description": "A true crime and social history tour that intimately explores the last weeks of Elizabeth Short's life, asking not \"who killed her?\" but \"who was she?\" $58.",
            "image": "assets/images/locations/0.jpg",
            "like": 77
        },
        {
            "id": "john-fantes-dreams-of-bunker-hill-bus-and-walking-tour",
            "name": "John Fante's Dreams of Bunker Hill bus and walking tour",
            "mood": "do",
            "district": "downtown",
            "description": "An occasional bus and walking tour of sites downtown and in Hollywood from the life and work of novelist John Fante and his great fan Charles Bukowski, plus crime scenes from forgotten horrors of old Bunker Hill, Sonora Town and beyond. $58, includes snacks.",
            "image": "assets/images/locations/0.jpg",
            "like": 41
        },
        {
            "id": "staples-center",
            "name": "Staples Center",
            "mood": "do",
            "district": "downtown",
            "description": "Home to five of LA's pro sports franchises; Lakers (NBA), Kings (NHL), Clippers (NBA), Avengers (AFL), and Sparks (WNBA), plus many concerts, shows and conventions.",
            "image": "assets/images/locations/0.jpg",
            "like": 97
        },
        {
            "id": "dodger-stadium",
            "name": "Dodger Stadium",
            "mood": "do",
            "district": "downtown",
            "description": "Home to the Los Angeles Dodgers, Major League Baseball franchise of the National League.",
            "image": "assets/images/locations/0.jpg",
            "like": 79
        },
        {
            "id": "los-angeles-memorial-coliseum",
            "name": "Los Angeles Memorial Coliseum",
            "mood": "do",
            "district": "downtown",
            "description": "Home to the University of Southern California Trojans NCAA football team, members of the Pacific Twelve conference. Site was host to the Olympics in 1932 and 1984, the home to LA's former NFL franchises the Los Angeles Rams and Raiders from 1946-1979 and 1982-1994 respectively, and the home of UCLA football until 1982, when they moved to the Rose Bowl.",
            "image": "assets/images/locations/0.jpg",
            "like": 95
        },
        {
            "id": "chinatown",
            "name": "Chinatown",
            "mood": "see",
            "district": "downtown",
            "description": "Primarily centered around North Broadway; unlike Chinatowns in many other cities, it has a wide, main, busy street filled with small shops and restaurants. At about the middle point of N. Broadway in Chinatown is an open market much like those found in Hong Kong. Be sure to haggle!",
            "image": "assets/images/locations/0.jpg",
            "like": 31
        },
        {
            "id": "little-tokyo",
            "name": "Little Tokyo",
            "mood": "see",
            "district": "downtown",
            "description": "Also known as J-Town, the Japanese district features restaurants, museums, and shops. It sits in the area between Temple and about 5th and Spring through Alameda.",
            "image": "assets/images/locations/0.jpg",
            "like": 83
        },
        {
            "id": "olvera-street",
            "name": "Olvera Street",
            "mood": "see",
            "district": "downtown",
            "description": "This is where LA was founded as El Pueblo de Los Angeles. You can take a tour of the city's oldest house to see what it looked like at that time. The plaza is mostly filled with Mexican trinket stands and Mexican restaurants.",
            "image": "assets/images/locations/0.jpg",
            "like": 78
        },
        {
            "id": "museum-of-contemporary-art",
            "name": "Museum of Contemporary Art ",
            "mood": "see",
            "district": "downtown",
            "description": "250 S. Grand Avenue, Los Angeles, CA, 90012, Tel: +1-213-626-6222, [24]. Th-M: 11AM-5PM. The permanent collection is fairly interesting, but the changing exhibitions can be more hit or miss. The museum has no 'traditional' art, so bring an open mind. The gift shop (free entrance) is fun for at least 20 minutes of wonder and awe. $12, $7 student (includes admission to Geffen Contemporary).",
            "image": "assets/images/locations/0.jpg",
            "like": 9
        },
        {
            "id": "geffen-contemporary",
            "name": "Geffen Contemporary",
            "mood": "see",
            "district": "downtown",
            "description": "152 N. Central Avenue, Los Angeles, CA, 90013, [25]. A branch of MOCA tucked away in Little Tokyo. Same opening hours and shared tickets as MOCA on Grand.",
            "image": "assets/images/locations/0.jpg",
            "like": 45
        },
        {
            "id": "japanese-american-national-museum",
            "name": "Japanese American National Museum",
            "mood": "see",
            "district": "downtown",
            "description": "369 E. First Street, Los Angeles, CA, 90012, Tel: +1-213-625-0414, [26]. Tu-Su: 10AM-5PM. Covers the Japanese-American experience, with a special emphasis on the concentration camps of World War II. $8.",
            "image": "assets/images/locations/0.jpg",
            "like": 54
        },
        {
            "id": "old-plaza-firehouse",
            "name": "Old Plaza Firehouse",
            "mood": "see",
            "district": "downtown",
            "description": "134 Paseo de la Plaza, Tel: +1 213 625-3741. Tu-F: 10AM-3PM, Sa-Su: 10AM-4:30PM. This was the original fire station for the City of Los Angeles. Built in 1884, it has been restored to its original condition. The knowledgeable docents offer a peek into Los Angeles in the 19th Century. Free (donations accepted).",
            "image": "assets/images/locations/0.jpg",
            "like": 29
        },
        {
            "id": "grammy-museum",
            "name": "Grammy Museum",
            "mood": "see",
            "district": "downtown",
            "description": "800 W. Olympic Boulevard (entrance on Figueroa St), Tel: +1-213-765-6800, [27]. M-F 11:30AM-7:30PM, Sa-Su 10AM-7:30PM. History of music, with listening posts. Adult $12.95.",
            "image": "assets/images/locations/0.jpg",
            "like": 65
        },
        {
            "id": "fashion-institute-of-design-merchandising",
            "name": "Fashion Institute of Design & Merchandising ",
            "mood": "see",
            "district": "downtown",
            "description": "919 S. Grand Avenue, Los Angeles, CA, 90015, Tel: +1-800-624-1200, +1-213-624-1201, [28]. Gorgeous campus of FIDM and ongoing free exhibits make this a pleasant way to kill a couple of hours.",
            "image": "assets/images/locations/0.jpg",
            "like": 39
        },
        {
            "id": "the-los-angeles-central-public-library",
            "name": "The Los Angeles Central Public Library",
            "mood": "see",
            "district": "downtown",
            "description": "630 W. 5th Street, Los Angeles, CA, 90071, Tel: +1-213-228-7000, [29]. Huge library rebuilt in the 1980s and '90s. Almost always has a public exhibition going.",
            "image": "assets/images/locations/0.jpg",
            "like": 19
        },
        {
            "id": "music-center-and-disney-hall",
            "name": "Music Center and Disney Hall",
            "mood": "see",
            "district": "downtown",
            "description": "Impressive hall architecture complete with tours most days. The Dorothy Chandler Pavilion is open to the public Christmas Eve day with almost round the clock performances by amateur cultural arts groups. The Walt Disney Hall has daily tours, check website for schedules. 135 N. Grand Avenue, Los Angeles, CA, 90012, Tel: +1-213-972-7211 (general@musiccenter.org)",
            "image": "assets/images/locations/0.jpg",
            "like": 56
        },
        {
            "id": "the-bradbury-building",
            "name": "The Bradbury Building",
            "mood": "see",
            "district": "downtown",
            "description": "304 South Broadway, Los Angeles, CA, 90013. Built in 1893, the Bradbury Building is one of Southern California's most remarkable architectural achievements. Behind its modest exterior lies a magical light-filled Victorian court that rises 50 feet with open cage elevators, marble stairs and ornate iron railings. The building has been a set for many movies, including Blade Runner in 1982. Visitors without business in the building are allowed into the lobby and up to the first landing of the staircase.",
            "image": "assets/images/locations/0.jpg",
            "like": 62
        },
        {
            "id": "the-cathedral-of-our-lady-of-the-angels",
            "name": "The Cathedral of Our Lady of the Angels",
            "mood": "see",
            "district": "downtown",
            "description": "555 W. Temple Street (between Grand Ave & Hill St), Tel: +1 213 680-5200 (info@olacathedral.org), [31]. 6:30AM-6PM M-F, 9AM-6PM, Sa 7AM-6PM Su, hours extended to 7PM during daylight savings time. This large and austere cathedral, dedicated to Saint Vibiana, is the head of the Archdiocese of Los Angeles. It was opened in 2002 at a cost of nearly $200 million, replacing The Cathedral of St Vibiana which was heavily damaged in the 1994 earthquake.",
            "image": "assets/images/locations/0.jpg",
            "like": 84
        },
        {
            "id": "library-tower",
            "name": "Library Tower ",
            "mood": "see",
            "district": "downtown",
            "description": "633 W. Fifth Street, Los Angeles, CA, 90071 (across Fifth Street from the downtown central library). At 73 floors and 1,017 feet, it is said to be the tallest building between Chicago and Hong Kong. Note to photographers: the Library Tower's security personnel will try to discourage you from taking pictures of this building. As long as you are standing on a public sidewalk you may legally take any picture you like in the United States.",
            "image": "assets/images/locations/0.jpg",
            "like": 9
        },
        {
            "id": "st-vincent-court",
            "name": "St. Vincent court",
            "mood": "see",
            "district": "downtown",
            "description": "7th Street, between Broadway and Hill, [32]. A tranquil hideaway tucked in the heart of the Jewelry District.",
            "image": "assets/images/locations/0.jpg",
            "like": 85
        },
        {
            "id": "the-theater-district",
            "name": "The Theater District",
            "mood": "see",
            "district": "downtown",
            "description": "The Theater District along Broadway has been converted to discount jewelry, electronics and ethnic shops, but much of the architecture and the marquees remain.",
            "image": "assets/images/locations/0.jpg",
            "like": 55
        },
        {
            "id": "union-station",
            "name": "Union Station",
            "mood": "see",
            "district": "downtown",
            "description": "No trip to downtown LA would be complete without a visit to the historic train station, built in 1939 with a Spanish mission exterior. The large waiting room and restaurant is like it was in the 1940s. It is used in lots of movies, including Blade Runner, where the main hall was used as the police station.",
            "image": "assets/images/locations/0.jpg",
            "like": 63
        },
        {
            "id": "fashion-district",
            "name": "Fashion District",
            "mood": "buy",
            "district": "downtown",
            "description": "Where style and cheap textiles smash together. Important for the addicted shopper. You can find the district in the Southeast corner of Downtown roughly where Spring and Main meet going Southeast.",
            "image": "assets/images/locations/0.jpg",
            "like": 83
        },
        {
            "id": "flower-district",
            "name": "Flower District",
            "mood": "buy",
            "district": "downtown",
            "description": "The best place to get the best cut and potted flowers and plants, plus just a great site to see.",
            "image": "assets/images/locations/0.jpg",
            "like": 54
        },
        {
            "id": "jewelry-district",
            "name": "Jewelry District",
            "mood": "buy",
            "district": "downtown",
            "description": "Wonder where all of those West Coast Rappers get their bling bling? Well, if they are frugal, they get it in the Jewelry District. Bounded by Olive-Broadway and 6th-7th, it is conveniently close to Pershing Square (parking and Red line access).",
            "image": "assets/images/locations/0.jpg",
            "like": 74
        },
        {
            "id": "mikawaya",
            "name": "Mikawaya",
            "mood": "buy",
            "district": "downtown",
            "description": "Their moto says it best: \"The finest name in Japanese pastries since 1910\"",
            "image": "assets/images/locations/0.jpg",
            "like": 51
        },
        {
            "id": "capucci-optics",
            "name": "Capucci Optics",
            "mood": "buy",
            "district": "downtown",
            "description": "Great place to get a pair of great glasses, sunglasses or contacts at a reasonable price. Ask for Fatima for friendly service.",
            "image": "assets/images/locations/0.jpg",
            "like": 75
        },
        {
            "id": "santee-alley",
            "name": "Santee Alley",
            "mood": "buy",
            "district": "downtown",
            "description": "Home of knock off designer labels and everything else you could possibly imagine, located between Santee Street and Maple Avenue, starting on Olympic Boulevard.",
            "image": "assets/images/locations/0.jpg",
            "like": 31
        },
        {
            "id": "cliftons-cafeteria",
            "name": "Clifton's Cafeteria",
            "mood": "eat",
            "district": "downtown",
            "description": "648 S. Broadway, Los Angeles, CA, 90014 (Downtown), Tel: +1-213-627-1673, [46]. Daily: 6:30AM-7:30PM. Since 1935, located on Broadway, serves cafeteria style food. One should experience the history, the food at affordable prices, and of course view the redwood forest theme. (currently closed for renovations)",
            "image": "assets/images/locations/0.jpg",
            "like": 72
        },
        {
            "id": "coles-pacific-electric-buffet",
            "name": "Cole's Pacific Electric Buffet",
            "mood": "eat",
            "district": "downtown",
            "description": "118 E. 6th Street, Los Angeles, CA, 90014 (on 6th, between Main and Los Angeles), Tel: +1-213-622-4090 (amazarei@colespebuffet.com), [47]. Daily: 9AM-10PM. Bar/restaurant in nearly continuous operation since 1908, but recently shut for a year and a extensive upscale redesign. Along with Philippe The Original, one of the possible originators of the French Dip sandwich.",
            "image": "assets/images/locations/0.jpg",
            "like": 81
        },
        {
            "id": "empress-pavilion",
            "name": "Empress Pavilion",
            "mood": "eat",
            "district": "downtown",
            "description": "988 N. Hill Street, Los Angeles, CA, 90012 (Chinatown), Tel: +1-213-617-9898. Most people come here for the dim sum on carts but there is also a menu.",
            "image": "assets/images/locations/0.jpg",
            "like": 25
        },
        {
            "id": "famima",
            "name": "Famima ",
            "mood": "eat",
            "district": "downtown",
            "description": "Daily: 6:00AM-10:00PM, some are 24 hr. Famima is a convenience store similar to 7-11 but with a fantastic selection of prepackaged lunches, snacks, drinks and fresh fruit. Has a selection of asian drinks, candies, and even hot pork buns at the front counter. $2-$10.",
            "image": "assets/images/locations/0.jpg",
            "like": 24
        },
        {
            "id": "frying-fish",
            "name": "Frying Fish",
            "mood": "eat",
            "district": "downtown",
            "description": "120 Japanese Village Plaza (Little Tokyo), Tel: 213-680-0567. Sushi restaurant with a food conveyor belt built into the bar, located in the Japanese village. Don't miss the excellent California roll!",
            "image": "assets/images/locations/0.jpg",
            "like": 92
        },
        {
            "id": "grand-central-market",
            "name": "Grand Central Market",
            "mood": "eat",
            "district": "downtown",
            "description": "317 S. Broadway, Los Angeles, CA, 90013, Tel: +1-213-624-2378, [49]. Daily 9AM-6PM. Huge indoor bazaar of Central and South American vendors. Get fresh tortillas, huge Mexican papayas and tasty Tortas. On Hill and Broadway between 3rd and 4th (closer to 3rd). Conveniently near the Bradbury Building (unique architecture) and the Pershing Square Red line stop (Northeast access).",
            "image": "assets/images/locations/0.jpg",
            "like": 71
        },
        {
            "id": "the-original-pantry-cafe",
            "name": "The Original Pantry Cafe",
            "mood": "eat",
            "district": "downtown",
            "description": "877 S. Figueroa Street, Los Angeles, CA, 90017, Tel: +1-213-972-9279. The Pantry boasts that it has never closed or been without a customer since it first opened in 1924. (Want proof? The front entrance has no lock on it). Come here on any morning and you will see a line stretching around the block - the wait is worth it, and the fast service will have hot plate of food in front of you within minutes of sitting down. Best place for breakfast after midnight. Cash only.",
            "image": "assets/images/locations/0.jpg",
            "like": 78
        },
        {
            "id": "original-tommys",
            "name": "Original Tommy's",
            "mood": "eat",
            "district": "downtown",
            "description": "2575 W. Beverly Blvd, Los Angeles, CA, 90057 (On the corner of Beverly and Rampart just west of Downtown Los Angeles), Tel: +1-213-389-9060, [50]. Open 24 hours/7 days a week. A Los Angeles landmark since 1946 Tommy's is a can't-miss for any hamburger lover. Serving hamburgers, french fries, hot dogs, and tamales with their \"secret blend\" of chili you will always find a line for food at all hours, especially late night/early mornings.",
            "image": "assets/images/locations/0.jpg",
            "like": 50
        },
        {
            "id": "philippes",
            "name": "Philippe's",
            "mood": "eat",
            "district": "downtown",
            "description": "1001 N. Alameda Street, Los Angeles, CA, 90012 (Chinatown, one block from Union Station), Tel: +1-213-628-3781, [51]. Daily: 6AM-10PM. Aaaah...an LA landmark situated a couple of blocks north of Olvera St. and Union Station is a nostalgic shop with hay and sawdust covered floors. Famous for their 'French Dip' sandwiches dipped in au jus ($4.90), but the real reason to go is the atmosphere and the pastrami — the joint opened in 1908 and the menu still features things like pickled eggs and pig's feet. Coffee is ten cents a cup, but their 60-cent lemonade is even more popular. Expect to queue at any time and the place is mobbed on the nights of Lakers and Dodgers games.",
            "image": "assets/images/locations/0.jpg",
            "like": 58
        },
        {
            "id": "senor-fish",
            "name": "Señor Fish",
            "mood": "eat",
            "district": "downtown",
            "description": "422 E 1st Street, Los Angeles, CA, 90012, Tel: +1-213-625-0566. Not really authentic -- it's sort of a variation on Baja-style Mexican -- Senor Fish downtown does just one thing well, but they do it better than anyone. Luckily, that one thing is an important thing: grilled fish tacos. Grilled, not fried. Their Shrimp Taco is amazing as well.",
            "image": "assets/images/locations/0.jpg",
            "like": 55
        },
        {
            "id": "spring-street-smokehouse",
            "name": "Spring Street Smokehouse",
            "mood": "eat",
            "district": "downtown",
            "description": "640 N. Spring Street, Los Angeles, CA 90012 (in China Town, on Cesar Chavez and North Spring), Tel: +1-213-626-0535, [52]. M-Tu: 10:30AM-8PM, Wednesday-Friday: 10:30AM-9PM, Sat: 12PM-9PM. The best barbecue in town. 27 microbrews.",
            "image": "assets/images/locations/0.jpg",
            "like": 43
        },
        {
            "id": "weiland-brewery",
            "name": "Weiland Brewery",
            "mood": "eat",
            "district": "downtown",
            "description": "400 E. 1st Street, Los Angeles, CA, 90012 (in Little Tokyo, on Central and First), Tel: +1-213-680-2881, [53]. M-F: 11AM-2AM, Sat: 5PM-2AM. The cheese fries are to die for. Very affordable place for drinks. One of the few bars with a weekend happy hour lasting until 2AM",
            "image": "assets/images/locations/0.jpg",
            "like": 91
        },
        {
            "id": "engine-co-no-28",
            "name": "Engine Co. No. 28",
            "mood": "eat",
            "district": "downtown",
            "description": "Comfort food at its best. A restored actual fire station that churns out LA's best meatloaf, fried chicken and lemonade, all in an elegant atmosphere with great service.",
            "image": "assets/images/locations/0.jpg",
            "like": 13
        },
        {
            "id": "j-restaurant-lounge",
            "name": "J Restaurant & Lounge",
            "mood": "eat",
            "district": "downtown",
            "description": "1119 S. Olive St (at 11th St), Tel: +1-800-850-6074, [55]. Dining and entertainment, located near the Staples Center. The vibe is equal parts hip and casual; the large space has a glitzy lounge, featuring live music, and a mega patio with fire pit and skyline views of the city. Inspired décor. Menu is Mediterranean-meets-American.",
            "image": "assets/images/locations/0.jpg",
            "like": 99
        },
        {
            "id": "kendalls-brasserie",
            "name": "Kendall's Brasserie",
            "mood": "eat",
            "district": "downtown",
            "description": "135 N. Grand Ave (at the Music Center), Tel: +1-213-972-7322, [56]. Great French menu at a perfect location to catch any of the great evening programs at the surrounding venues. Whatever you order, do not miss their French Fries! Mains from $15.",
            "image": "assets/images/locations/0.jpg",
            "like": 75
        },
        {
            "id": "the-nickel-diner",
            "name": "The Nickel Diner ",
            "mood": "eat",
            "district": "downtown",
            "description": "524 S Main St (between 5th & 6th), [57]. 8am-3pm, 6pm-10:30pm, closed Mondays. early 1900s style diner, lots of choices for breakfast (try the polenta, or the mountain of french toast) and home of novelty pastries - bacon donuts, homemade pop tarts! Open for lunch & dinner, too. $7-$15.",
            "image": "assets/images/locations/0.jpg",
            "like": 42
        },
        {
            "id": "riordans-tavern",
            "name": "Riordan's Tavern",
            "mood": "eat",
            "district": "downtown",
            "description": "875 South Figueroa St., Tel: +1 213-627-6879 (info@riordanstavern.com), [58]. Good (but slightly pricey) pub food in the heart of downtown near the Staples Center. The Mayor's Burger is a one pound beast with chili, bacon, and all the fixings, or you can try the daily carvery sandwich. Steaks and seafood are also decent, and the drinks are poured stiff. $15-$30.",
            "image": "assets/images/locations/0.jpg",
            "like": 49
        },
        {
            "id": "royale",
            "name": "Royale",
            "mood": "eat",
            "district": "downtown",
            "description": "2619 Wilshire Blvd (inside Wilshire Royale Hotel), Tel: +1-213-388-8488. Located in the renovated Wilshire Royale Hotel, Chef Eric Ernest's new, culinary digs features a groovy cocktail lounge and menu that’s described as \"sophisticated yet approachable.\"",
            "image": "assets/images/locations/0.jpg",
            "like": 9
        },
        {
            "id": "the-wood-spoon",
            "name": "The Wood Spoon",
            "mood": "eat",
            "district": "downtown",
            "description": "107 W 9th St, Tel: +1-213-629-1765, [59]. M 11AM-3PM, T-Fr 11AM-3PM, 6PM-9PM, Sa 12PM-3PM, 6PM-10PM, closed Sunday. Located in a relatively non-descript setting downtown, this restaurant features Brazilian-inspired dishes that are different from what most American restaurants serve as \"Brazilian\". Rice, beans and plantains are in use, but entrees such as a Brazilian-inspired pot pie and cinnamon water will be new to most diners. Jacqueline, the very gracious chef, will usually make the rounds once the kitchen closes and can tell some very interesting stories about her life after coming to the States. $10-$20 per person.",
            "image": "assets/images/locations/0.jpg",
            "like": 7
        },
        {
            "id": "yang-chow",
            "name": "Yang Chow",
            "mood": "eat",
            "district": "downtown",
            "description": "819 N Broadway (at Alpine Street), Tel: +1-213-625-0811, [60]. Located in Chinatown. Award-winning restaurant. Be sure to order the slippery shrimp and the dry sauteed vegetables (green beans and asparagus).",
            "image": "assets/images/locations/0.jpg",
            "like": 91
        },
        {
            "id": "yorkshire-grill",
            "name": "Yorkshire Grill",
            "mood": "eat",
            "district": "downtown",
            "description": "610 W 6th St (6th st & Grand), Tel: 213-623-3362. M-F 6:00 AM -3:30 PM, SAT 8:00 AM - 2:30 PM. Yorkshire Grill has been operating since 1954, with many a lucrative business deal having been negotiated over the famous Yorkshire pastrami sandwich. Open early, the Yorkshire breakfast dishes are some of the best in the area and their old school diner coffee will get you off to a strong start to your day! Lunch is always packed at Yorkshire so be sure to get there early, however Yorkshire also offers delivery to your home or place of business. $10.",
            "image": "assets/images/locations/0.jpg",
            "like": 15
        },
        {
            "id": "zucca",
            "name": "Zucca",
            "mood": "eat",
            "district": "downtown",
            "description": "801 S. Figueroa St (at Eighth Ave), Tel: +1-213-614-7800. Joachim Splichal (of Patina) and chef Giancarlo Gottardo strike the right chord with their sleek, alluring bistro featuring classic Italian fare. The pastas and fresh fish are wonderful - one entrée representing every major region in Italy. Between the cuisine and pleasing milieu, it's quite a lovely dining experience.",
            "image": "assets/images/locations/0.jpg",
            "like": 48
        },
        {
            "id": "cafe-pinot",
            "name": "Cafe Pinot",
            "mood": "eat",
            "district": "downtown",
            "description": "A romantic French/Italian restaurant and a unique setting as part of the central library's front yard.",
            "image": "assets/images/locations/0.jpg",
            "like": 10
        },
        {
            "id": "ciao-trattoria",
            "name": "Ciao Trattoria",
            "mood": "eat",
            "district": "downtown",
            "description": "815 W. Seventh St (near Figueroa), [62]. Harry Hagani's homage to fantastic Italian food is a cozy and elegant restaurant popular at lunchtime with the busy executive crowd.",
            "image": "assets/images/locations/0.jpg",
            "like": 31
        },
        {
            "id": "cicada",
            "name": "Cicada",
            "mood": "eat",
            "district": "downtown",
            "description": "617 S. Olive St (at 7th St), Tel: +1-213-488-9488. M-Fr 5:30PM-9PM. Situated in the beautiful Arts Deco Oviatt Building, Cicada deftly blends elegance of design and superior Italian fare. A chic bar is upstairs, complete with marble dance floor. A perfect place for special occasions, a fine meal before the theatre or just any excuse to be dazzled, both by the atmosphere and the cooking.",
            "image": "assets/images/locations/0.jpg",
            "like": 66
        },
        {
            "id": "nick-and-stefs",
            "name": "Nick and Stef's",
            "mood": "eat",
            "district": "downtown",
            "description": "330 South Hope St, [63]. Fantastic steak house, run by the Patina restaurant empire. If you like beef, this is some of the best in town, with a glass-enclosed aging room where you can view the meat as it ages. Try the dry-aged Ribeye, it will make your head spin. They also have 12 kinds of potatoes on the menu. Not sure why, but they're all good. In the Wells Fargo Center, across from MOCA.",
            "image": "assets/images/locations/0.jpg",
            "like": 79
        },
        {
            "id": "pacific-dining-car",
            "name": "Pacific Dining Car",
            "mood": "eat",
            "district": "downtown",
            "description": "1310 West 6th St, [64]. Don't be surprised if you run into a city politician or other public figuers in this LA landmark that is located partly inside a railway train car, and has been open since 1921. Ask for the breakfast menu any time, day or night, for a more affordable and quite delicious menu.",
            "image": "assets/images/locations/0.jpg",
            "like": 38
        },
        {
            "id": "the-palm",
            "name": "The Palm",
            "mood": "eat",
            "district": "downtown",
            "description": "The Palm is a casual white tablecloth restaurant with a mix of Italian, seafood and great steaks. Check out the collection of caricatures on the walls too.",
            "image": "assets/images/locations/0.jpg",
            "like": 35
        },
        {
            "id": "traxx",
            "name": "Traxx",
            "mood": "eat",
            "district": "downtown",
            "description": "Fancy-Schmansy restaurant in Union Station. Good food, pricey but the ambiance of Union Station makes it worth a splurge.",
            "image": "assets/images/locations/0.jpg",
            "like": 73
        },
        {
            "id": "water-grill",
            "name": "Water Grill",
            "mood": "eat",
            "district": "downtown",
            "description": "The best seafood and overall service period. Perhaps a bit pricey, but elegant and wonderful.",
            "image": "assets/images/locations/0.jpg",
            "like": 94
        }
    ]


}
