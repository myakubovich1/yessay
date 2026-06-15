export type SeoLandingPage = {
  slug: string;
  category: "core" | "essay-type" | "writing-problem";
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  heroCopy: string;
  ctaLabel: string;
  trustPoints: string[];
  checks: {
    title: string;
    copy: string;
  }[];
  explanation: {
    heading: string;
    paragraphs: string[];
  };
  example: {
    heading: string;
    draftNote: string;
    feedback: string;
  };
  mistakes: {
    title: string;
    copy: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  relatedSlugs: string[];
};

export const seoLandingPages: SeoLandingPage[] = [
  {
    slug: "essay-checker",
    category: "core",
    title: "Essay Checker",
    metaTitle: "Essay Checker | Get Feedback on Grammar, Structure & Clarity",
    metaDescription:
      "Paste your essay and get feedback on grammar, clarity, structure, thesis strength, and overall flow before you submit your draft.",
    h1: "Essay Checker",
    eyebrow: "Pre-submission essay feedback",
    heroCopy:
      "Check your essay against the assignment before you submit it. Yessay looks for clarity, structure, thesis strength, evidence, citations, and priority fixes so you know what to revise first.",
    ctaLabel: "Check my essay",
    trustPoints: [
      "Free readiness score preview",
      "Feedback on your own draft",
      "No grade promises",
    ],
    checks: [
      {
        title: "Assignment match",
        copy: "See whether the draft appears to answer the prompt and follow the required format.",
      },
      {
        title: "Structure and flow",
        copy: "Review introduction, body paragraph order, transitions, and conclusion strength.",
      },
      {
        title: "Priority fixes",
        copy: "Get the most important revision signals ranked so the next edit is clear.",
      },
    ],
    explanation: {
      heading: "A better essay check starts with the assignment",
      paragraphs: [
        "Generic grammar tools can miss the point of a school assignment. Yessay asks for the prompt, rubric, and draft so feedback stays tied to what your teacher or professor actually requested.",
        "The goal is not to replace your writing. The goal is to help you notice gaps before submission: unclear claims, missing requirements, weak evidence, citation risks, and places where the reader may lose the thread.",
      ],
    },
    example: {
      heading: "Example feedback",
      draftNote:
        "Draft issue: the essay has a topic, but the main claim is broad.",
      feedback:
        "Your introduction explains the subject, but the thesis should make a clearer argument. Instead of saying social media affects students, state what effect you are proving and why it matters.",
    },
    mistakes: [
      {
        title: "Answering the topic instead of the prompt",
        copy: "A draft can sound polished and still miss a required comparison, source count, or format rule.",
      },
      {
        title: "Treating evidence as self-explanatory",
        copy: "Quotes and examples need analysis that connects them back to the claim.",
      },
      {
        title: "Saving citations for the last minute",
        copy: "Citation problems are easier to fix before the final upload than after the paper is assembled.",
      },
    ],
    faqs: [
      {
        question: "What does the essay checker review?",
        answer:
          "It reviews prompt match, rubric alignment, thesis clarity, organization, evidence, citation signals, and grammar clarity.",
      },
      {
        question: "Does Yessay write my essay?",
        answer:
          "No. Yessay reviews the draft you provide and gives revision direction. You stay responsible for your writing.",
      },
      {
        question: "Can I use it without a rubric?",
        answer:
          "Yes. If you do not have a rubric, Yessay can use general academic writing standards while still prioritizing the assignment prompt.",
      },
      {
        question: "Is the score a grade prediction?",
        answer:
          "No. The score is a readiness signal based on possible issues. Your instructor's grading decision always comes first.",
      },
    ],
    relatedSlugs: [
      "ai-essay-checker",
      "essay-feedback",
      "rubric-checker",
      "thesis-statement-checker",
    ],
  },
  {
    slug: "ai-essay-checker",
    category: "core",
    title: "AI Essay Checker",
    metaTitle: "AI Essay Checker | Review Your Draft Before Submission",
    metaDescription:
      "Use an AI essay checker to review thesis clarity, structure, evidence, rubric match, and citation risks before submitting your own draft.",
    h1: "AI Essay Checker",
    eyebrow: "AI feedback for student drafts",
    heroCopy:
      "Use AI to review the essay you already wrote. Yessay checks your draft against the assignment and turns possible issues into a focused revision plan.",
    ctaLabel: "Use the AI essay checker",
    trustPoints: [
      "Built for revision",
      "Prompt and rubric aware",
      "Keeps you as the author",
    ],
    checks: [
      {
        title: "Prompt-aware reading",
        copy: "The tool reads the assignment context before judging whether the draft is on target.",
      },
      {
        title: "Argument quality",
        copy: "Feedback focuses on claims, support, analysis, and whether paragraphs build a clear case.",
      },
      {
        title: "Submission readiness",
        copy: "The report highlights what to review before turning in the final file.",
      },
    ],
    explanation: {
      heading: "Use AI as a reviewer, not a replacement writer",
      paragraphs: [
        "A useful AI essay checker should not push you to submit machine-written work. It should help you see your own draft more clearly.",
        "Yessay is designed around revision: finding missing requirements, unclear reasoning, weak paragraph logic, and places where the reader may need more evidence.",
      ],
    },
    example: {
      heading: "Example AI feedback",
      draftNote: "Draft issue: the body paragraphs repeat the same point.",
      feedback:
        "Your second and third body paragraphs both argue that the policy saves money. Give each paragraph a different job: one on cost, one on access, and one on possible objections.",
    },
    mistakes: [
      {
        title: "Using AI without the assignment",
        copy: "Feedback becomes vague when the tool does not know what the essay was supposed to do.",
      },
      {
        title: "Asking for a rewrite too early",
        copy: "Revision works better when you understand the issue before changing the sentence.",
      },
      {
        title: "Ignoring professor-specific rules",
        copy: "Formatting, source type, and rubric requirements often matter as much as style.",
      },
    ],
    faqs: [
      {
        question: "Can AI check my essay before I submit it?",
        answer:
          "Yes. Yessay can review your draft for likely revision issues, but it does not guarantee a grade or replace your instructor's feedback.",
      },
      {
        question: "Will the tool write the essay for me?",
        answer:
          "No. The product is positioned for feedback and revision guidance on work you already wrote.",
      },
      {
        question: "What should I paste into the checker?",
        answer:
          "For the most useful feedback, add the assignment prompt, rubric if available, and your current draft.",
      },
      {
        question: "Is AI essay checking useful for short drafts?",
        answer:
          "Yes, as long as the draft is long enough to show a claim, structure, and evidence pattern.",
      },
    ],
    relatedSlugs: [
      "essay-checker",
      "essay-grader",
      "essay-editor",
      "improve-my-essay",
    ],
  },
  {
    slug: "essay-feedback",
    category: "core",
    title: "Essay Feedback Tool",
    metaTitle: "Essay Feedback Tool | Get Clear Revision Notes",
    metaDescription:
      "Get essay feedback on thesis clarity, organization, evidence, citations, and rubric alignment so you can revise your draft with more confidence.",
    h1: "Essay Feedback Tool",
    eyebrow: "Clear notes before final edits",
    heroCopy:
      "Get feedback that explains what to revise and why. Yessay turns your prompt, rubric, and draft into practical notes you can use before submission.",
    ctaLabel: "Get essay feedback",
    trustPoints: [
      "Specific revision signals",
      "Rubric-aware review",
      "Designed for student drafts",
    ],
    checks: [
      {
        title: "Thesis and focus",
        copy: "Find out whether the central claim is clear enough to guide the whole essay.",
      },
      {
        title: "Paragraph purpose",
        copy: "See whether each section has a job or whether parts of the draft repeat themselves.",
      },
      {
        title: "Evidence use",
        copy: "Check whether examples, quotes, and sources are explained instead of dropped in.",
      },
    ],
    explanation: {
      heading: "Feedback should help you decide what to change next",
      paragraphs: [
        "Good essay feedback is not just a list of errors. It helps you understand the highest-impact revision moves for the time you have left.",
        "Yessay focuses on the pieces students often struggle to evaluate alone: whether the argument is visible, whether the evidence actually supports it, and whether the essay follows the requested criteria.",
      ],
    },
    example: {
      heading: "Example feedback",
      draftNote: "Draft issue: the conclusion repeats the introduction.",
      feedback:
        "Your conclusion restates the topic, but it does not show what the reader should understand after reading the evidence. Add one final sentence that explains the larger takeaway of your argument.",
    },
    mistakes: [
      {
        title: "Only asking if the essay is good",
        copy: "A better question is what should be revised first and what is already working.",
      },
      {
        title: "Fixing wording before structure",
        copy: "Sentence polish helps less if the thesis, order, or evidence is still unclear.",
      },
      {
        title: "Skipping the rubric",
        copy: "Rubric language often reveals exactly what kind of feedback matters most.",
      },
    ],
    faqs: [
      {
        question: "What kind of essay feedback does Yessay give?",
        answer:
          "It gives feedback on prompt match, thesis clarity, structure, evidence, citations, and priority revision steps.",
      },
      {
        question: "Can I use it for a draft that is not finished?",
        answer:
          "Yes. A partial draft can still be checked, but feedback is more complete when the main sections are present.",
      },
      {
        question: "Does feedback include grammar?",
        answer:
          "Yes, grammar and clarity are included, but the tool also looks at deeper essay issues like argument and organization.",
      },
      {
        question: "Will it tell me exactly what to fix first?",
        answer:
          "The full report ranks likely priority fixes so you can work in a practical order.",
      },
    ],
    relatedSlugs: [
      "essay-checker",
      "essay-editor",
      "essay-grammar-checker",
      "paragraph-checker",
    ],
  },
  {
    slug: "essay-grader",
    category: "core",
    title: "Essay Grader",
    metaTitle: "Essay Grader | Check Readiness Before You Submit",
    metaDescription:
      "Get a readiness score and feedback on your essay draft. Review rubric match, thesis clarity, evidence, structure, and citation signals before submission.",
    h1: "Essay Grader",
    eyebrow: "Readiness signal, not a grade promise",
    heroCopy:
      "See how ready your draft looks before you submit it. Yessay gives a score signal and explains the issues most likely to affect the final revision.",
    ctaLabel: "Check my essay score",
    trustPoints: [
      "Readiness score preview",
      "No guaranteed grades",
      "Revision-first feedback",
    ],
    checks: [
      {
        title: "Rubric match",
        copy: "Compare the draft to assignment criteria when a rubric is available.",
      },
      {
        title: "Score breakdown",
        copy: "Review separate signals for prompt match, evidence, organization, citations, and clarity.",
      },
      {
        title: "Risk areas",
        copy: "Spot the parts of the essay that need attention before you turn it in.",
      },
    ],
    explanation: {
      heading: "Use the score to focus revision, not predict a grade",
      paragraphs: [
        "Students often search for an essay grader because they want to know whether a draft is ready. The honest answer is that no tool can know exactly how a teacher will grade.",
        "Yessay treats the score as a readiness signal. It helps you notice likely weaknesses and decide where to spend your revision time.",
      ],
    },
    example: {
      heading: "Example score feedback",
      draftNote:
        "Draft issue: evidence is present, but not connected to the rubric.",
      feedback:
        "Your evidence section is stronger than your prompt match. The next revision should quote the assignment language directly and make sure each body paragraph answers one required criterion.",
    },
    mistakes: [
      {
        title: "Treating an estimate as a final grade",
        copy: "A readiness score is a guide for revision, not a promise about the instructor's judgment.",
      },
      {
        title: "Ignoring the lowest category",
        copy: "The weakest score signal often points to the fastest meaningful improvement.",
      },
      {
        title: "Submitting after grammar fixes only",
        copy: "A paper can be grammatically clean but still weak against the prompt.",
      },
    ],
    faqs: [
      {
        question: "Is this an automatic essay grader?",
        answer:
          "It provides a readiness score and feedback, but it does not guarantee or replace a teacher's grade.",
      },
      {
        question: "Can it grade with a rubric?",
        answer:
          "It can compare your draft to the rubric language you provide and flag likely gaps.",
      },
      {
        question: "What does the score mean?",
        answer:
          "The score summarizes possible readiness based on structure, prompt match, evidence, citations, and clarity.",
      },
      {
        question: "Should I submit only because the score is high?",
        answer:
          "No. Use the report to review the final checklist and your professor's instructions before submitting.",
      },
    ],
    relatedSlugs: [
      "essay-checker",
      "rubric-checker",
      "essay-feedback",
      "improve-my-essay",
    ],
  },
  {
    slug: "essay-editor",
    category: "core",
    title: "Essay Editor",
    metaTitle: "Essay Editor | Improve Clarity, Flow & Structure",
    metaDescription:
      "Use Yessay as an essay editor for your own draft. Get feedback on clarity, flow, thesis strength, paragraph order, and revision priorities.",
    h1: "Essay Editor",
    eyebrow: "Edit smarter before you submit",
    heroCopy:
      "Use Yessay as a revision editor for your draft. Get notes on what sounds unclear, what feels out of order, and what should be strengthened before submission.",
    ctaLabel: "Edit my essay draft",
    trustPoints: [
      "Keeps your voice",
      "Explains revision choices",
      "Checks more than grammar",
    ],
    checks: [
      {
        title: "Clarity",
        copy: "Find sentences and claims that may be hard for a reader to follow.",
      },
      {
        title: "Flow",
        copy: "Review transitions and paragraph order so the essay moves logically.",
      },
      {
        title: "Revision focus",
        copy: "Separate urgent structural edits from smaller sentence-level polish.",
      },
    ],
    explanation: {
      heading: "An essay editor should protect your meaning",
      paragraphs: [
        "Editing is not just making sentences sound fancy. Strong editing helps the draft say what you mean with less confusion and more control.",
        "Yessay gives feedback on the draft you provide, then points to places where your own revision can make the argument clearer and easier to follow.",
      ],
    },
    example: {
      heading: "Example editing feedback",
      draftNote:
        "Draft issue: a paragraph starts with evidence before the point is clear.",
      feedback:
        "Move the topic sentence before the quote so the reader knows why the source matters. Then add one sentence explaining how the quote supports your claim.",
    },
    mistakes: [
      {
        title: "Making every sentence longer",
        copy: "More formal writing is not always clearer. Some ideas need shorter, sharper sentences.",
      },
      {
        title: "Changing voice without checking meaning",
        copy: "A polished sentence can still distort the original claim if the edit is too broad.",
      },
      {
        title: "Editing from top to bottom only",
        copy: "Start with the largest issues first: thesis, order, evidence, and missing requirements.",
      },
    ],
    faqs: [
      {
        question: "Does Yessay edit the whole essay for me?",
        answer:
          "Yessay provides feedback and revision guidance. You decide which edits to make in your own draft.",
      },
      {
        question: "Can it help my essay sound clearer?",
        answer:
          "Yes. It flags clarity and flow issues and explains where the reader may need a stronger connection.",
      },
      {
        question: "Is this different from a grammar checker?",
        answer:
          "Yes. Grammar is included, but essay editing also considers thesis, organization, evidence, and assignment match.",
      },
      {
        question: "Can I use it for college essays?",
        answer:
          "Yes, but personal essays need special attention to voice, specificity, and reflection.",
      },
    ],
    relatedSlugs: [
      "make-my-essay-sound-better",
      "essay-grammar-checker",
      "paragraph-checker",
      "essay-checker/college-essay",
    ],
  },
  {
    slug: "essay-grammar-checker",
    category: "core",
    title: "Essay Grammar Checker",
    metaTitle: "Essay Grammar Checker | Review Clarity and Style",
    metaDescription:
      "Check essay grammar, clarity, style, flow, and sentence-level issues while also reviewing whether your draft follows the assignment.",
    h1: "Essay Grammar Checker",
    eyebrow: "Grammar plus essay context",
    heroCopy:
      "Check grammar and clarity without losing sight of the essay. Yessay reviews sentence-level issues alongside thesis, structure, evidence, and assignment fit.",
    ctaLabel: "Check my essay grammar",
    trustPoints: [
      "Grammar and clarity signals",
      "Essay-level feedback too",
      "Built for final review",
    ],
    checks: [
      {
        title: "Sentence clarity",
        copy: "Find confusing wording, overloaded sentences, and places where meaning may be unclear.",
      },
      {
        title: "Academic tone",
        copy: "Review whether the draft sounds appropriate for the assignment and audience.",
      },
      {
        title: "Final polish risks",
        copy: "Separate small style issues from bigger problems that need revision first.",
      },
    ],
    explanation: {
      heading: "Grammar matters most when the essay already makes sense",
      paragraphs: [
        "A grammar checker can help polish a draft, but grammar alone will not fix weak evidence or a missing thesis.",
        "Yessay combines grammar feedback with essay-level review so students can improve wording while still checking the bigger submission risks.",
      ],
    },
    example: {
      heading: "Example grammar feedback",
      draftNote: "Draft issue: a long sentence includes two separate claims.",
      feedback:
        "Split this sentence into two. The first sentence should state the claim about access, and the second should explain the evidence. This will make the paragraph easier to follow.",
    },
    mistakes: [
      {
        title: "Polishing before revising",
        copy: "Fixing commas is less useful if the paragraph still lacks a clear point.",
      },
      {
        title: "Overcorrecting voice",
        copy: "Formal does not have to mean stiff. Keep wording clear and natural.",
      },
      {
        title: "Ignoring citation grammar",
        copy: "Signal phrases, quote integration, and punctuation around citations all affect readability.",
      },
    ],
    faqs: [
      {
        question: "Does the checker only review grammar?",
        answer:
          "No. It includes grammar and clarity, but also reviews essay structure, thesis, evidence, and prompt match.",
      },
      {
        question: "Can it help with academic tone?",
        answer:
          "Yes. Yessay can flag wording that may sound vague, informal, or disconnected from the assignment.",
      },
      {
        question: "Will it change my writing style?",
        answer:
          "It gives feedback so you can revise. You choose how much to change.",
      },
      {
        question: "Should I run grammar checks before or after revision?",
        answer:
          "Run a full essay check first, fix major issues, then use grammar feedback for final polish.",
      },
    ],
    relatedSlugs: [
      "essay-editor",
      "make-my-essay-sound-better",
      "paragraph-checker",
      "essay-checker",
    ],
  },
  {
    slug: "improve-my-essay",
    category: "core",
    title: "Improve My Essay",
    metaTitle: "Improve My Essay | Get a Focused Revision Plan",
    metaDescription:
      "Improve your essay with feedback on thesis, structure, evidence, rubric alignment, citations, and the highest-priority changes before submission.",
    h1: "Improve My Essay",
    eyebrow: "Focused revision help",
    heroCopy:
      "If your draft is written but not ready, Yessay helps you decide what to improve first. Get a readiness signal, issue count, and report built around your assignment.",
    ctaLabel: "Improve my essay",
    trustPoints: [
      "Prioritized fixes",
      "Works with prompts and rubrics",
      "Revision guidance only",
    ],
    checks: [
      {
        title: "Highest-impact changes",
        copy: "Focus on the revision moves most likely to improve the draft's clarity and alignment.",
      },
      {
        title: "Missing pieces",
        copy: "Catch required sections, sources, or formatting details that may be absent.",
      },
      {
        title: "Final checklist",
        copy: "Finish with concrete items to verify before uploading your paper.",
      },
    ],
    explanation: {
      heading: "Improvement starts with knowing what is not working yet",
      paragraphs: [
        "Students often know an essay could be better, but not which part to fix first. That uncertainty wastes time, especially close to a deadline.",
        "Yessay narrows the next step by comparing your draft to the assignment and showing likely gaps in order of importance.",
      ],
    },
    example: {
      heading: "Example improvement feedback",
      draftNote: "Draft issue: the paper has evidence but little explanation.",
      feedback:
        "Your next revision should add analysis after each source. Explain how the example proves the paragraph's claim instead of moving directly to the next quote.",
    },
    mistakes: [
      {
        title: "Trying to improve everything at once",
        copy: "Work from the biggest risk to the smallest polish issue.",
      },
      {
        title: "Adding more words without a plan",
        copy: "More length only helps when it adds required evidence, explanation, or structure.",
      },
      {
        title: "Skipping the final checklist",
        copy: "Small submission details can still cost points if they are required.",
      },
    ],
    faqs: [
      {
        question: "How can I improve my essay quickly?",
        answer:
          "Start with the highest-priority issues: prompt match, thesis, evidence, organization, and missing requirements.",
      },
      {
        question: "Can Yessay tell me what to revise first?",
        answer:
          "Yes. The full report ranks priority fixes so you can revise in a practical order.",
      },
      {
        question: "Does it work for different essay types?",
        answer:
          "Yes. Add the assignment type and prompt so feedback can adapt to the task.",
      },
      {
        question: "Will it make my essay perfect?",
        answer:
          "No tool can guarantee perfection or a grade. Yessay gives revision signals to help you make a stronger final draft.",
      },
    ],
    relatedSlugs: [
      "essay-feedback",
      "essay-editor",
      "essay-grader",
      "make-my-essay-sound-better",
    ],
  },
  {
    slug: "make-my-essay-sound-better",
    category: "core",
    title: "Make My Essay Sound Better",
    metaTitle: "Make My Essay Sound Better | Improve Clarity and Flow",
    metaDescription:
      "Improve how your essay sounds while keeping your own meaning. Get feedback on clarity, flow, tone, sentence structure, and revision priorities.",
    h1: "Make My Essay Sound Better",
    eyebrow: "Clearer wording without losing your voice",
    heroCopy:
      "Make your essay sound clearer, more focused, and easier to read. Yessay shows where the wording, flow, or structure may need attention before submission.",
    ctaLabel: "Make my essay clearer",
    trustPoints: [
      "Keeps the draft yours",
      "Clarity and flow feedback",
      "No full-essay replacement",
    ],
    checks: [
      {
        title: "Awkward wording",
        copy: "Find sentences that may sound unclear, repetitive, or overloaded.",
      },
      {
        title: "Flow between ideas",
        copy: "See where paragraphs need stronger transitions or clearer logic.",
      },
      {
        title: "Tone fit",
        copy: "Review whether the draft sounds appropriate for the assignment type.",
      },
    ],
    explanation: {
      heading: "Better sounding essays are usually clearer essays",
      paragraphs: [
        "Students often ask how to make an essay sound better when the real problem is clarity. The reader needs to understand the claim, why each paragraph exists, and how the evidence connects.",
        "Yessay gives feedback that points to the reason a sentence or section feels weak, so you can revise without replacing your own voice.",
      ],
    },
    example: {
      heading: "Example clarity feedback",
      draftNote: "Draft issue: the sentence is broad and vague.",
      feedback:
        "Instead of saying the issue is very important in society today, name the specific issue and explain who is affected. Concrete wording will make the essay sound more confident.",
    },
    mistakes: [
      {
        title: "Adding fancy words",
        copy: "Complex vocabulary can make an essay harder to understand if the idea is simple.",
      },
      {
        title: "Removing your voice",
        copy: "Especially in personal writing, a stronger essay should still sound like you.",
      },
      {
        title: "Changing sentences without fixing logic",
        copy: "Better wording cannot fully solve a missing claim or unsupported paragraph.",
      },
    ],
    faqs: [
      {
        question: "Can Yessay make my essay sound better?",
        answer:
          "It can show where clarity, tone, and flow need work so you can revise the wording yourself.",
      },
      {
        question: "Will it rewrite my essay?",
        answer:
          "No. Yessay is built for feedback and revision guidance, not submitting a replacement essay.",
      },
      {
        question: "What makes an essay sound more academic?",
        answer:
          "Clear claims, precise wording, explained evidence, and logical transitions usually matter more than fancy vocabulary.",
      },
      {
        question: "Can it help with awkward paragraphs?",
        answer:
          "Yes. It can flag paragraphs that repeat, drift, or need a clearer topic sentence.",
      },
    ],
    relatedSlugs: [
      "essay-editor",
      "essay-grammar-checker",
      "paragraph-checker",
      "essay-feedback",
    ],
  },
  {
    slug: "essay-checker/argumentative-essay",
    category: "essay-type",
    title: "Argumentative Essay Checker",
    metaTitle: "Argumentative Essay Checker | Strengthen Your Argument",
    metaDescription:
      "Check your argumentative essay for a debatable thesis, strong evidence, counterarguments, organization, and rubric alignment.",
    h1: "Argumentative Essay Checker",
    eyebrow: "Argument and evidence review",
    heroCopy:
      "Get clear feedback on your argumentative essay before you submit it. Check whether your thesis is debatable, your evidence supports your claims, and your counterarguments are addressed.",
    ctaLabel: "Check my argumentative essay",
    trustPoints: [
      "Debatable thesis feedback",
      "Counterargument review",
      "Evidence and logic checks",
    ],
    checks: [
      {
        title: "Claim strength",
        copy: "See whether the thesis takes a position that can be argued, not just observed.",
      },
      {
        title: "Evidence fit",
        copy: "Review whether each source or example supports the specific claim in the paragraph.",
      },
      {
        title: "Counterargument handling",
        copy: "Check whether objections are acknowledged and answered instead of ignored.",
      },
    ],
    explanation: {
      heading: "What makes a strong argumentative essay?",
      paragraphs: [
        "A strong argumentative essay does more than share an opinion. It makes a clear claim, supports that claim with evidence, explains the reasoning, and responds to possible objections.",
        "Yessay checks whether your draft has those parts and whether the argument stays focused from introduction to conclusion.",
      ],
    },
    example: {
      heading: "Example argumentative feedback",
      draftNote: "Draft issue: the thesis is clear but not arguable enough.",
      feedback:
        "Your thesis names the topic, but it could take a stronger position. Instead of saying public transit affects cities, argue that free public transit improves city life by expanding access and reducing traffic pressure.",
    },
    mistakes: [
      {
        title: "Writing a topic instead of a claim",
        copy: "The thesis should be something a reasonable reader could question or debate.",
      },
      {
        title: "Listing evidence without reasoning",
        copy: "Each example needs analysis explaining why it proves the argument.",
      },
      {
        title: "Treating counterarguments as a final add-on",
        copy: "A strong response to objections should connect back to the main claim.",
      },
    ],
    faqs: [
      {
        question: "What does an argumentative essay checker look for?",
        answer:
          "It looks for a debatable thesis, logical organization, relevant evidence, counterargument handling, and clear analysis.",
      },
      {
        question: "Can it help make my thesis more arguable?",
        answer:
          "Yes. Yessay can flag a thesis that is too broad or factual and suggest a clearer direction.",
      },
      {
        question: "Does it check counterarguments?",
        answer:
          "Yes. It reviews whether objections are present and whether the response supports the main argument.",
      },
      {
        question: "Can I add my rubric?",
        answer:
          "Yes. Adding the rubric makes the feedback more specific to your class requirements.",
      },
    ],
    relatedSlugs: [
      "essay-checker",
      "essay-checker/persuasive-essay",
      "thesis-statement-checker",
      "rubric-checker",
    ],
  },
  {
    slug: "essay-checker/persuasive-essay",
    category: "essay-type",
    title: "Persuasive Essay Checker",
    metaTitle: "Persuasive Essay Checker | Improve Claims and Support",
    metaDescription:
      "Check your persuasive essay for a clear position, audience awareness, evidence, organization, and persuasive flow before submission.",
    h1: "Persuasive Essay Checker",
    eyebrow: "Persuasion and reader impact",
    heroCopy:
      "Review whether your persuasive essay makes a clear case for the reader. Yessay checks position, support, organization, tone, and the places where persuasion may feel weak.",
    ctaLabel: "Check my persuasive essay",
    trustPoints: [
      "Audience-aware feedback",
      "Claim and support review",
      "Persuasive flow checks",
    ],
    checks: [
      {
        title: "Position clarity",
        copy: "Find out whether the reader can quickly tell what you want them to believe.",
      },
      {
        title: "Persuasive support",
        copy: "Review examples, reasoning, and appeals for relevance and strength.",
      },
      {
        title: "Tone and audience",
        copy: "Check whether the draft sounds convincing without becoming vague or exaggerated.",
      },
    ],
    explanation: {
      heading: "Persuasive essays need more than strong opinions",
      paragraphs: [
        "A persuasive essay must guide a reader toward a position. That means the claim, evidence, examples, and tone all need to work together.",
        "Yessay helps you identify where the draft may need more specific support, clearer audience awareness, or a stronger final call to the reader.",
      ],
    },
    example: {
      heading: "Example persuasive feedback",
      draftNote:
        "Draft issue: the paragraph appeals to emotion but lacks evidence.",
      feedback:
        "The paragraph creates urgency, but it needs one concrete example or statistic. Add evidence before the final sentence so the appeal feels grounded instead of only emotional.",
    },
    mistakes: [
      {
        title: "Relying only on emotion",
        copy: "Emotion can help, but persuasive writing still needs reasons and examples.",
      },
      {
        title: "Forgetting the audience",
        copy: "A persuasive point should answer what the reader may doubt or care about.",
      },
      {
        title: "Ending without a takeaway",
        copy: "The conclusion should leave the reader with a clear reason to accept the position.",
      },
    ],
    faqs: [
      {
        question:
          "How is a persuasive essay different from an argumentative essay?",
        answer:
          "Both make a case, but persuasive essays often focus more directly on moving a reader toward agreement.",
      },
      {
        question: "Can Yessay check persuasive tone?",
        answer:
          "Yes. It can flag places where the tone may be too vague, too intense, or not audience-aware.",
      },
      {
        question: "Does it review evidence?",
        answer:
          "Yes. Persuasive claims still need support that a reader can trust.",
      },
      {
        question: "Can I use it for speech-style persuasive writing?",
        answer:
          "Yes, but include the assignment instructions so the feedback can match the expected format.",
      },
    ],
    relatedSlugs: [
      "essay-checker/argumentative-essay",
      "essay-checker",
      "essay-hook-checker",
      "essay-conclusion-checker",
    ],
  },
  {
    slug: "essay-checker/research-paper",
    category: "essay-type",
    title: "Research Paper Checker",
    metaTitle: "Research Paper Checker | Review Sources, Structure & Citations",
    metaDescription:
      "Check your research paper for thesis clarity, source use, citation risks, organization, evidence analysis, and assignment requirements.",
    h1: "Research Paper Checker",
    eyebrow: "Source-based writing review",
    heroCopy:
      "Review your research paper before submission. Yessay checks whether your sources support your thesis, your analysis is clear, and citation or requirement gaps need attention.",
    ctaLabel: "Check my research paper",
    trustPoints: [
      "Source and citation signals",
      "Research structure review",
      "Prompt and rubric aware",
    ],
    checks: [
      {
        title: "Source integration",
        copy: "See whether sources are introduced, explained, and connected to the claim.",
      },
      {
        title: "Citation readiness",
        copy: "Flag likely citation or Works Cited/reference-list risks to verify.",
      },
      {
        title: "Research focus",
        copy: "Check whether the paper has a clear research question or thesis direction.",
      },
    ],
    explanation: {
      heading: "Research papers need analysis, not just sources",
      paragraphs: [
        "A research paper can include credible sources and still feel incomplete if the analysis is thin. The reader needs to see how each source supports the thesis.",
        "Yessay reviews source use, organization, citation signals, and missing assignment requirements so you can revise before the final upload.",
      ],
    },
    example: {
      heading: "Example research feedback",
      draftNote: "Draft issue: sources are summarized but not analyzed.",
      feedback:
        "This paragraph explains what the study found, but it does not connect the study back to your thesis. Add one sentence explaining how the finding supports your argument about student access.",
    },
    mistakes: [
      {
        title: "Source dumping",
        copy: "Long summaries can crowd out your own analysis and argument.",
      },
      {
        title: "Missing source requirements",
        copy: "Many research prompts require a minimum number or type of sources.",
      },
      {
        title: "Citation list mismatch",
        copy: "Every in-text citation should match the final source list and required style.",
      },
    ],
    faqs: [
      {
        question: "Can Yessay check research paper citations?",
        answer:
          "It can flag possible citation risks, but you should verify final formatting against the required style guide.",
      },
      {
        question: "Does it evaluate source credibility?",
        answer:
          "It can comment on source use from the text you provide, but you should still confirm credibility yourself.",
      },
      {
        question: "Can it check a long research paper?",
        answer:
          "Yessay supports drafts up to the current word limit. Longer papers should be checked in sections.",
      },
      {
        question: "Should I include my assignment prompt?",
        answer:
          "Yes. Research paper requirements vary, so prompt and rubric details make feedback more useful.",
      },
    ],
    relatedSlugs: [
      "essay-checker",
      "rubric-checker",
      "essay-outline-checker",
      "essay-grammar-checker",
    ],
  },
  {
    slug: "essay-checker/college-essay",
    category: "essay-type",
    title: "College Essay Checker",
    metaTitle: "College Essay Checker | Improve Clarity, Story & Reflection",
    metaDescription:
      "Check your college essay for clarity, structure, specificity, reflection, flow, and whether the draft keeps your voice.",
    h1: "College Essay Checker",
    eyebrow: "Personal essay feedback",
    heroCopy:
      "Review your college essay for clarity, story, reflection, and voice. Yessay helps you see where the draft may feel vague, rushed, or hard to follow.",
    ctaLabel: "Check my college essay",
    trustPoints: [
      "Voice-aware feedback",
      "Story and reflection review",
      "No essay replacement",
    ],
    checks: [
      {
        title: "Specificity",
        copy: "Find places where the essay relies on broad traits instead of concrete moments.",
      },
      {
        title: "Reflection",
        copy: "Review whether the essay shows what changed, what you learned, or why the moment matters.",
      },
      {
        title: "Voice and flow",
        copy: "Check whether the essay sounds clear and personal without becoming unfocused.",
      },
    ],
    explanation: {
      heading: "College essays need a focused personal moment",
      paragraphs: [
        "A strong college essay usually does not try to summarize your whole life. It uses a specific story to reveal how you think, learn, or respond to a challenge.",
        "Yessay helps identify where the draft may need more detail, stronger reflection, or a clearer connection between the story and the point you want readers to remember.",
      ],
    },
    example: {
      heading: "Example college essay feedback",
      draftNote:
        "Draft issue: the essay lists activities instead of developing one moment.",
      feedback:
        "Choose one scene from your volunteer work and slow it down. Show what happened, what you noticed, and how that moment changed the way you approach responsibility.",
    },
    mistakes: [
      {
        title: "Trying to include every achievement",
        copy: "A personal essay often works better when it focuses on one meaningful moment.",
      },
      {
        title: "Telling traits instead of showing them",
        copy: "Specific actions and reflections are more convincing than saying you are hardworking.",
      },
      {
        title: "Sounding like someone else",
        copy: "Polish should not remove the personal voice that makes the essay yours.",
      },
    ],
    faqs: [
      {
        question: "Can Yessay check college application essays?",
        answer:
          "Yes. It can give feedback on clarity, focus, specificity, reflection, and flow.",
      },
      {
        question: "Will it write my admissions essay?",
        answer:
          "No. It reviews your draft and helps you revise while keeping the essay yours.",
      },
      {
        question: "Can it help with word count?",
        answer:
          "It can flag areas that may be too broad or repetitive, which can help you decide what to cut or expand.",
      },
      {
        question: "Should I include the prompt?",
        answer:
          "Yes. College essay prompts differ, and prompt context helps focus the feedback.",
      },
    ],
    relatedSlugs: [
      "essay-checker/personal-statement",
      "essay-editor",
      "make-my-essay-sound-better",
      "essay-hook-checker",
    ],
  },
  {
    slug: "essay-checker/personal-statement",
    category: "essay-type",
    title: "Personal Statement Checker",
    metaTitle: "Personal Statement Checker | Strengthen Story and Reflection",
    metaDescription:
      "Review your personal statement for focus, clarity, structure, specificity, reflection, and whether your voice comes through.",
    h1: "Personal Statement Checker",
    eyebrow: "Application essay review",
    heroCopy:
      "Check whether your personal statement is focused, specific, and reflective. Yessay helps you find vague sections and strengthen the story you already wrote.",
    ctaLabel: "Check my personal statement",
    trustPoints: [
      "Story-focused feedback",
      "Reflection review",
      "Keeps your voice intact",
    ],
    checks: [
      {
        title: "Narrative focus",
        copy: "Review whether the statement has a clear throughline instead of scattered moments.",
      },
      {
        title: "Personal insight",
        copy: "Check whether the draft explains what the experience reveals about you.",
      },
      {
        title: "Readable structure",
        copy: "See where transitions or paragraph order may make the story harder to follow.",
      },
    ],
    explanation: {
      heading: "Personal statements need both story and meaning",
      paragraphs: [
        "A personal statement should show more than what happened. It should help the reader understand how you think, what you value, and why the experience matters.",
        "Yessay reviews your draft for focus, specificity, reflection, and flow so your final revision can feel clearer without losing your voice.",
      ],
    },
    example: {
      heading: "Example personal statement feedback",
      draftNote: "Draft issue: the ending explains a lesson too generally.",
      feedback:
        "The final paragraph says the experience taught resilience, but it needs a more specific reflection. Explain what you do differently now because of that experience.",
    },
    mistakes: [
      {
        title: "Starting too broadly",
        copy: "Open with a specific moment or tension instead of a universal statement.",
      },
      {
        title: "Explaining the resume again",
        copy: "The statement should reveal qualities and perspective, not repeat every activity.",
      },
      {
        title: "Ending with a generic lesson",
        copy: "A strong conclusion connects the story to a specific personal insight.",
      },
    ],
    faqs: [
      {
        question: "Can Yessay review a personal statement?",
        answer:
          "Yes. It gives feedback on focus, voice, structure, specificity, and reflection.",
      },
      {
        question: "Can it make my statement sound more personal?",
        answer:
          "It can point out where details or reflection feel generic so you can revise with more specificity.",
      },
      {
        question: "Does it replace an admissions counselor?",
        answer:
          "No. It is a revision aid and should not replace school, counselor, or mentor guidance.",
      },
      {
        question: "Should I paste the application prompt?",
        answer:
          "Yes. Prompt context helps Yessay check whether the statement answers the right question.",
      },
    ],
    relatedSlugs: [
      "essay-checker/college-essay",
      "essay-editor",
      "make-my-essay-sound-better",
      "essay-conclusion-checker",
    ],
  },
  {
    slug: "essay-checker/ib-essay",
    category: "essay-type",
    title: "IB Essay Checker",
    metaTitle: "IB Essay Checker | Review Structure, Analysis & Criteria",
    metaDescription:
      "Check an IB essay draft for research focus, structure, analysis, evidence, criteria alignment, and clear academic writing.",
    h1: "IB Essay Checker",
    eyebrow: "Criteria-aware essay review",
    heroCopy:
      "Review your IB essay draft for focus, structure, evidence, and analysis. Add your prompt or criteria so Yessay can flag likely gaps before submission.",
    ctaLabel: "Check my IB essay",
    trustPoints: [
      "Criteria-focused review",
      "Analysis and evidence checks",
      "Useful for revision planning",
    ],
    checks: [
      {
        title: "Research focus",
        copy: "Check whether the draft keeps a clear question, claim, or line of inquiry.",
      },
      {
        title: "Analytical depth",
        copy: "Review whether the essay explains evidence instead of only describing it.",
      },
      {
        title: "Criteria alignment",
        copy: "Use rubric or criteria details to spot missing expectations.",
      },
    ],
    explanation: {
      heading: "IB essays reward focus and explanation",
      paragraphs: [
        "IB-style writing often asks for a clear research focus, sustained analysis, and careful use of evidence. A draft can contain strong material but still lose clarity if the argument drifts.",
        "Yessay helps students review whether the essay stays organized around the task and whether the evidence is explained with enough precision.",
      ],
    },
    example: {
      heading: "Example IB essay feedback",
      draftNote:
        "Draft issue: the paragraph summarizes context but does not analyze.",
      feedback:
        "This section gives useful background, but it needs to connect back to the research question. Add a sentence explaining how this evidence changes or supports your interpretation.",
    },
    mistakes: [
      {
        title: "Letting background replace analysis",
        copy: "Context is useful only when it supports a clear point.",
      },
      {
        title: "Losing the research question",
        copy: "Each section should help answer the central question or develop the argument.",
      },
      {
        title: "Ignoring criteria language",
        copy: "The rubric often tells you what type of thinking the essay needs to show.",
      },
    ],
    faqs: [
      {
        question: "Can Yessay check an IB essay?",
        answer:
          "Yes. Add the essay instructions, criteria, and draft for the most useful feedback.",
      },
      {
        question: "Does it understand every IB subject?",
        answer:
          "It gives writing and structure feedback. Subject-specific accuracy should still be checked with your teacher and course materials.",
      },
      {
        question: "Can it check analysis depth?",
        answer:
          "Yes. It can flag places where the essay summarizes more than it explains.",
      },
      {
        question: "Will it guarantee an IB score?",
        answer: "No. Yessay provides revision guidance, not score guarantees.",
      },
    ],
    relatedSlugs: [
      "essay-checker/research-paper",
      "rubric-checker",
      "essay-outline-checker",
      "essay-feedback",
    ],
  },
  {
    slug: "thesis-statement-checker",
    category: "writing-problem",
    title: "Thesis Statement Checker",
    metaTitle: "Thesis Statement Checker | Improve Your Essay Argument",
    metaDescription:
      "Check whether your thesis statement is clear, specific, debatable, and strong enough to guide your essay.",
    h1: "Thesis Statement Checker",
    eyebrow: "Check the center of your essay",
    heroCopy:
      "Review whether your thesis is clear, specific, and strong enough to guide the rest of the essay. Yessay checks the thesis inside the context of your assignment and draft.",
    ctaLabel: "Check my thesis",
    trustPoints: [
      "Specificity feedback",
      "Argument strength review",
      "Essay context included",
    ],
    checks: [
      {
        title: "Clarity",
        copy: "See whether a reader can identify the main claim quickly.",
      },
      {
        title: "Specificity",
        copy: "Check whether the thesis names a focused idea instead of a broad topic.",
      },
      {
        title: "Debatability",
        copy: "For argument essays, review whether the claim can actually be argued.",
      },
    ],
    explanation: {
      heading: "A thesis should give the essay a job",
      paragraphs: [
        "The thesis is not just a sentence in the introduction. It should shape what each body paragraph proves or explains.",
        "Yessay reviews your thesis in context so feedback can account for the assignment type, evidence, and overall structure.",
      ],
    },
    example: {
      heading: "Example thesis feedback",
      draftNote: "Draft thesis: Social media affects students.",
      feedback:
        "This is a topic, not yet a thesis. A stronger version would make a focused claim, such as social media weakens academic focus by encouraging constant comparison and interrupting deep work.",
    },
    mistakes: [
      {
        title: "Writing a fact instead of a claim",
        copy: "A thesis should usually do more than state something true.",
      },
      {
        title: "Making the thesis too broad",
        copy: "Broad claims are harder to support with specific evidence.",
      },
      {
        title: "Changing direction after the thesis",
        copy: "Body paragraphs should connect back to the claim introduced at the start.",
      },
    ],
    faqs: [
      {
        question: "What makes a thesis statement strong?",
        answer:
          "A strong thesis is clear, specific, focused, and appropriate for the assignment type.",
      },
      {
        question: "Can Yessay check only my thesis?",
        answer:
          "For best results, paste the assignment and draft too, because thesis feedback depends on context.",
      },
      {
        question: "Does every essay need a debatable thesis?",
        answer:
          "Not every essay is argumentative, but most academic essays still need a clear controlling idea.",
      },
      {
        question: "Where should the thesis go?",
        answer:
          "Many essays place it near the end of the introduction, but follow your assignment instructions first.",
      },
    ],
    relatedSlugs: [
      "essay-checker",
      "essay-checker/argumentative-essay",
      "essay-outline-checker",
      "paragraph-checker",
    ],
  },
  {
    slug: "essay-outline-checker",
    category: "writing-problem",
    title: "Essay Outline Checker",
    metaTitle: "Essay Outline Checker | Improve Structure Before Drafting",
    metaDescription:
      "Check your essay outline or draft structure for thesis support, paragraph order, missing sections, and logical flow.",
    h1: "Essay Outline Checker",
    eyebrow: "Structure before polish",
    heroCopy:
      "Check whether your essay plan has a clear thesis, useful paragraph order, and enough support before you spend time polishing sentences.",
    ctaLabel: "Check my essay outline",
    trustPoints: [
      "Paragraph order review",
      "Missing section signals",
      "Useful before final drafting",
    ],
    checks: [
      {
        title: "Logical order",
        copy: "Review whether the planned sections build in a sequence that makes sense.",
      },
      {
        title: "Paragraph purpose",
        copy: "Check whether each paragraph has a clear role in supporting the thesis.",
      },
      {
        title: "Missing requirements",
        copy: "Compare the outline or draft structure to the assignment instructions.",
      },
    ],
    explanation: {
      heading: "A good outline saves revision time",
      paragraphs: [
        "Many essay problems come from structure, not wording. If the outline is weak, the draft may feel scattered even after grammar edits.",
        "Yessay can review the structure of a draft or outline and flag places where the essay may need a clearer paragraph plan.",
      ],
    },
    example: {
      heading: "Example outline feedback",
      draftNote: "Outline issue: the second body paragraph repeats the first.",
      feedback:
        "Body paragraphs one and two both focus on cost. Give the second paragraph a separate job, such as access or counterarguments, so the essay develops instead of circling the same point.",
    },
    mistakes: [
      {
        title: "Making sections too similar",
        copy: "Each body paragraph should add a new part of the argument or explanation.",
      },
      {
        title: "Starting without evidence",
        copy: "An outline should show where key examples or sources will support the claim.",
      },
      {
        title: "Forgetting the conclusion's role",
        copy: "The ending should do more than repeat the introduction.",
      },
    ],
    faqs: [
      {
        question: "Can I check an outline instead of a full essay?",
        answer:
          "Yes, but feedback is more detailed when the outline includes a thesis and planned evidence.",
      },
      {
        question: "Does Yessay help with paragraph order?",
        answer:
          "Yes. It can flag repetition, missing transitions, and sections that may be out of order.",
      },
      {
        question: "Should I check the outline before writing?",
        answer:
          "If you have time, yes. Structure problems are easier to fix before the full draft is polished.",
      },
      {
        question: "Can it compare my outline to a rubric?",
        answer: "Yes. Add the rubric so missing categories are easier to spot.",
      },
    ],
    relatedSlugs: [
      "thesis-statement-checker",
      "paragraph-checker",
      "essay-checker",
      "essay-checker/research-paper",
    ],
  },
  {
    slug: "paragraph-checker",
    category: "writing-problem",
    title: "Paragraph Checker",
    metaTitle: "Paragraph Checker | Improve Focus, Flow and Evidence",
    metaDescription:
      "Check essay paragraphs for topic sentences, evidence, explanation, transitions, clarity, and whether each paragraph supports the thesis.",
    h1: "Paragraph Checker",
    eyebrow: "Improve one section at a time",
    heroCopy:
      "Review whether each paragraph has a clear point, useful evidence, and enough explanation. Yessay helps you find paragraphs that drift, repeat, or need stronger support.",
    ctaLabel: "Check my paragraphs",
    trustPoints: [
      "Topic sentence feedback",
      "Evidence and analysis review",
      "Flow between paragraphs",
    ],
    checks: [
      {
        title: "Topic sentences",
        copy: "See whether each paragraph starts with a clear idea or purpose.",
      },
      {
        title: "Evidence and explanation",
        copy: "Review whether examples are explained and tied back to the claim.",
      },
      {
        title: "Transitions",
        copy: "Find places where paragraphs need a clearer bridge to the next idea.",
      },
    ],
    explanation: {
      heading: "Strong paragraphs do one clear job",
      paragraphs: [
        "A paragraph should not just contain related sentences. It should develop one idea that supports the essay's larger purpose.",
        "Yessay reviews paragraphs in the context of your draft so it can flag repetition, missing analysis, weak topic sentences, and flow issues.",
      ],
    },
    example: {
      heading: "Example paragraph feedback",
      draftNote: "Paragraph issue: the quote appears before the point.",
      feedback:
        "Start this paragraph with your claim, then use the quote as support. After the quote, add analysis explaining how it proves the paragraph's point.",
    },
    mistakes: [
      {
        title: "Starting with evidence too soon",
        copy: "Readers need to know the paragraph's point before seeing the example.",
      },
      {
        title: "Ending without analysis",
        copy: "The final sentence should explain the significance, not simply stop after a quote.",
      },
      {
        title: "Combining too many ideas",
        copy: "If a paragraph has several unrelated jobs, split it or refocus it.",
      },
    ],
    faqs: [
      {
        question: "Can Yessay check one paragraph?",
        answer:
          "Yes, but including the full essay or assignment helps the tool understand the paragraph's role.",
      },
      {
        question: "What makes a paragraph strong?",
        answer:
          "A strong paragraph has a clear point, relevant support, explanation, and a connection to the essay's purpose.",
      },
      {
        question: "Can it help with transitions?",
        answer:
          "Yes. It can flag places where one paragraph does not clearly lead into the next.",
      },
      {
        question: "Does it check grammar too?",
        answer:
          "Yes. It includes clarity and grammar signals alongside paragraph structure.",
      },
    ],
    relatedSlugs: [
      "essay-outline-checker",
      "thesis-statement-checker",
      "essay-grammar-checker",
      "essay-feedback",
    ],
  },
  {
    slug: "essay-conclusion-checker",
    category: "writing-problem",
    title: "Essay Conclusion Checker",
    metaTitle: "Essay Conclusion Checker | Strengthen Your Final Paragraph",
    metaDescription:
      "Check your essay conclusion for closure, thesis connection, final insight, repetition, and whether it leaves the reader with a clear takeaway.",
    h1: "Essay Conclusion Checker",
    eyebrow: "Make the ending count",
    heroCopy:
      "Check whether your conclusion gives the essay a clear finish. Yessay reviews repetition, final insight, thesis connection, and whether the ending supports the assignment.",
    ctaLabel: "Check my conclusion",
    trustPoints: [
      "Closure and takeaway review",
      "Repetition checks",
      "Final paragraph feedback",
    ],
    checks: [
      {
        title: "Thesis connection",
        copy: "See whether the conclusion returns to the main idea without copying the introduction.",
      },
      {
        title: "Final insight",
        copy: "Check whether the ending explains what the reader should understand now.",
      },
      {
        title: "No new evidence dump",
        copy: "Flag endings that introduce important evidence too late.",
      },
    ],
    explanation: {
      heading: "A conclusion should close the argument, not restart it",
      paragraphs: [
        "Many conclusions either repeat the introduction or introduce a new point too late. A stronger ending shows why the essay's evidence matters.",
        "Yessay reviews your conclusion in context so feedback can account for the thesis, body paragraphs, and assignment expectations.",
      ],
    },
    example: {
      heading: "Example conclusion feedback",
      draftNote:
        "Conclusion issue: the final paragraph repeats the thesis word for word.",
      feedback:
        "Instead of repeating the thesis, explain what the evidence has shown overall. Add a final takeaway about why the argument matters for students or schools.",
    },
    mistakes: [
      {
        title: "Copying the introduction",
        copy: "Restating the same wording can make the ending feel unfinished.",
      },
      {
        title: "Adding major evidence at the end",
        copy: "Important proof belongs in the body paragraphs where it can be analyzed.",
      },
      {
        title: "Ending with a vague statement",
        copy: "The last sentence should leave a specific takeaway, not a generic importance claim.",
      },
    ],
    faqs: [
      {
        question: "What should an essay conclusion do?",
        answer:
          "It should reconnect to the thesis, synthesize the main point, and leave the reader with a clear takeaway.",
      },
      {
        question: "Can Yessay check only my conclusion?",
        answer:
          "Yes, but including the full draft gives better context for whether the ending fits the essay.",
      },
      {
        question: "Should I add new evidence in the conclusion?",
        answer:
          "Usually no. New evidence generally belongs in the body, not the final paragraph.",
      },
      {
        question: "How do I avoid repeating myself?",
        answer:
          "Focus on what the essay has shown rather than repeating the thesis sentence exactly.",
      },
    ],
    relatedSlugs: [
      "essay-hook-checker",
      "thesis-statement-checker",
      "paragraph-checker",
      "essay-checker",
    ],
  },
  {
    slug: "essay-hook-checker",
    category: "writing-problem",
    title: "Essay Hook Checker",
    metaTitle: "Essay Hook Checker | Improve Your Introduction",
    metaDescription:
      "Check your essay hook and introduction for relevance, clarity, reader interest, context, and connection to the thesis.",
    h1: "Essay Hook Checker",
    eyebrow: "Start with purpose",
    heroCopy:
      "Check whether your essay hook actually leads into the argument. Yessay reviews the opening, context, and thesis connection so the introduction feels focused.",
    ctaLabel: "Check my essay hook",
    trustPoints: [
      "Introduction feedback",
      "Thesis connection review",
      "No gimmicky hooks",
    ],
    checks: [
      {
        title: "Relevance",
        copy: "See whether the hook connects to the actual topic instead of feeling random.",
      },
      {
        title: "Context",
        copy: "Check whether the reader gets enough background before the thesis.",
      },
      {
        title: "Thesis lead-in",
        copy: "Review whether the opening naturally prepares the reader for the main claim.",
      },
    ],
    explanation: {
      heading: "A hook should open the door to the essay",
      paragraphs: [
        "A surprising first line is not useful if it does not connect to the assignment. The best hooks create interest while still leading toward the thesis.",
        "Yessay reviews the introduction as part of the whole draft, helping you spot openings that are too broad, disconnected, or slow to reach the point.",
      ],
    },
    example: {
      heading: "Example hook feedback",
      draftNote: "Hook issue: the first sentence is dramatic but unrelated.",
      feedback:
        "The opening quote gets attention, but it does not connect clearly to public transit policy. Start with a concrete city problem, then move into your thesis about access and cost.",
    },
    mistakes: [
      {
        title: "Opening with a dictionary definition",
        copy: "Definitions often feel generic unless the assignment specifically asks for one.",
      },
      {
        title: "Using a quote with no setup",
        copy: "A quote should connect directly to the issue your essay will discuss.",
      },
      {
        title: "Taking too long to reach the thesis",
        copy: "The introduction should build toward the main claim without wandering.",
      },
    ],
    faqs: [
      {
        question: "What makes a good essay hook?",
        answer:
          "A good hook interests the reader and connects naturally to the essay's topic and thesis.",
      },
      {
        question: "Can Yessay check my introduction?",
        answer:
          "Yes. It can review the hook, background context, and thesis connection.",
      },
      {
        question: "Should every essay have a dramatic hook?",
        answer:
          "No. Some academic essays work better with a clear problem, context, or focused opening.",
      },
      {
        question: "Can the hook be a question?",
        answer:
          "Sometimes, but it should be specific and useful rather than a broad question anyone could ask.",
      },
    ],
    relatedSlugs: [
      "essay-conclusion-checker",
      "thesis-statement-checker",
      "make-my-essay-sound-better",
      "essay-checker/college-essay",
    ],
  },
  {
    slug: "rubric-checker",
    category: "writing-problem",
    title: "Essay Rubric Checker",
    metaTitle: "Essay Rubric Checker | Compare Your Draft to a Rubric",
    metaDescription:
      "Paste your essay and rubric to get feedback on how well your draft matches the assignment criteria before submission.",
    h1: "Essay Rubric Checker",
    eyebrow: "Compare your draft to the criteria",
    heroCopy:
      "Paste your rubric with your draft and see where the essay may not match the assignment criteria. Yessay helps turn rubric language into a practical revision checklist.",
    ctaLabel: "Check against my rubric",
    trustPoints: [
      "Rubric category review",
      "Missing criteria signals",
      "Practical revision checklist",
    ],
    checks: [
      {
        title: "Criterion coverage",
        copy: "See whether the draft appears to address the rubric categories.",
      },
      {
        title: "Performance gaps",
        copy: "Flag places where a category may need stronger evidence or explanation.",
      },
      {
        title: "Submission checklist",
        copy: "Turn rubric requirements into items to verify before uploading.",
      },
    ],
    explanation: {
      heading: "Rubrics are useful only if you revise against them",
      paragraphs: [
        "Students often read the rubric after writing the essay, then realize a required category was missing. A rubric checker helps you compare the draft to the criteria before it is too late.",
        "Yessay uses the rubric you provide to produce feedback that is more specific than generic writing advice.",
      ],
    },
    example: {
      heading: "Example rubric feedback",
      draftNote:
        "Rubric issue: the assignment requires counterargument, but the draft does not include one.",
      feedback:
        "The rubric includes counterargument as a category. Add a paragraph that presents a reasonable objection and explains why your thesis still holds.",
    },
    mistakes: [
      {
        title: "Writing first, checking the rubric last",
        copy: "Rubrics can reveal required moves that should shape the draft from the start.",
      },
      {
        title: "Assuming good writing meets every criterion",
        copy: "A polished essay can still miss a specific rubric requirement.",
      },
      {
        title: "Ignoring category weights",
        copy: "Higher-value categories should guide where you spend revision time.",
      },
    ],
    faqs: [
      {
        question: "Can Yessay check my essay against a rubric?",
        answer:
          "Yes. Paste the rubric and draft so Yessay can flag likely alignment gaps.",
      },
      {
        question: "Does it guarantee a rubric score?",
        answer:
          "No. It gives revision feedback based on the rubric text, not a guaranteed grade.",
      },
      {
        question: "What if I do not have a rubric?",
        answer:
          "You can select that option in the checker and use general academic writing standards.",
      },
      {
        question: "Can it handle long rubrics?",
        answer:
          "Yes, but the clearest criteria usually produce the clearest feedback.",
      },
    ],
    relatedSlugs: [
      "essay-checker",
      "essay-grader",
      "essay-checker/research-paper",
      "essay-checker/argumentative-essay",
    ],
  },
];

export const seoLandingPagePaths = seoLandingPages.map((page) => page.slug);

const pagesBySlug = new Map(seoLandingPages.map((page) => [page.slug, page]));

export function getSeoLandingPage(slug: string) {
  return pagesBySlug.get(slug);
}

export function getSeoLandingPageBySegments(segments: string[]) {
  return getSeoLandingPage(segments.join("/"));
}

export function getRelatedSeoPages(page: SeoLandingPage) {
  return page.relatedSlugs
    .map((slug) => getSeoLandingPage(slug))
    .filter((relatedPage): relatedPage is SeoLandingPage =>
      Boolean(relatedPage),
    );
}

export function getSeoLandingPageHref(page: SeoLandingPage) {
  return `/${page.slug}`;
}

export const footerSeoLinks = [
  "essay-checker",
  "ai-essay-checker",
  "essay-feedback",
  "essay-grammar-checker",
  "rubric-checker",
  "thesis-statement-checker",
]
  .map(getSeoLandingPage)
  .filter((page): page is SeoLandingPage => Boolean(page));
