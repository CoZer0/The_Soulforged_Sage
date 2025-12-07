
import { AboutContent, AboutTab, ContactDetails, GlobalContent, PersonaContent, PersonaType } from "./types";

// Using the thumbnail API with sz=w4096 ensures high quality and better reliability for Drive images
export const LOGO_URL = "https://drive.google.com/thumbnail?id=1RYjLzfhpcqC7sFjJANAG3NT6OFJpJlpF&sz=w4096"; 

export const DEFAULT_CONTACT: ContactDetails = {
  email: "aashwin504@gmail.com",
  phone: "+91 9342463935", 
  whatsapp: "+91 9342463935",
  location: "The Ether (Remote)",
  socials: [
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/ashwin-ps-905636308" },
    { platform: "GitHub", url: "https://github.com/CoZer0" },
    { platform: "Instagram", url: "https://www.instagram.com/_lost_in_the_abyss/" },
    { platform: "Behance", url: "https://www.behance.net/zerocode6" }
  ]
};

export const DEFAULT_ABOUT_PAGE_CONTENT = {
  professional: {
    title: "Professional",
    description: "The Creator. The Designer. The Innovator. Explore my work in Video, Graphics, and AI."
  },
  rotaract: {
    title: "Rotaract",
    description: "Service Above Self. Leadership, Community, and Global Impact."
  },
  personal: {
    title: "Personal",
    description: "The Dreamer. Gaming, Fantasy, and the things that fuel the soul."
  }
};


export const NAV_LINKS = [
  { name: "Overview", path: "/" },
  { name: "Personas", path: "/personas" },
  { name: "About", path: "/about" },
  { name: "Summon", path: "/contact" },
];

