export default {
    firstName: 'James',
    lastName: 'Carter',
    jobTitle: 'Full Stack Developer',
    address: '525 N Tryon Street, NC 28117',
    phone: '(123)-456-7890',
    email: 'example@gmail.com',
    themeColor: '#ff6666',
    summery: 'Lorem ipsum dolor sit amet...',
    experience: [
        {
            id: 1,
            title: 'Full Stack Developer',
            companyName: 'Amazon',
            city: 'New York',
            state: 'NY',
            startDate: 'Jan 2021',
            currentlyWorking: true,
            workSummery: 'Designed, developed, and maintained full-stack applications...',
        },
    ],
    education: [
        {
            id: 1,
            universityName: 'Western Illinois University',
            startDate: 'Aug 2018',
            endDate: 'Dec 2019',
            degree: 'Master',
            major: 'Computer Science',
            description: 'Lorem ipsum dolor sit amet...',
        },
    ],
    skills: [
        { id: 1, name: 'Angular', rating: 80 },
        { id: 2, name: 'React', rating: 100 },
    ],
    certifications: [
        {
            id: 1,
            title: 'AWS Certified Developer',
            issuer: 'Amazon Web Services',
            date: 'Jun 2020',
        },
        {
            id: 2,
            title: 'AWS Certified Solutions Architect',
            issuer: 'Amazon Web Services',
            date: 'Aug 2023',
        },
    ],
    projects: [
        {
            id: 1,
            title: 'E-commerce Website',
            description: 'Built a full-stack e-commerce website...',
        },
        {
            id: 2,
            title: 'AI Resume Builder',
            description: 'An AI-powered tool that generates resumes based on user input with various templates.',
        },
    ],
    languages: [
        {
            id: 1,
            name: 'English',
            proficiency: 'Fluent',
        },
        {
            id: 2,
            name: 'Spanish',
            proficiency: 'Intermediate',
        },
    ],
    hobbies: [
        {
            id: 1,
            name: 'Photography',
        },
        {
            id: 2,
            name: 'Traveling',
        },
        {
            id: 3,
            name: 'Reading',
        },
    ],
    references: [
        {
            id: 1,
            name: 'John Doe',
            position: 'Senior Developer',
            company: 'Google',
            contact: 'john.doe@gmail.com',
        },
    ],
};
