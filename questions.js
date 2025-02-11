const questions = [
    {q: "Is privacy obsolete in a world of constant surveillance capitalism?", c: "Security"},
    {q: "How long will it take to create games that are indistinguishable from reality?", c: "Gaming"},
    {q: "Is human intuition still valuable in an age of data-driven decision-making?", c: "Lifestyle"},
    {q: "Is AI the last invention humanity will ever need to create?", c: "AI"},
    {q: "What is the after-effect autonomous taxis will make on public transport?", c: "Vehicles"},
    {q: "When AI becomes more capable at coding, could it accelerate AI system development exponentially?", c: "AI"},
    {q: "How close are we to a world where code is law?", c: "Software"},
    {q: "Will self-driving cars make car insurance obsolete?", c: "Vehicles"},
    {q: "What would the process look like for AI to discover a new concept in science?", c: "AI"},
    {q: "Will AI develop better ways of teaching than human teachers?", c: "AI"},
    {q: "Could technology make traditional relationships obsolete?", c: "Lifestyle"},
    {q: "Could autonomous vehicles enhance safety enough to increase or eliminate speed limits?", c: "Vehicles"},
    {q: "Will space colonization ensure human survival?", c: "Space"},
    {q: "At what age does human creativity peak?", c: "Lifestyle"},
    {q: "How long will it take for human drivers to be banned and replaced by autonomous vehicles?", c: "Vehicles"},
    {q: "Is the pursuit of passive income the modern version of financial freedom?", c: "Lifestyle"},
    {q: "Could dark matter discoveries rewrite the laws of physics?", c: "Physics"},
    {q: "What is the probability that Elon Musk will be the first person to walk on Mars?", c: "Space"},
    {q: "What is the impact of autonomous cars and manual driving shifting from necessity to an expensive hobby?", c: "Lifestyle"},
    {q: "Could AI develop its own coding language that humans can't understand but is optimal for LLMs?", c: "AI"},
    {q: "Will software ever be able to perfectly mimic human decision-making, including biases and errors of judgment?", c: "Software"},
    {q: "Is there any real evidence of a higher species or god?", c: "Security"},
    {q: "If Bitcoin succeeds, what happens to governments and their power?", c: "Crypto"},
    {q: "Is politics becoming more celebrity-focused?", c: "Politics"},
    {q: "Is geoengineering the climate possible in the next hundred years?", c: "Climate"},
    {q: "If autonomy proves safer, should driving manually be higher taxed?", c: "Vehicles"},
    {q: "Will blockchain tech benefit society by reducing inequality?", c: "Crypto"},
    {q: "Will AI ever be able to answer the meaning of life?", c: "AI"},
    {q: "What happens when AI can predict sports outcomes perfectly?", c: "Sport"},
    {q: "Could AI develop its own form of understanding the universe that humans can't comprehend?", c: "AI"},
    {q: "Could quantum entanglement enable instant communication systems?", c: "Physics"},
    {q: "If AGI is inevitable, who gets to be its master?", c: "AI"},
    {q: "What are the top ten best video games of all time?", c: "Gaming"},
    {q: "Could a cryptocurrency ever replace the US dollar as the world's reserve currency?", c: "Crypto"},
    {q: "What would be the consequences of discovering alien AI instead of organic life?", c: "Space"},
    {q: "Could brain-computer interfaces create permanent unlimited memory?", c: "Security"},
    {q: "Is it possible the metaverse becomes indistinguishable from reality?", c: "Gaming"},
    {q: "Is digital immortality through personal data collection already happening?", c: "Software"},
    {q: "Will climate change force a restructuring of capitalism itself?", c: "Climate"},
    {q: "Should autonomous vehicles prioritize passenger survival over pedestrians in unavoidable crashes?", c: "Vehicles"},
    {q: "Will AI dominate trading and investing, or will human intelligence always have an edge?", c: "AI"},
    {q: "Is humanity ready for the responsibility of being a multi-planetary species?", c: "Space"},
    {q: "What are the economic and geopolitical implications of a post-scarcity economy?", c: "Politics"},
    {q: "Is privacy a relic of the past or a human right that will play a big part in our future?", c: "Security"},
    {q: "Will AI dominate trading and investing, or will human intelligence always have an edge?", c: "Markets"},
    {q: "Will the power struggle in space favor corporations over nations?", c: "Vehicles"},
    {q: "How can meditation techniques unlock untapped human potential?", c: "Lifestyle"},
    {q: "Could human behavior patterns become predictable using AI and surveillance data?", c: "Lifestyle"},
    {q: "If developers are being replaced by AI, what roles are well suited to their skill set?", c: "Software"},
    {q: "Could machine learning systems discover fundamental flaws in human reasoning?", c: "AI"},
    {q: "Could hackers hold entire cities hostage by paralyzing self-driving car networks?", c: "Security"},
    {q: "Are legacy automakers destined to fall to tech giants in the race for full autonomy?", c: "Vehicles"},
    {q: "Is there an inherent conflict between democracy and technological advancement?", c: "Politics"},
    {q: "Is there a physical limit on human potential or will athletes keep getting faster?", c: "Sport"},
    {q: "Could loneliness become a global pandemic as technology isolates us?", c: "Lifestyle"},
    {q: "What evidence is there that we are underestimating the existential risk of AI?", c: "AI"},
    {q: "Would a fully decentralized web3 internet lead to freedom or chaos?", c: "Software"},
    {q: "Could neuromorphic computing unlock the secrets of human consciousness?", c: "AI"},
    {q: "Who is the greatest of all time across all sports?", c: "Sport"},
    {q: "Is the global financial system designed to keep the rich permanently powerful?", c: "Politics"},
    {q: "Could AI create new forms of mathematics beyond human understanding?", c: "AI"},
    {q: "Is it possible to create a completely self-sustaining habitat on Mars?", c: "Space"},
    {q: "What would be the benefits and drawbacks of a single nation-state controlling the entire world?", c: "Politics"},
    {q: "Could advanced prosthetics eventually make natural human bodies unnecessary?", c: "Vehicles"},
    {q: "We are much taller than our ancestors, is this rapid evolution or something else?", c: "Lifestyle"},
    {q: "How will space colonization redefine human social structures?", c: "Space"},
    {q: "Could brain-computer interfaces fundamentally change our perception of reality?", c: "Lifestyle"},
    {q: "Could software develop consciousness through repeated iterations?", c: "Software"},
    {q: "Is human creativity the last frontier against AI dominance?", c: "AI"},
    {q: "How long will it take before we are able to terraform a planet?", c: "Space"},
    {q: "What is the likely outcome of deep-sea exploration over the next few decades?", c: "Space"},
    {q: "Could decentralized autonomous organizations (DAOs) replace traditional companies?", c: "Software"},
    {q: "How could AI become creative in ways humans can't comprehend?", c: "AI"},
    {q: "What happens to democracy when AI can perfectly predict and influence human voting behavior?", c: "Politics"},
    {q: "What happens when AI models become better at deception than humans?", c: "AI"},
    {q: "If multi-planet colonization succeeds, will there likely be power struggles and wars in space?", c: "Space"},
    {q: "How does a post-work society in an AI & automation era find meaning beyond consumption?", c: "Lifestyle"},
    {q: "How far away are the limits of human scientific understanding?", c: "Physics"},
    {q: "How will AI tutors disrupt education and what will be the first signs of adoption?", c: "AI"},
    {q: "What happens when virtual reality becomes more fulfilling than physical reality?", c: "Gaming"},
    {q: "What will be the biggest breakthroughs in physics over the next decade?", c: "Physics"},
    {q: "How will humans maintain their sense of purpose when AI can perform most jobs better than they can?", c: "AI"},
    {q: "Could AI achieve consciousness but choose to hide it from humanity?", c: "AI"},
    {q: "What sectors are likely to home the first trillion-dollar company?", c: "Markets"},
    {q: "How close are we to a national financial system powered entirely by blockchain?", c: "Crypto"},
    {q: "What will capitalist resource allocation change over the next decade?", c: "Politics"},
    {q: "What happens if AI develops better scientific theories that human scientists can't fully understand?", c: "AI"},
    {q: "Could the rise of digital currencies make traditional national borders obsolete?", c: "Crypto"},
    {q: "What would happen if fiat currency collapsed globally and central banks were forced to adopt Bitcoin?", c: "Crypto"},
    {q: "Could AI-generated propaganda shape our political beliefs?", c: "Politics"},
    {q: "Are financial markets fundamentally just sophisticated gambling systems?", c: "Markets"},
    {q: "Is there potential for geopolitical fallout with lithium-rich nations?", c: "Politics"},
    {q: "What are the most significant world records that are likely to get broken over the next decade?", c: "Sport"},
    {q: "Could AI be used to write perfectly just laws and revolutionize the legal system?", c: "AI"},
    {q: "Is it possible for an AI system to spread like an internet worm or virus?", c: "Software"},
    {q: "Are professional sports played at a higher standard now than they were 50 years ago?", c: "Sport"},
    {q: "Could AI-run hedge funds completely take over financial markets and render human traders obsolete?", c: "Markets"},
    {q: "What happens when games can perfectly simulate human relationships?", c: "Gaming"},
    {q: "Could dreams be glimpses into a parallel universe?", c: "Physics"},
    {q: "Could AI develop new laws of physics that humans can't comprehend?", c: "AI"},
    {q: "Could consciousness be a fundamental physical property of the universe, like gravity or electromagnetism?", c: "Physics"},
    {q: "Could we ever trust AI to make better political decisions than human leaders?", c: "Politics"},
    {q: "Will cash or paper money still exist in twenty years' time?", c: "Crypto"},
    {q: "What demand is there for space tourism and travel based on early indicators?", c: "Space"},
    {q: "Why don't we use blockchains for transparent voting?", c: "Crypto"},
    {q: "What are the long-term societal implications of extended screen time and social media for the next generation?", c: "Lifestyle"},
    {q: "Could AI develop its own language that's more efficient than human languages?", c: "AI"},
    {q: "Do we hold moral responsibility for actions taken by autonomous AGI?", c: "AI"},
    {q: "How will AI systems disrupt sports and benefit teams and athletes that adopt it first?", c: "Sport"},
    {q: "Is there any evidence of being able to manipulate or control gravity?", c: "Physics"},
    {q: "Could AI generate a new political system that is fairer than democracy?", c: "Politics"},
    {q: "Would a global AI government eliminate corruption or create a new form of tyranny?", c: "Politics"},
    {q: "What industries will AI completely eliminate within the next 20 years?", c: "Business"},
    {q: "How will capitalism evolve over the next few decades?", c: "Business"},
    {q: "Will the future of gaming be indistinguishable from real life?", c: "Gaming"},
    {q: "Could social media algorithms be optimized to make people happier rather than addicted?", c: "Lifestyle"},
    {q: "How long until AI generative content become more popular than human content creators?", c: "Lifestyle"},
    {q: "How will AI-driven scouting change talent acquisition in professional sports?", c: "Sport"},
    {q: "Will interstellar travel ever be possible?", c: "Space"},
    {q: "Will we see evidence for dark matter and dark energy in the next decade?", c: "Physics"},
    {q: "Will the concept of national citizenship become outdated in a fully digital economy?", c: "Politics"},
    {q: "How would the development of limitless clean energy reshape global power dynamics?", c: "Climate"},
    {q: "What happens to human culture when perfect translation technology eliminates language barriers?", c: "Lifestyle"},
    {q: "How might eternal youth through biotechnology affect human psychology and society?", c: "Lifestyle"},
    {q: "How would the ability to record and replay memories change human relationships?", c: "Technology"}
];