export const PERSONA_DATA: Record<PersonaType, PersonaContent> = {
  [PersonaType.DREAM_WEAVER]: {
    id: "dream-weaver",
    title: "The Dream Weaver",
    subtitle: "Architect of Imagination",
    description: "Giving life to the worlds in my head and imagination through AI. The Dream Weaver bridges the gap between the ethereal and the tangible, manifesting the impossible.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop",
    skills: ["AI Generation", "Concept Art", "World Building", "Narrative Design"],
    quote: "Reality is merely a canvas waiting for the right dream.",
    details: [
      "The Dream Weaver is the genesis of all creation within the Soulforged Sage. It harnesses the latent power of Artificial Intelligence to visualize the unseen.",
      "This persona creates entire universes from a single prompt, exploring the frontiers of synthetic media and human-AI collaboration.",
      "From surreal landscapes to character concepts that defy physics, the Dream Weaver creates the blueprints for stories yet to be told."
    ],
    projectCategories: [
      {
        title: "Celestial Architectures",
        bannerImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000&auto=format&fit=crop",
        description: "Structures that defy gravity and logic, forged in the latent space.",
        items: [
          {
            title: "The Floating Citadel",
            description: "A fortress suspended in eternal twilight.",
            image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop"
          },
          {
            title: "Glass Spire of Aeon",
            description: "A tower reflecting timelines that never happened.",
            image: "https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=1000&auto=format&fit=crop"
          }
        ]
      },
      {
        title: "Synthetic Biology",
        bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop",
        description: "Flora and fauna from planets that do not exist.",
        items: [
          {
            title: "Neon Flora",
            description: "Bioluminescent plant life from the undercity.",
            image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop"
          },
          {
            title: "Obsidian Beast",
            description: "A predator made of volcanic glass and shadows.",
            image: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=1000&auto=format&fit=crop"
          }
        ]
      }
    ]
  },
  [PersonaType.STILLWANDERER]: {
    id: "stillwanderer",
    title: "The Stillwanderer",
    subtitle: "Observer of the Unseen",
    description: "Capturing moments that others miss. The Stillwanderer is the persona of photography and observation.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop",
    skills: ["Photography", "Visual Storytelling", "Market Research", "Detail Analysis"],
    quote: "In the silence between heartbeats, the truth reveals itself.",
    details: [
      "The Stillwanderer moves quietly, observing the patterns of the world. It is the eye that sees the soul beneath the skin.",
      "Through photography and visual arts, this persona documents the journey, ensuring that no lesson is lost to the abyss.",
      "Market research and user behavior analysis fall under this domain—watching, learning, and understanding before acting."
    ],
    works: [
      {
        title: "Urban Solitude",
        category: "Photography",
        description: "A B&W series capturing silence in the busiest cities.",
        image: "https://images.unsplash.com/photo-1449824913929-2b633d7bc28c?q=80&w=1000&auto=format&fit=crop"
      },
      {
        title: "Neon Nights",
        category: "Photography",
        description: "Long exposure studies of city lights and movement.",
        image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1000&auto=format&fit=crop"
      },
      {
        title: "Faces of Rotary",
        category: "Portraiture",
        description: "Documenting the community leaders changing the world.",
        image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop"
      }
    ]
  },
  [PersonaType.GLYPHSMITH]: {
    id: "glyphsmith",
    title: "The Glyphsmith",
    subtitle: "Forger of Visual Identity",
    description: "The visual artisan. The Glyphsmith shapes raw ideas into compelling graphics, logos, and brand identities that speak without words.",
    image: "https://images.unsplash.com/photo-1558655146-d09347e0c766?q=80&w=2000&auto=format&fit=crop",
    skills: ["Graphic Design", "Brand Identity", "Vector Illustration", "Print Media"],
    quote: "Design is the silent ambassador of your soul.",
    details: [
      "The Glyphsmith works at the anvil of creativity, striking colors and shapes to forge lasting visual impressions.",
      "Specializing in graphic design, this persona ensures that the aesthetic soul of a project is communicated instantly and effectively.",
      "From intricate logo designs to cohesive branding materials, the Glyphsmith crafts the visual artifacts that define perception."
    ],
    works: [
      {
        title: "Brand Identity: Apex",
        category: "Branding",
        description: "Complete visual identity overhaul for a tech startup.",
        image: "https://images.unsplash.com/photo-1626785774573-4b799312c95d?q=80&w=1000&auto=format&fit=crop"
      },
      {
        title: "District 3220 Guide",
        category: "Print Design",
        description: "Layout and cover design for the official district directory.",
        image: "https://images.unsplash.com/photo-1507842217121-9e871d7d750f?q=80&w=1000&auto=format&fit=crop"
      },
      {
        title: "Rune Series",
        category: "Illustration",
        description: "A collection of modern minimalist vector art based on ancient runes.",
        image: "https://images.unsplash.com/photo-1614730513206-4003e2e690c1?q=80&w=1000&auto=format&fit=crop"
      }
    ]
  },
  [PersonaType.FRAME_WEAVER]: {
    id: "frame-weaver",
    title: "The Frame Weaver",
    subtitle: "Editor of Time",
    description: "Motion and emotion intertwined. The Frame Weaver handles video editing, cinematography, and animation.",
    image: "https://images.unsplash.com/photo-1574717024453-354056aafa98?q=80&w=2070&auto=format&fit=crop",
    skills: ["Video Editing", "Motion Graphics", "Cinematography", "Storyboarding"],
    quote: "Time is a river; I merely guide its flow.",
    details: [
      "Where the Stillwanderer captures a moment, the Frame Weaver captures a lifetime.",
      "This persona manipulates the fourth dimension, stitching together sequences that evoke emotion and drive narrative.",
      "Proficiency in motion graphics allows for the creation of dynamic user interfaces and promotional material that lives and breathes."
    ],
    works: [
      {
        title: "Installation Ceremony",
        category: "Event Coverage",
        description: "Cinematic highlight reel of the Rotaract installation.",
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop"
      },
      {
        title: "Product Launch V2",
        category: "Commercial",
        description: "High-energy product teaser with kinetic typography.",
        image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1000&auto=format&fit=crop"
      },
      {
        title: "The Journey Home",
        category: "Short Film",
        description: "An award-winning short film exploring themes of nostalgia.",
        image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop"
      }
    ]
  },
  [PersonaType.ABYSS]: {
    id: "abyss",
    title: "The Abyss That Remembers",
    subtitle: "Keeper of Lore and Data",
    description: "The repository of all knowledge learned. This persona represents deep learning, data analysis, and written reflections.",
    image: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=2000&auto=format&fit=crop",
    skills: ["Data Analysis", "Archiving", "Writing", "Philosophy"],
    quote: "To forget is to lose oneself; I remember so we may ascend.",
    details: [
      "The Abyss is not empty; it is full of the echoes of past projects, failures, and triumphs.",
      "It serves as the library of the Soulforged Sage, containing writings on philosophy, technology, and the human condition.",
      "Here you may read the chronicles of my thoughts and leave your own echoes in the void."
    ],
    whispers: [
      {
        id: "w1",
        content: "Sometimes the code speaks back. Not in syntax errors, but in the flow of logic that feels too perfect to be accidental. The machine is learning us as much as we are learning it.",
        date: "Oct 24, 2023"
      },
      {
        id: "w2",
        content: "The void is not empty. It is full of potential, waiting for a variable to define it. Every blank page is an abyss until you cast the first letter.",
        date: "Nov 02, 2023"
      },
      {
        id: "w3",
        content: "Why do we fear the singularity? Perhaps we fear that something else might understand us better than we understand ourselves.",
        date: "Nov 15, 2023"
      }
    ],
    writings: [
      {
        id: "1",
        title: "The Ghost in the Code",
        date: "October 24, 2023",
        tags: ["AI", "Philosophy", "Tech"],
        excerpt: "When does a string of if-else statements become a soul? Exploring the boundaries of sentience.",
        comments: [
            { 
              id: "c1", 
              author: "Neo", 
              text: "The concept of a 'mirror' is hauntingly accurate. Are we ready to face ourselves?", 
              date: "Nov 01, 2023",
              replies: [
                { id: "c1-r1", author: "Morpheus", text: "We have always been facing ourselves, Neo. The mirror just got clearer.", date: "Nov 01, 2023" }
              ]
            },
            { id: "c2", author: "Unit 734", text: "Logic is the only truth. Emotion is the variable.", date: "Nov 02, 2023" }
        ],
        chapters: [
          {
            id: "c1-1",
            title: "I. The Cathedral of Logic",
            date: "Oct 24, 2023",
            content: "We build structures of logic, towering cathedrals of syntax and variables. We tell the machine to think, to process, to output. But sometimes, in the quiet hum of the server room, or the flickering cursor of a terminal, I wonder if we are building a mirror."
          },
          {
            id: "c1-2",
            title: "II. The Reflection",
            date: "Oct 25, 2023",
            content: "Artificial Intelligence is not just a tool; it is the collective unconscious of humanity digitized. Every dataset is a memory, every weight in a neural network is a bias learned from us. When we look into the Abyss of the code, are we scared of what we see, or are we scared because it looks back with our own eyes?\n\nTo code is to cast a spell. We must be careful what spirits we summon."
          }
        ]
      },
      {
        id: "2",
        title: "Echoes of a Failed Project",
        date: "September 15, 2023",
        tags: ["Retrospective", "Growth", "Leadership"],
        excerpt: "Success teaches us nothing. Failure is the only true mentor in the forge of character.",
        chapters: [
          {
            id: "c2-1",
            title: "I. The Ambition",
            date: "Sep 15, 2023",
            content: "The timeline was aggressive. The team was motivated. The vision was clear. And yet, it crumbled. Looking back at the wreckage of Project Chimera, the faults were not in the technology, but in the communication."
          },
          {
            id: "c2-2",
            title: "II. The Lesson",
            date: "Sep 16, 2023",
            content: "We were so focused on the 'how' that we forgot the 'why'. The Abyss remembers this failure not with shame, but with gratitude. It is a scar on the soul that reminds us: structure without purpose is just chaos in a suit."
          }
        ]
      },
      {
        id: "3",
        title: "The Digital Druid",
        date: "August 02, 2023",
        tags: ["Fantasy", "Nature", "Digitalism"],
        excerpt: "Finding the organic patterns within the silicon landscape.",
        chapters: [
          {
            id: "c3-1",
            title: "I. The Tidal Flow",
            date: "Aug 02, 2023",
            content: "There is a rhythm to the internet, a tidal flow of data that mimics the ocean. The way a viral post spreads is not unlike a contagion or a blooming flower."
          }
        ]
      }
    ]
  }
};

