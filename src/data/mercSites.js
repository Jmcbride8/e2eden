// Proposed research sites and consortium leads for the MERC proposal.
// One entry per site, one consortium lead per site.

export const SITES = [
  {
    id: "california",
    label: "Proposed Research Site",
    name: "UC Desert Research & Extension Center",
    location: "Holtville, Imperial Valley, CA · Prospective collaboration",
    blurb:
      "The site we are proposing for our proof-of-concept field trial: an instrumented comparison of cooled and untreated plots in one of the hottest, driest agricultural regions on Earth. This is a planned trial, not an operating E2Eden farm.",
    image_key: "iv_pilot_project",
    image_default:
      "https://base44.app/api/apps/6993b7c68cee7955d3266d09/files/public/6993b7c68cee7955d3266d09/fa3b93fe7_darla-hueske-fqoq39Jj5us-unsplash.jpg",
    image_alt: "UC Desert Research Center Pilot Farm",
    lead: "Jason McBride · U.S. Investigator, E2Eden",
  },
  {
    id: "israel",
    label: "Proposed Research Site",
    name: "Arava Institute for Environmental Studies",
    location: "Kibbutz Ketura, Arava Valley, Israel · Sabha desalination brine",
    blurb:
      "The Israeli pilot site will use brine discharge from the Sabha desalination plant, which supplies potable water to Eilat, on plots irrigated from brackish groundwater. Temperature, humidity, vapour-pressure deficit, wind and crop water use are measured against untreated plots. A proposed site: field work begins only if the proposal is funded.",
    image_key: "merc_site_israel",
    image_default:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a0/PikiWiki_Israel_41827_Yair_experimental_station_in_Arava_valley.JPG/1280px-PikiWiki_Israel_41827_Yair_experimental_station_in_Arava_valley.JPG",
    image_alt: "Experimental agricultural station in the Arava valley",
    lead: "Dr. Clive Lipchin · Prime Investigator, AIES",
    image_credit:
      "Yair agricultural research station, Arava Valley · Dr. Avishai Teicher / Pikiwiki Israel, CC BY 2.5",
  },
  {
    id: "jordan",
    label: "Proposed Research Site",
    name: "Khayrat Wadi Araba First Agriculture Investment Company",
    location: "Aqaba Governorate, Wadi Araba, Jordan · Brackish groundwater",
    blurb:
      "KWA will host the Jordanian pilot site on a working farm that irrigates from brackish groundwater. The same instrumentation, control hardware and test protocol as Israel and California are applied to locally relevant crops, water sources and soils. A proposed site, not an operating E2Eden facility.",
    image_key: "merc_site_jordan",
    image_default:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Aqaba%2C_p%C4%9Bstov%C3%A1n%C3%AD_zeleniny.jpg/1280px-Aqaba%2C_p%C4%9Bstov%C3%A1n%C3%AD_zeleniny.jpg",
    image_alt: "Vegetable plots outside Aqaba, Jordan",
    lead: "Waddah Maayta · MENA Investigator, CEO of KWA",
    image_credit:
      "Vegetable growing near Aqaba, Jordan · Aktron / Wikimedia Commons, CC BY-SA 4.0",
  },
];

export const CONSORTIUM = [
  {
    region: "Israel",
    name: "Dr. Clive Lipchin",
    organization: "Arava Institute for Environmental Studies (AIES)",
    focus:
      "Prime Investigator. Leads the Israeli field site and, with KWA, the shared Israel–Jordan research framework.",
  },
  {
    region: "Jordan",
    name: "Waddah Maayta",
    organization: "Khayrat Wadi Araba First Agriculture Investment Company (KWA)",
    focus:
      "MENA Investigator. Leads the Jordanian field site and the joint water, materials and microclimate work.",
  },
  {
    region: "United States",
    name: "Jason McBride",
    organization: "E2Eden LLC",
    focus:
      "U.S. Investigator. Defines the shared instrumentation, controls and cloud-data system and runs the Imperial Valley test site.",
  },
];