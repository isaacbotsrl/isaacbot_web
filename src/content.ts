// All copy for the home page, plus the site-wide constants the Ardennes page shares.

export const site = {
  company: "Isaacbot",
  product: "Ardennes",
  slogan: "From a falling apple to autonomous logistics.",
  contactEmail: "potlogradu@gmail.com",
  year: 2026,
};

export type NavItem = { label: string; href: string };

export const nav: NavItem[] = [
  { label: "Projects", href: "#projects" },
  { label: "Mission", href: "#mission" },
  { label: "Team", href: "#team" },
];

export const hero = {
  eyebrow: `${site.company} · Rovers & Manipulators`,
  titleLines: ["From a falling apple", "to autonomous logistics."],
  lead:
    "Newton watched an apple fall and wrote down the laws of motion. Isaacbot puts those laws to work: " +
    "autonomous rovers that move goods and robotic manipulators that handle them.",
  primaryCta: { label: "Our projects", href: "#projects" },
  secondaryCta: { label: "Get in touch", href: "#contact" },
};

export const techLinks: NavItem[] = [
  { label: "ROS 2", href: "https://www.ros.org/" },
  { label: "Gazebo Simulation", href: "https://gazebosim.org/" },
  { label: "Foxglove", href: "https://foxglove.dev/" },
  { label: "Zenoh", href: "https://zenoh.io/" },
];

export const project = {
  eyebrow: "Project highlights",
  titleLines: ["Ardennes.", "Rugged autonomy, built for the field."],
  paragraphs: [
    "Ardennes is a four-wheel-drive mobile robot platform for outdoor and indoor work. Strong drivetrain, " +
      "an industrial safety chain and a full ROS 2 stack, ready for your mission.",
    "Four independently driven 13-inch wheels carry sensors, tools and payloads outdoors and on workshop " +
      "floors alike. The aluminium-profile frame lets you bolt on what your project needs, and a low centre " +
      "of mass with a side tip-over angle of about 55° keeps it stable when the ground is not.",
  ],
  cta: { label: "Learn more", href: "/ardennes", newTab: true },
  image: {
    src: "/images/rover_front34_transparent.png",
    alt: "Ardennes rover, front three-quarter view",
    width: 1034,
    height: 979,
  },
  stats: [
    { value: "59", unit: "kg", label: "Platform mass" },
    { value: "0.95", unit: "m/s", label: "Top speed" },
    { value: "4 × 250", unit: "W", label: "Brushed DC gear motors" },
    { value: "24 V", unit: "40 Ah", label: "LiFePO4 battery" },
    { value: "13", unit: "in", label: "All-terrain wheels" },
    { value: "55", unit: "°", label: "Side tip-over angle" },
  ],
};

export const mission = {
  eyebrow: "Mission & Vision",
  titleLines: ["The laws of motion,", "put to work."],
  columns: [
    {
      label: "Our mission",
      text:
        "To give logistics teams robots they can trust: rovers and manipulators that move and handle goods " +
        "safely and predictably, around the clock, so people can focus on the work that needs them.",
    },
    {
      label: "Our vision",
      text:
        "A world where moving goods feels as natural as gravity. Every warehouse, yard and workshop is served " +
        "by autonomous machines that are open, safe by design and simple to work with.",
    },
  ],
  valuesLabel: "Our core values",
  values: ["Safety first", "Open by design", "Built to last", "Simplicity"],
};

export type TeamMember = { name: string; role: string; quote: string; photo?: string };

export const team: {
  eyebrow: string;
  titleLines: string[];
  intro: string;
  members: TeamMember[];
} = {
  eyebrow: "Our team",
  titleLines: ["The people", "behind the motion."],
  intro:
    "Isaacbot is built by engineers who care about robots that work outside the lab: safe, open and " +
    "dependable from the first prototype to daily operation.",
  members: [
    {
      name: "Radu Potlog",
      role: "Founder & Robotics Engineer",
      quote: "I build robots that do real work, safely, every day.",
      photo: "/team/radu-potlog.jpg",
    },
  ],
};

export const contact = {
  eyebrow: "Get in touch",
  titleLines: ["Let's build the future", "of field robotics."],
  text:
    "Do you need a platform for your research, a partner for a field application, or are you a robotics " +
    "engineer who wants to build with us? We'd love to hear from you.",
  ctaLabel: "Email us",
};
