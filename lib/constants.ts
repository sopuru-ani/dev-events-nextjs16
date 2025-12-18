type Event = {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: Event[] = [
  {
    title: "React Conf 2025",
    image: "/images/event1.png",
    slug: "react-conf-2025",
    location: "Las Vegas, NV",
    date: "2025-12-20",
    time: "10:00 AM",
  },
  {
    title: "JSConf EU 2025",
    image: "/images/event2.png",
    slug: "jsconf-eu-2025",
    location: "Berlin, Germany",
    date: "2025-12-22",
    time: "9:00 AM",
  },
  {
    title: "Google I/O Extended",
    image: "/images/event3.png",
    slug: "google-io-extended-2025",
    location: "Online",
    date: "2025-12-25",
    time: "12:00 PM",
  },
  {
    title: "DevFest 2025",
    image: "/images/event4.png",
    slug: "devfest-2025",
    location: "New York, NY",
    date: "2025-12-28",
    time: "11:00 AM",
  },
  {
    title: "MLH Hackathon",
    image: "/images/event5.png",
    slug: "mlh-hackathon-2025",
    location: "San Francisco, CA",
    date: "2026-01-05",
    time: "8:00 AM",
  },
  {
    title: "TechCrunch Disrupt",
    image: "/images/event6.png",
    slug: "techcrunch-disrupt-2025",
    location: "Austin, TX",
    date: "2026-01-10",
    time: "9:30 AM",
  },
];