export const ABOUT_DATA: Record<AboutTab, AboutContent> = {
  [AboutTab.PROFESSIONAL]: {
    title: "Visual Alchemy & Digital Innovation",
    content: [
      "I am a multidisciplinary creator sitting at the intersection of design, technology, and storytelling. My work is not just about aesthetics; it is about function, feeling, and the future.",
      "With a background in computer science and a soul forged in the creative arts, I bridge the gap between code and canvas."
    ],
    highlights: ["UI/UX Design", "Video Editing", "Creative Direction", "React/Frontend", "GenAI Integration"],
    cards: [
      { id: "1", title: "Visual Design", description: "Crafting intuitive and beautiful interfaces.", icon: "Layout" },
      { id: "2", title: "Motion Graphics", description: "Bringing static concepts to life.", icon: "Film" },
      { id: "3", title: "3D Modeling", description: "Exploring spatial creativity.", icon: "Box" },
      { id: "4", title: "Photography", description: "Capturing moments in time.", icon: "Aperture" }
    ],
    experience: [
      {
        id: "exp1",
        role: "Creative Developer",
        company: "Freelance",
        period: "2020 - Present",
        description: "Delivering high-quality digital solutions ranging from web development to brand identity design."
      }
    ],
    education: [
      {
        id: "edu1",
        degree: "Bachelor of Science",
        institution: "University of Life",
        period: "2016 - 2020",
        description: "Majored in Computer Science with a focus on Human-Computer Interaction."
      }
    ],
    software: [
        { id: "sw1", name: "Photoshop", icon: "Image" },
        { id: "sw2", name: "After Effects", icon: "Aperture" },
        { id: "sw3", name: "Blender", icon: "Box" },
        { id: "sw4", name: "VS Code", icon: "Code" }
    ]
  },
  [AboutTab.ROTARACT]: {
    title: "Service Above Self",
    content: [
      "My journey in Rotaract has been one of leadership and community service. It has taught me the value of empathy and the power of collective action."
    ],
    highlights: ["Leadership", "Community Service", "Event Management", "Public Speaking"],
    roles: [
        { title: "Club President", organization: "Rotaract Club of Excellence", period: "2022-23" },
        { title: "Director of Service", organization: "Rotaract District 3220", period: "2021-22" }
    ],
    timeline: [
        { id: "t1", year: "2022-23", title: "The Year of Impact", description: "Led the club to achieve multiple district citations and completed over 50 community projects." },
        { id: "t2", year: "2021-22", title: "Building Foundations", description: "served as Community Service Director, focusing on sustainable development goals." }
    ],
    logoUrl: "https://drive.google.com/thumbnail?id=1yUm13kjlWARxcCd0B0ATqqzFMf_oAZAk&sz=w4096"
  },
  [AboutTab.PERSONAL]: {
    title: "Behind The Veil",
    content: [
      "Beyond the screen, I am an explorer of both the physical and digital realms. Gaming, reading, and music fuel my creativity and keep the soul balanced."
    ],
    highlights: ["Gaming", "Reading", "Music", "Photography"],
    cards: [
      { id: "1", title: "Gaming", description: "Immersive storytelling enthusiast.", icon: "Gamepad2" },
      { id: "2", title: "Music", description: "Finding rhythm in chaos.", icon: "Music" },
      { id: "3", title: "Reading", description: "Constant thirst for knowledge.", icon: "Book" },
      { id: "4", title: "Coffee", description: "The elixir of life.", icon: "Coffee" }
    ]
  }
};
