export default {
  firstName: "James",
  lastName: "Carter",
  jobTitle: "Full Stack Developer",
  address: "525 N Tryon Street, NC 28117",
  phone: "(123)-456-7890",
  email: "example@gmail.com",
  themeColor: "#ff6666",
  summary: "Lorem ipsum dolor sit amet...", // Changed from 'summery' to 'summary'
  experience: [
    {
      exId: "1",
      title: "Full Stack Developer",
      companyName: "Amazon",
      city: "New York",
      state: "NY",
      startDate: "Jan 2021",
      currentlyWorking: true,
      workSummary: // Changed from 'workSummery' to 'workSummary'
        "Designed, developed, and maintained full-stack applications...",
    },
  ],
  education: [
    {
      edId: "1",
      universityName: "Western Illinois University",
      startDate: "Aug 2018",
      endDate: "Dec 2019",
      currentlyStudy: false,
      degree: "Master",
      major: "Computer Science",
      minor: "Business Administration",
      description: "Lorem ipsum dolor sit amet...",
    },
  ],
  skills: [
    { skId: "1", name: "Angular", rating: 80 },
    { skId: "2", name: "React", rating: 100 },
  ],
  certifications: [
    {
      ceId: "1",
      title: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "Jun 2020",
    },
    {
      ceId: "2",
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "Aug 2023",
    },
  ],
  projects: [
    {
      prId: "1",
      title: "E-commerce Website",
      description: "Built a full-stack e-commerce website...",
    },
    {
      prId: "2",
      title: "AI Resume Builder",
      description:
        "An AI-powered tool that generates resumes based on user input with various templates.",
    },
  ],
  languages: [
    {
      laId: "1",
      name: "English",
      proficiency: "Fluent",
    },
    {
      laId: "2",
      name: "Spanish",
      proficiency: "Intermediate",
    },
  ],
  hobbies: [
    {
      hoId: "1",
      name: "Photography",
    },
    {
      hoId: "2",
      name: "Traveling",
    },
    {
      hoId: "3",
      name: "Reading",
    },
  ],
  references: [
    {
      reId: "1",
      name: "John Doe",
      position: "Senior Developer",
      company: "Google",
      contact: "john.doe@gmail.com",
    },
  ],
};