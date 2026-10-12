export const socialLinks = [
  ["YouTube", "https://www.youtube.com/@namrata_dahal"],
  ["TikTok", "https://www.tiktok.com/@namratadahal62"],
  ["Instagram", "https://www.instagram.com/namrata_dahal11"],
  ["Facebook", "https://www.facebook.com/namrata.dahal.653570"],
];
// Leave email or whatsapp empty to hide that contact option. WhatsApp uses the full international number, digits only (e.g. 9779812345678).
export const contact = {
  email: "",
  whatsapp: "",
  instagram: "https://www.instagram.com/namrata_dahal11",
  instagramHandle: "@namrata_dahal11",
  responseTime: "within 3 working days",
};
export const statsDate = "10 October 2026";
export const stats = [
  ["313.4K", "TikTok video views", "Last 60 days"],
  ["80.8K", "YouTube views", "Last 90 days"],
  ["5", "Paid brand collaborations", "To date"],
  ["3M", "Views on my top TikTok", "One video, lifetime"],
];
// followers is shown when filled in; otherwise the highlight is shown.
export const platforms: {
  name: string;
  handle: string;
  url: string;
  followers?: string;
  highlight?: [string, string];
}[] = [
  {
    name: "TikTok",
    handle: "@namratadahal62",
    url: "https://www.tiktok.com/@namratadahal62",
    highlight: ["313.4K", "views in the last 60 days"],
  },
  {
    name: "YouTube",
    handle: "@namrata_dahal",
    url: "https://www.youtube.com/@namrata_dahal",
    followers: "1.43K subscribers",
    highlight: ["80.8K", "views in the last 90 days"],
  },
  {
    name: "Instagram",
    handle: "@namrata_dahal11",
    url: "https://www.instagram.com/namrata_dahal11",
    highlight: ["234.8K", "views in the last 90 days"],
  },
  {
    name: "Facebook",
    handle: "namrata.dahal.653570",
    url: "https://www.facebook.com/namrata.dahal.653570",
    highlight: ["50.2K", "views in the last 90 days"],
  },
];
export const audience = [
  [
    "CEE & entrance aspirants",
    "+2 science students preparing for nursing, MBBS and other medical entrance exams.",
  ],
  [
    "Nursing students",
    "Current BSc Nursing students looking for relatable experiences and practical advice.",
  ],
  [
    "Families & future students",
    "Students and parents researching fees, scholarships and nursing careers in Nepal and abroad.",
  ],
];
export const skills = [
  [
    "✎",
    "Research & scripting",
    "I turn exam, fee and course questions into clear, structured explanations—and do the same for your product.",
  ],
  [
    "◉",
    "On-camera presenting",
    "Natural, conversational delivery in Nepali, with English where it helps. It feels like advice from a senior.",
  ],
  [
    "▶",
    "Filming & editing",
    "Vertical short-form for TikTok, Reels and Facebook, plus long-form YouTube, planned and edited by me.",
  ],
  [
    "✓",
    "Accuracy you can trust",
    "As a nursing student, I check health and education claims before they reach my audience.",
  ],
  [
    "✳",
    "Honest, disclosed partnerships",
    "Every collaboration is clearly labelled, which keeps my audience’s trust and your message credible.",
  ],
  [
    "☺",
    "Real student insight",
    "I hear what students ask in comments and messages, so your story answers the questions they actually have.",
  ],
];
export const tiktokVideoUrl = (id: string) =>
  `https://www.tiktok.com/@namratadahal62/video/${id}`;
// tiktokId is the number at the end of the TikTok video URL. Its cover is public/videos/tiktok/<tiktokId>.jpg (or .png, .webp, .avif).
export const caseStudies: {
  brand: string;
  platform: string;
  views: string;
  viewsLabel: string;
  title: string;
  goal: string;
  made: string;
  tiktokId?: string;
  links: { label: string; url: string }[];
  quote?: { text: string; by: string };
}[] = [
  {
    brand: "Smart Educational Academy",
    platform: "TikTok · Instagram · YouTube Shorts",
    views: "11.2K",
    viewsLabel: "TikTok video views",
    title: "All Nepal BSc Nursing CEE Mirror Exam",
    goal: "Share the free CEE Mirror Exam opportunity with nursing entrance aspirants across Nepal.",
    made: "A short educational promotional video explaining the exam format, participating cities, and registration opportunity.",
    tiktokId: "7695741668875767048",
    links: [
      {
        label: "Watch on TikTok ↗",
        url: tiktokVideoUrl("7695741668875767048"),
      },
    ],
  },
  {
    brand: "MedStellar",
    platform: "TikTok",
    views: "50.2K",
    viewsLabel: "TikTok video views",
    title: "BSc Nursing scholarships",
    goal: "Reach students asking how to earn a BSc Nursing scholarship.",
    made: "A question-led video on getting a BSc Nursing scholarship, with MedStellar introduced as the place to prepare for it.",
    tiktokId: "7636764523038297365",
    links: [
      {
        label: "Watch on TikTok ↗",
        url: tiktokVideoUrl("7636764523038297365"),
      },
    ],
  },
  {
    brand: "IndoGlobal",
    platform: "TikTok",
    views: "22.5K",
    viewsLabel: "TikTok video views",
    title: "CEE form-filling support",
    goal: "Make CEE applicants aware of a free form-filling support service.",
    made: "A practical explainer showing students what help was available and how to use it.",
    tiktokId: "7672745041143647489",
    links: [
      {
        label: "Watch on TikTok ↗",
        url: tiktokVideoUrl("7672745041143647489"),
      },
    ],
  },
  {
    brand: "MakerHub",
    platform: "TikTok · YouTube",
    views: "12.9K",
    viewsLabel: "TikTok video views, plus a YouTube launch video",
    title: "Preparation platform launch",
    goal: "Introduce a new preparation platform to nursing, MBBS and engineering aspirants.",
    made: "A TikTok introduction and a 4-minute YouTube launch video built around what students need before their exam.",
    tiktokId: "7659762819407056146",
    links: [
      {
        label: "Watch on TikTok ↗",
        url: tiktokVideoUrl("7659762819407056146"),
      },
      {
        label: "Watch the YouTube launch ↗",
        url: "https://www.youtube.com/watch?v=3DzOWLZ9ofs",
      },
    ],
  },
  {
    brand: "Entrance Nepal",
    platform: "TikTok",
    views: "9,177",
    viewsLabel: "TikTok video views",
    title: "Last-month preparation",
    goal: "Reach students in their final month before the entrance exam.",
    made: "A short video introducing QAD classes and concept videos around that last-month need.",
    tiktokId: "7660922533733993745",
    links: [
      {
        label: "Watch on TikTok ↗",
        url: tiktokVideoUrl("7660922533733993745"),
      },
    ],
  },
];
// Non-sponsored TikTok highlights, added by numeric video ID. The section is hidden while this list is empty.
export const shortVideos: {
  id: string;
  title: string;
  views: string;
  note: string;
}[] = [];
export const videos = [
  {
    id: "58OftPZoVlo",
    title:
      "How I Got FULL Scholarship in BSc Nursing CEE Nepal 🇳🇵 | My Journey + Study Tips",
    category: "CEE & education",
    duration: "11:39",
    views: "14K",
    description:
      "My scholarship journey and the preparation lessons I share with aspiring nursing students.",
  },
  {
    id: "uqbJc5KVKJg",
    title:
      "Before You Choose BSc Nursing in Nepal… Watch This 🩺 | Real Student Experience",
    category: "Nursing conversations",
    duration: "19:44",
    views: "2.9K",
    description:
      "A student-to-student conversation about the experience of choosing and studying nursing.",
  },
  {
    id: "3DzOWLZ9ofs",
    title:
      "Every Nursing, MBBS & Engineering Student Needs to See This Before their Exam | MakerHub Launch 🇳🇵",
    category: "Brand content",
    duration: "4:41",
    views: "798",
    description:
      "An introduction to MakerHub, presented around the needs of students preparing for entrance exams.",
  },
  {
    id: "Ue8YgZ8UjNc",
    title:
      "Only 4 Weeks Left for CEE 2026 😳 | Exact Final Preparation Strategy | BSc Nursing + MBBS",
    category: "CEE & education",
    duration: "10:44",
    views: "7.4K",
    description:
      "A focused preparation-strategy video for CEE aspirants approaching their exam.",
  },
  {
    id: "ZfksKWzbz2A",
    title:
      "BSc Nursing in Nepal | Actual Fees, Hostel Expenses | Scholarship vs Paying",
    category: "Nursing conversations",
    duration: "16:01",
    views: "8.5K",
    description:
      "A practical conversation about nursing costs, hostel expenses, and scholarship versus paying seats.",
  },
  {
    id: "froxun4vDGc",
    title:
      "A Day in the Life of a Nursing Student in Nepal | Exam Preparation, Classes & Night Duty 🩺",
    category: "Student life",
    duration: "11:16",
    views: "1.6K",
    description:
      "A look at the study, classes, and duty that shape everyday life as a nursing student.",
  },
  {
    id: "Z21up-amqdg",
    title:
      "My CEE Journey 🇳🇵 | How I Prepared, My Rank, Study Routine, Books & Strategy | CEE Nepal",
    category: "CEE & education",
    duration: "10:16",
    views: "4.3K",
    description:
      "A personal account of preparing for CEE, including routines, resources, and study strategy.",
  },
  {
    id: "XwWTXE9ZL1Q",
    title:
      "नेपालमा ३० हजार, USA, UK, Australia मा __ लाख? Nurse Salary Comparison",
    category: "Nursing conversations",
    duration: "9:39",
    views: "2.6K",
    description:
      "A nursing-career conversation comparing salary headlines across countries. Figures reflect the video’s context and may change.",
  },
];
export const services = [
  {
    title: "Sponsored stories",
    short: "A story for my audience",
    description:
      "Your product introduced through a useful explanation, relatable moment, or honest experience on my social channels.",
    items: [
      "One agreed video concept",
      "Platform-specific editing and caption",
      "Clearly disclosed partnership",
      "Agreed posting date and performance summary",
    ],
    format: "Sponsored short-form video",
    tag: "TIKTOK · INSTAGRAM · FACEBOOK",
  },
  {
    title: "YouTube integrations",
    short: "Room to explain the why",
    description:
      "A relevant segment inside a longer video, with space to explain your product’s value and a clear next step.",
    items: [
      "Placement agreed before production",
      "Script and factual-claim review",
      "Description link when agreed",
      "Post-publication performance summary",
    ],
    format: "YouTube integration",
    tag: "LONG-FORM · EDUCATION · CONTEXT",
  },
  {
    title: "Content for your channels",
    short: "My voice, on your pages",
    description:
      "Presenter-led videos and product explainers created for your brand’s own social channels. Posting to my audience is a separate deliverable.",
    items: [
      "Concept, script, filming and editing",
      "Agreed video length and aspect ratio",
      "Defined organic usage period",
      "Advertising rights quoted separately",
    ],
    format: "Content for brand channels",
    tag: "CONTENT PRODUCTION · UGC",
  },
  {
    title: "Multi-part campaigns",
    short: "A conversation that continues",
    description:
      "A coordinated set of stories for a launch or ongoing student campaign, with a clear role for every deliverable.",
    items: [
      "A connected content plan",
      "Agreed mix of platforms and formats",
      "Milestones and review dates",
      "Campaign wrap-up with available results",
    ],
    format: "Multi-part campaign",
    tag: "LAUNCHES · ONGOING COLLABORATIONS",
  },
];
