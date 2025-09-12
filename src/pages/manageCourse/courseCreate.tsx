import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Trash } from "lucide-react";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Select from "../../components/form/input/SelectField";
import Button from "../../components/ui/button/Button";

import { useAxios } from "../../hooks/useAxios";
import { API_PATHS, IMAGE_URL } from "../../utils/config";
import Label from "../../components/form/Label";
import { CategoryType, Course, Instructor } from "../../types/course";

import DropzoneComponent from "../../components/form/form-elements/DropZone";
import { useAuth } from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router";
import TextEditor from "../texteditor";


const enhanceListStyling = (html: string) => {
  return html
    .replace(/<ol([^>]*)>/g, '<ol class="list-decimal ml-6"$1>')
    .replace(/<ul([^>]*)>/g, '<ul class="list-disc ml-6"$1>');
};

export const RenderHtmlContent = ({ html }: { html: string }) => {
  const processedHtml = enhanceListStyling(html);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}

export default function CourseCreate() {

  const { adminToken } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"mcq" | "yesno" | "blank">("mcq");

  const [course, setCourse] = useState<Course>({
    createdBy: "admin",
    title: "",
    thumbnail: "",
    promoVideo:
      "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/rMadI-Zz9l0vd44f0/videoblocks-web-development_sk0c_cpra__4f01f9139763fa3bae63e48025ef7f14__P360.mp4",
    description:
      "Enhance your verbal, non-verbal, and written communication abilities to become an effective communicator in both personal and professional settings.",
    language: "English",
    pricingType: "paid",
    pricing: 100,
    category: {
      _id: "",
      name: "",
    },
    instructor: {
      _id: "",
      email: "",
      password: "",
      phone: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
    },
    whatYouLearn:
      "<ol><li>- Understand different forms of communication</li><li>- Develop effective listening and speaking techniques</li><li>- Communicate with confidence in a variety of settings</li><li>- Write clear and professional emails</li></ol>",
    courseInclude:
      "<ol><li>- 6 hours of video content</li><li>- Downloadable communication templates</li><li>- Certificate of completion</li></ol>",
    audience:
      "<ol><li><em>Anyone looking to improve their communication skills for personal growth or workplace success.</em></li></ol>",
    requirements:
      "<ol><li><em>A desire to improve communication and an open mind.</em></li></ol>",
    certificate: true,
    modules: [
      {
        name: "Fundamentals of Communication",
        chapters: [
          {
            title: "What is Communication?",
            description: `
            <p>Communication is the foundation of human interaction. It is the process of exchanging information, thoughts, ideas, and feelings between individuals or groups. In this chapter, you will understand:</p>
            <ul>
              <li><strong>The Communication Model:</strong> Includes sender, message, medium, receiver, and feedback.</li>
              <li><strong>Barriers to Communication:</strong> Such as noise, assumptions, and distractions that interfere with message delivery.</li>
              <li><strong>Feedback Importance:</strong> How it helps clarify understanding and confirms message receipt.</li>
            </ul>
            <p>You'll learn how different contexts (social, professional, cultural) shape the way we communicate, and explore the role of body language, tone, and facial expressions in enhancing or distorting messages.</p>
          `,
            video:
              "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/rMadI-Zz9l0vd44f0/videoblocks-web-development_sk0c_cpra__4f01f9139763fa3bae63e48025ef7f14__P360.mp4",
            audio: "",
            image: "",
            activities: [
              {
                mcq: [
                  {
                    question:
                      "Which of the following is a basic element of communication?",
                    options: [
                      { name: "Sender" },
                      { name: "Camera" },
                      { name: "Weather" },
                      { name: "Furniture" },
                    ],
                    answer: "Sender",
                  },
                ],
                yesno: [
                  {
                    question:
                      "Is feedback a part of the communication process?",
                    answer: "Yes",
                  },
                ],
                blank: [
                  {
                    question:
                      "______ is the process of exchanging information between individuals.",
                    answer: "Communication",
                  },
                ],
              },
            ],
          },
          {
            title: "Types of Communication",
            description: `
            <p>Communication comes in various forms, and being aware of these helps you adapt your style depending on the context. This chapter covers:</p>
            <ul>
              <li><strong>Verbal Communication:</strong> Spoken or written words, tone, clarity, and articulation.</li>
              <li><strong>Non-verbal Communication:</strong> Includes body language, gestures, posture, and eye contact.</li>
              <li><strong>Written Communication:</strong> Emails, reports, social media posts, and how structure and tone impact clarity.</li>
            </ul>
            <p>Understanding the difference between these types enables you to select the most effective method in personal and professional environments.</p>
          `,
            video:
              "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/rMadI-Zz9l0vd44f0/videoblocks-web-development_sk0c_cpra__4f01f9139763fa3bae63e48025ef7f14__P360.mp4",
            audio: "",
            image: "",
            activities: [
              {
                mcq: [
                  {
                    question: "Which is a form of non-verbal communication?",
                    options: [
                      { name: "Speaking" },
                      { name: "Gestures" },
                      { name: "Typing" },
                      { name: "Singing" },
                    ],
                    answer: "Gestures",
                  },
                ],
                yesno: [
                  {
                    question:
                      "Is writing considered a form of verbal communication?",
                    answer: "No",
                  },
                ],
                blank: [
                  {
                    question:
                      "Non-verbal communication includes facial expressions, posture, and ______.",
                    answer: "gestures",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "Interpersonal Communication",
        chapters: [
          {
            title: "Active Listening",
            description: `
            <p>Listening actively requires more than just hearing. This chapter introduces the importance of being fully present during communication. You will learn how to:</p>
            <ul>
              <li><strong>Paraphrase:</strong> Repeat what the speaker said in your own words to confirm understanding.</li>
              <li><strong>Summarize:</strong> Condense longer messages into key points to ensure clarity.</li>
              <li><strong>Ask Clarifying Questions:</strong> Ensure comprehension when messages seem unclear or ambiguous.</li>
            </ul>
            <p>We’ll also cover how to avoid distractions, give verbal and non-verbal cues of engagement, and create space for speakers to feel heard.</p>
          `,
            video:
              "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/rMadI-Zz9l0vd44f0/videoblocks-web-development_sk0c_cpra__4f01f9139763fa3bae63e48025ef7f14__P360.mp4",
            audio: "",
            image: "",
            activities: [
              {
                mcq: [
                  {
                    question: "What is a key trait of an active listener?",
                    options: [
                      { name: "Interrupting frequently" },
                      { name: "Looking around while listening" },
                      { name: "Paraphrasing what was heard" },
                      { name: "Focusing only on your reply" },
                    ],
                    answer: "Paraphrasing what was heard",
                  },
                ],
                yesno: [
                  {
                    question:
                      "Is avoiding eye contact a sign of active listening?",
                    answer: "No",
                  },
                ],
                blank: [
                  {
                    question:
                      "______ listening involves fully concentrating and responding to the speaker.",
                    answer: "Active",
                  },
                ],
              },
            ],
          },
          {
            title: "Building Rapport",
            description: `
            <p>Rapport is a connection or relationship with others. It helps in improving collaboration and trust. In this chapter, you will explore:</p>
            <ul>
              <li><strong>Mirroring:</strong> Mimicking body language to create psychological alignment.</li>
              <li><strong>Empathy:</strong> Demonstrating genuine concern and understanding of the other person's feelings.</li>
              <li><strong>Trust Building:</strong> Creating a safe environment where open communication is encouraged.</li>
            </ul>
            <p>Whether in personal or professional life, learning to build rapport makes interactions smoother and more productive.</p>
          `,
            video:
              "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/rMadI-Zz9l0vd44f0/videoblocks-web-development_sk0c_cpra__4f01f9139763fa3bae63e48025ef7f14__P360.mp4",
            audio: "",
            image: "",
            activities: [
              {
                mcq: [
                  {
                    question:
                      "Which of the following helps in building rapport?",
                    options: [
                      { name: "Being overly formal" },
                      { name: "Mirroring body language" },
                      { name: "Interrupting often" },
                      { name: "Talking only about yourself" },
                    ],
                    answer: "Mirroring body language",
                  },
                ],
                yesno: [
                  {
                    question: "Is trust important in building rapport?",
                    answer: "Yes",
                  },
                ],
                blank: [
                  {
                    question:
                      "______ is created through mutual respect, understanding, and empathy.",
                    answer: "Rapport",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "Professional Communication",
        chapters: [
          {
            title: "Email Etiquette",
            description: `
            <p>Email remains a vital tool in business communication. In this chapter, you’ll learn:</p>
            <ul>
              <li><strong>Writing Clear Subject Lines:</strong> Convey the purpose of the email in one line.</li>
              <li><strong>Professional Greetings and Closures:</strong> Use appropriate salutations and signatures.</li>
              <li><strong>Structuring Body Content:</strong> Keep paragraphs concise and formatted properly.</li>
            </ul>
            <p>We’ll also explore common pitfalls such as using slang, writing in all caps, and forgetting to proofread your message.</p>
          `,
            video:
              "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/rMadI-Zz9l0vd44f0/videoblocks-web-development_sk0c_cpra__4f01f9139763fa3bae63e48025ef7f14__P360.mp4",
            audio: "",
            image: "",
            activities: [
              {
                mcq: [
                  {
                    question:
                      "Which of the following should you include in a professional email?",
                    options: [
                      { name: "Memes" },
                      { name: "Subject line" },
                      { name: "Slang terms" },
                      { name: "All caps text" },
                    ],
                    answer: "Subject line",
                  },
                ],
                yesno: [
                  {
                    question:
                      "Should you always include a greeting and closing in a professional email?",
                    answer: "Yes",
                  },
                ],
                blank: [
                  {
                    question:
                      "A clear ______ helps the recipient understand the purpose of your email.",
                    answer: "subject line",
                  },
                ],
              },
            ],
          },
          {
            title: "Giving and Receiving Feedback",
            description: `
            <p>Constructive feedback fosters growth. This chapter introduces:</p>
            <ul>
              <li><strong>The SBI Model:</strong> Situation, Behavior, Impact – a structure to deliver feedback clearly.</li>
              <li><strong>Effective Listening:</strong> Accepting feedback without defensiveness.</li>
              <li><strong>Growth Mindset:</strong> Using feedback as an opportunity for learning and development.</li>
            </ul>
            <p>Mastering feedback conversations strengthens team dynamics and promotes a positive communication culture.</p>
          `,
            video:
              "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/rMadI-Zz9l0vd44f0/videoblocks-web-development_sk0c_cpra__4f01f9139763fa3bae63e48025ef7f14__P360.mp4",
            audio: "",
            image: "",
            activities: [
              {
                mcq: [
                  {
                    question: "What is a good model for giving feedback?",
                    options: [
                      { name: "ABC" },
                      { name: "SBI" },
                      { name: "FAQ" },
                      { name: "FYI" },
                    ],
                    answer: "SBI",
                  },
                ],
                yesno: [
                  {
                    question: "Is it helpful to give feedback in private?",
                    answer: "Yes",
                  },
                ],
                blank: [
                  {
                    question:
                      "The 'S' in SBI feedback model stands for ______.",
                    answer: "Situation",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  // this is came from the edit button from the course list to edit course

  const location = useLocation();
  const { courseId } = location.state || {};

  const {
    data: courseData,
    loading: courseDefaultLoading
  } = useAxios({
    url: courseId ? `${API_PATHS.COURSE_DETAIL}/${courseId}` : "",
    method: "get",
  });

  useEffect(() => {
    if (!courseDefaultLoading && courseData) {
      setCourse(courseData);
    }
  }, [courseData, courseDefaultLoading]);

  // this is came from the edit button from the course list to edit course


  const buildCourseFormData = (course: Course, courseStatus: string) => {

    console.log("courseStatus ==> ", courseStatus);
    const formData = new FormData();

    // Top-level fields
    formData.append("createdBy", course.createdBy);
    formData.append("title", course.title);
    formData.append("promoVideo", course.promoVideo);
    formData.append("description", course.description);
    formData.append("language", course.language);
    formData.append("pricingType", course.pricingType);
    formData.append("pricing", course.pricing.toString());
    formData.append("courseStatus", courseStatus);
    formData.append("certificate", course.certificate?.toString());

    // Thumbnail (file or string)
    if (typeof course.thumbnail === "string") {
      formData.append("thumbnail", course.thumbnail);
    } else if (course.thumbnail instanceof File) {
      formData.append("thumbnail", course.thumbnail, course.thumbnail.name);
    }

    // Category
    if (course?.category._id) {
      formData.append("category[_id]", course.category._id);
    }
    formData.append("category[name]", course.category.name);

    // Instructor
    Object.entries(course.instructor).forEach(([key, value]) => {
      formData.append(`instructor[${key}]`, value);
    });

    // HTML strings
    formData.append("whatYouLearn", course.whatYouLearn);
    formData.append("courseInclude", course.courseInclude);
    formData.append("audience", course.audience);
    formData.append("requirements", course.requirements);

    // Modules and Chapters
    course.modules.forEach((module, mIdx) => {
      formData.append(`modules[${mIdx}][name]`, module.name);

      module.chapters.forEach((chapter, cIdx) => {
        const base = `modules[${mIdx}][chapters][${cIdx}]`;

        formData.append(`${base}[title]`, chapter.title);
        formData.append(`${base}[description]`, chapter.description);
        formData.append(`${base}[video]`, chapter.video);

        // Audio
        if (typeof chapter.audio === "string") {
          formData.append(`${base}[audio]`, chapter.audio);
        } else if (chapter.audio instanceof File) {
          formData.append(`${base}[audio]`, chapter.audio, chapter.audio.name);
        }

        // Image
        if (typeof chapter.image === "string") {
          formData.append(`${base}[image]`, chapter.image);
        } else if (chapter.image instanceof File) {
          formData.append(`${base}[image]`, chapter.image, chapter.image.name);
        }

        // Activities (with nested mcq, yesno, blank)
        chapter.activities.forEach((activity, aIdx) => {
          const activityBase = `${base}[activities][${aIdx}]`;

          // MCQs
          activity.mcq.forEach((q, qIdx) => {
            const qBase = `${activityBase}[mcq][${qIdx}]`;
            formData.append(`${qBase}[question]`, q.question);
            q.options.forEach((opt, oIdx) => {
              formData.append(`${qBase}[options][${oIdx}][name]`, opt.name);
            });
            formData.append(`${qBase}[answer]`, q.answer);
          });

          // Yes/No
          activity.yesno.forEach((q, qIdx) => {
            const qBase = `${activityBase}[yesno][${qIdx}]`;
            formData.append(`${qBase}[question]`, q.question);
            formData.append(`${qBase}[answer]`, q.answer);
          });

          // Fill in the Blank
          activity.blank.forEach((q, qIdx) => {
            const qBase = `${activityBase}[blank][${qIdx}]`;
            formData.append(`${qBase}[question]`, q.question);
            formData.append(`${qBase}[answer]`, q.answer);
          });
        });
      });
    });

    return formData;
  };

  const { loading: addLoading, refetch: addCourseRequest } = useAxios({
    url: API_PATHS.ADD_COURSE,
    method: "post",
    // body: course,
    manual: true,
    config: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      Authorization: adminToken ? `Bearer ${adminToken}` : "",
    },
  });

  //draft edit api
  const {
    // loading: editLoading,
    refetch: editCourseRequest,
  } = useAxios({
    url: `${API_PATHS.EDIT_COURSE}/${course._id}`,
    method: "put",
    manual: true,
    config: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      Authorization: adminToken ? `Bearer ${adminToken}` : "",
    }
  });

  const saveDraft = async (event?: Event) => {
    event?.preventDefault();
    const courseStatus = course?.courseStatus === "published" ? "published" : "draft"
    const formData = buildCourseFormData(course, courseStatus);

    // Choose correct endpoint based on _id
    const apiCall = course._id ? editCourseRequest : addCourseRequest;

    const { success, data } = await apiCall({ body: formData });
    console.log(success, data)

    if (success && data?._id && !course._id) {
      setCourse((prev) => ({
        ...prev,
        _id: data._id,
      }));
    }
  };

  useEffect(() => {
    if (!course?.instructor || !course.title.trim() || !course?.category) return;

    const timeoutId = setTimeout(() => {
      saveDraft();
    }, 800); // 800ms debounce delay

    return () => clearTimeout(timeoutId); // Clear if effect re-runs before timeout finishes
  }, [course.instructor, course.title, course.category, course]);


  const isCourseValid = () => {
    return course.title.trim() !== "" && course.modules.length > 0;
  };

  const handleSubmit = async () => {
    const updatedCourse = { ...course };

    // If not saving as draft, validate the form
    if (!isCourseValid()) {
      alert("Please complete all required fields.");
      return;
    }

    const formData = buildCourseFormData(updatedCourse, "published");

    let response;

    if (course._id) {
      // Editing existing course
      response = await editCourseRequest({ body: formData });
    } else {
      // Creating new course
      response = await addCourseRequest({ body: formData });
    }

    const { success } = response;

    if (success) {
      navigate("/courses");
      // Clear form
      setCourse({
        createdBy: "admin",
        title: "",
        thumbnail: "",
        promoVideo: "",
        description: "",
        language: "English",
        pricingType: "paid",
        pricing: 0,
        category: { _id: "", name: "" },
        instructor: {
          _id: "",
          email: "",
          password: "",
          phone: "",
          firstName: "",
          lastName: "",
          address: "",
          city: "",
        },
        whatYouLearn: "",
        courseInclude: "",
        audience: "",
        requirements: "",
        certificate: true,
        modules: [],
      });
    }
  };

  const [showSuggestions, setShowSuggestions] = useState(false);
  const { data: categories } = useAxios<CategoryType[]>({
    url: API_PATHS.CATEGORIES,
    method: "get",
  });

  const filteredCategories = useMemo(() => {
    const search = course.category.name.toLowerCase();
    return (
      categories?.filter((category: CategoryType) =>
        category.name.toLowerCase().includes(search)
      ) || []
    );
  }, [course.category.name, categories]);

  const { data: instructors } = useAxios<Instructor[]>({
    url: API_PATHS.INSTRUCTORS,
    method: "get",
  });

  const [showInstructorSuggestions, setShowInstructorSuggestions] = useState(false);

  const filteredInstructors = useMemo(() => {
    const search = course.instructor.firstName.toLowerCase();
    return (
      instructors?.filter(
        (instructor: Instructor) =>
          instructor.firstName.toLowerCase().includes(search) ||
          instructor.lastName.toLowerCase().includes(search)
      ) || []
    );
  }, [course.instructor, instructors]);

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  if (addLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-300 rounded dark:bg-gray-700" />
        <div className="flex space-x-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="px-6 py-2 bg-gray-300 rounded-2xl dark:bg-gray-700 w-24 h-8"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white mb-5">
        Create Course
      </h2>

      {/* Step Tabs */}
      <div className="flex space-x-2 text-xs font-semibold ">
        {[
          "Instructor",
          "Category",
          "Basic",
          "Curriculum",
          "Metadata",
          "Pricing",
          "Publish",
        ].map((label, i) => (
          <button
            key={i}
            className={`px-3 py-1 border flex items-center space-x-1 rounded-2xl ${step === i + 1
              ? "bg-sky-600 text-white"
              : "bg-gray-100 dark:bg-gray-700"
              }`}
            onClick={() => setStep(i + 1)}
          >
            <span>{i + 1}.</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="h-1 w-full bg-gray-200 rounded overflow-hidden">
        <div
          className="h-1 bg-sky-600 transition-all"
          style={{ width: `${(step / 6) * 100}%` }}
        />
      </div>


      {step === 1 && (
        <section className="rounded-xl p-4  bg-white dark:bg-black text-xs space-y-2">

          <div className="pt-4 space-y-2">
            <Label className="font-bold text-sm">Instructor Details</Label>

            <div className="relative">
              <input
                type="text"
                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Start typing an instructor's name..."
                value={course.instructor.firstName}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value.trim() === "") {
                    setCourse((prev) => ({
                      ...prev,
                      instructor: {
                        ...prev.instructor,
                        firstName: "",
                        lastName: "",
                        email: "",
                        password: "",
                        phone: "",
                        address: "",
                        city: "",
                      },
                    }));
                    setShowInstructorSuggestions(false);
                  } else {
                    setCourse((prev) => ({
                      ...prev,
                      instructor: {
                        ...prev.instructor,
                        firstName: value,
                      },
                    }));
                    setShowInstructorSuggestions(true);
                  }
                }}
                onFocus={() => setShowInstructorSuggestions(true)}
              />

              {showInstructorSuggestions && filteredInstructors.length > 0 && (
                <ul className="absolute z-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 mt-1 rounded max-h-40 overflow-y-auto w-full text-sm">
                  {filteredInstructors.map((instructor) => (
                    <li
                      key={instructor._id}
                      className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={() => {
                        setCourse((prev) => ({
                          ...prev,
                          instructor: { ...instructor },
                        }));
                        setShowInstructorSuggestions(false);
                      }}
                    >
                      {instructor.firstName} {instructor.lastName}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {[
              { label: "First Name", field: "firstName" },
              { label: "Last Name", field: "lastName" },
              { label: "Email", field: "email" },
              { label: "Password", field: "password", type: "password" },
              { label: "Phone", field: "phone" },
              { label: "Address", field: "address" },
              { label: "City", field: "city" },
            ].map(({ label, field, type }) => (
              <div key={field}>
                <Label>{label}</Label>
                <Input
                  type={type || "text"}
                  placeholder={label}
                  value={course.instructor[field as keyof Instructor] as string | number}
                  onChange={(e) =>
                    setCourse((prev) => ({
                      ...prev,
                      instructor: {
                        ...prev.instructor,
                        [field]: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Step 2: Category */}
      {step === 2 && (
        <section className="rounded-xl p-4  bg-white dark:bg-black text-xs space-y-2">
          <Label>Category</Label>
          <div className="relative">
            <input
              type="text"
              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Start typing a user's name..."
              value={course.category.name}
              onChange={(e) => {
                const value = e.target.value;

                if (value.trim() === "") {
                  // If input is cleared, reset the entire customer form
                  setCourse({ ...course, category: { name: "" } }),
                    setShowSuggestions(false);
                } else {
                  setCourse({ ...course, category: { name: value } });
                  setShowSuggestions(true);
                }
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && filteredCategories.length > 0 && (
              <ul className="absolute z-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 mt-1 rounded max-h-40 overflow-y-auto w-full text-sm">
                {filteredCategories.map((category: CategoryType) => (
                  <li
                    key={category._id}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                    onClick={() => {
                      setCourse({
                        ...course,
                        category: {
                          _id: category._id, // ✅ Add this
                          name: category.name,
                        },
                      });
                      setShowSuggestions(false);
                    }}
                  >
                    {category?.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="rounded-xl  bg-white dark:bg-black p-4 text-xs space-y-2">
          {[
            { label: "Title", value: course.title, field: "title" },
            {
              label: "Short Description",
              value: course.description,
              field: "description",
              type: "textarea",
            },
            { label: "Language", value: course.language, field: "language" },
            {
              label: "Thumbnail URL",
              value: course.thumbnail,
              field: "thumbnail",
              type: "image",
            },
            {
              label: "Promo Video",
              value: course.promoVideo,
              field: "promoVideo",
            },
          ].map(({ label, value, field, type }) => {
            const normalizedValue = typeof value === "string" ? value : URL.createObjectURL(value);

            return (
              <div key={field}>
                <Label>{label}</Label>
                {type === "textarea" ? (
                  <TextArea
                    placeholder={label}
                    value={typeof value === "string" ? value : ""}
                    onChange={(v) => setCourse({ ...course, [field]: v })}
                  />
                ) : type === "image" ? (
                  <DropzoneComponent
                    accept={{ "image/*": [".jpg", ".jpeg", ".png"] }}
                    label="Upload Thumbnail Image"
                    helperText="Only .jpg, .jpeg, or .png files are supported"
                    previewFile={(typeof value === "string" && value.startsWith("/uploads")) ? IMAGE_URL + value : normalizedValue}
                    onDrop={(files: File[]) => {
                      const file = files[0];
                      setCourse({ ...course, thumbnail: file });
                    }}
                  />
                ) : (
                  <Input
                    placeholder={label}
                    value={typeof value === "string" ? value : ""}
                    onChange={(e) =>
                      setCourse({ ...course, [field]: e.target.value })
                    }
                  />
                )}
              </div>
            );
          })}
          {/* <Button onClick={saveDraft} className="mt-5 bg-red-400">
            Save Draft <ChevronRight size={12} />
          </Button> */}
        </section>
      )}

      {step === 4 && (
        <section className="rounded-xl p-4 bg-white dark:bg-black text-xs space-y-4">
          {course.modules.map((mod, mIdx) => (
            <details
              key={mIdx}
              className="border rounded bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 group"
            >
              <summary className="font-semibold flex justify-between items-center p-4 cursor-pointer bg-gray-100 group-open:bg-blue-light-100  dark:group-open:bg-gray-700">
                <span className="flex items-center gap-2 group-open:text-dark">
                  <ChevronRight
                    className="transform transition-transform duration-200 group-open:rotate-90"
                    size={16}
                  />
                  {mIdx + 1}. {mod.name || "Untitled Module"}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const mods = [...course.modules];
                    mods.splice(mIdx, 1);
                    setCourse({ ...course, modules: mods });
                  }}
                  title="Delete module"
                >
                  <Trash size={14} className="text-red-500" />
                </button>
              </summary>

              <div className="p-4 space-y-4">
                <Label>Module Title</Label>
                <Input
                  className="dark:bg-gray-900"
                  placeholder="Module Title"
                  value={mod.name}
                  onChange={(e) => {
                    const mods = [...course.modules];
                    mods[mIdx].name = e.target.value;
                    setCourse({ ...course, modules: mods });
                  }}
                />

                {mod.chapters.map((ch, cIdx) => (
                  <details
                    key={cIdx}
                    className="border-l-5 border-red-500 pl-4 bg-gray-100 dark:bg-gray-800 p-3 rounded relative space-y-4"
                  >
                    <summary className="flex justify-between items-center font-semibold cursor-pointer mb-0">
                      <span className="flex items-center gap-2 group-open:text-dark">
                        <ChevronRight
                          className="transform transition-transform duration-200 group-open:rotate-90"
                          size={16}
                        />
                        Chapter: {cIdx + 1}. {ch.title || "Untitled Chapter"}
                      </span>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const mods = [...course.modules];
                          mods[mIdx].chapters.splice(cIdx, 1);
                          setCourse({ ...course, modules: mods });
                        }}
                        title="Delete chapter"
                      >
                        <Trash size={12} className="text-red-500" />
                      </button>
                    </summary>

                    <div className="space-y-3 my-5">
                      <Label>Chapter Title</Label>
                      <Input
                        className="dark:bg-gray-900"
                        placeholder="Chapter Title"
                        value={ch.title}
                        onChange={(e) => {
                          const mods = [...course.modules];
                          mods[mIdx].chapters[cIdx].title = e.target.value;
                          setCourse({ ...course, modules: mods });
                        }}
                      />

                      <Label>Description</Label>
                      {/* <ReactQuill
                        theme="snow"
                        value={ch.description || ""}
                        onChange={(v) => {
                          const mods = [...course.modules];
                          mods[mIdx].chapters[cIdx].description = v;
                          setCourse({ ...course, modules: mods });
                        }}
                        className="text-xs mb-15"
                        style={{ height: 400 }}
                        modules={modules}
                        formats={formats}
                      /> */}

                      <TextEditor
                        value={enhanceListStyling(ch.description) || ""}
                        onChange={(v) => {
                          const mods = [...course.modules];
                          mods[mIdx].chapters[cIdx].description = enhanceListStyling(v);
                          setCourse({ ...course, modules: mods });
                        }} />

                      <Label>Video URL</Label>
                      <Input
                        className="dark:bg-gray-900"
                        placeholder="Video URL"
                        value={ch.video || ""}
                        onChange={(e) => {
                          const mods = [...course.modules];
                          mods[mIdx].chapters[cIdx].video = e.target.value;
                          setCourse({ ...course, modules: mods });
                        }}
                      />

                      <Label>Audio URL</Label>
                      <DropzoneComponent
                        accept={{
                          "audio/*": [".mp3", ".wav", ".m4a", ".aac", ".ogg"],
                        }}
                        label="Upload Audio"
                        helperText="Only .mp3, .wav, .m4a, .aac, or .ogg files are supported"
                        previewFile={(typeof ch.audio === "string" && ch.audio.startsWith("/uploads")) ? IMAGE_URL + ch.audio : ch.audio}
                        onDrop={(files: File[]) => {
                          const mods = [...course.modules];
                          mods[mIdx].chapters[cIdx].audio = files[0];
                          setCourse({ ...course, modules: mods });
                        }}
                      />

                      <Label>Image URL</Label>
                      <DropzoneComponent
                        accept={{ "image/*": [".jpg", ".jpeg", ".png"] }}
                        label="Upload Image"
                        helperText="Only .jpg, .jpeg, or .png files are supported"
                        previewFile={(typeof ch.image === "string" && ch.image.startsWith("/uploads")) ? IMAGE_URL + ch.image : ch.image}
                        onDrop={(files: File[]) => {
                          const mods = [...course.modules];
                          mods[mIdx].chapters[cIdx].image = files[0];
                          setCourse({ ...course, modules: mods });
                        }}
                      />

                      <div className="space-y-4 mt-3">
                        {ch.activities.map((activity, aIdx) => {
                          return (
                            <details
                              key={aIdx}
                              className="group border border-orange-300 dark:border-orange-700 bg-yellow-50 dark:bg-orange-900 rounded-xl p-4 transition-all space-y-3"
                            >
                              <summary className="flex justify-between items-center cursor-pointer font-semibold text-orange-800 dark:text-orange-100">
                                <span>Activity #{aIdx + 1}</span>
                                <ChevronRight
                                  className="transform transition-transform duration-200 group-open:rotate-90"
                                  size={16}
                                />
                              </summary>

                              {/* === Tabs === */}
                              <div className="flex gap-2 mt-3">
                                {["mcq", "yesno", "blank"].map((tab) => (
                                  <button
                                    key={tab}
                                    onClick={() =>
                                      setActiveTab(
                                        tab as "mcq" | "yesno" | "blank"
                                      )
                                    }
                                    className={`px-3 py-1 rounded-md text-sm font-medium capitalize ${activeTab === tab
                                      ? "bg-orange-600 text-white"
                                      : "bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-white"
                                      }`}
                                  >
                                    {tab === "mcq"
                                      ? "MCQ"
                                      : tab === "yesno"
                                        ? "Yes / No"
                                        : "Blank"}
                                  </button>
                                ))}
                              </div>

                              {/* === Tab Content === */}
                              <div className="mt-4 space-y-4">
                                {/* === MCQ === */}
                                {activeTab === "mcq" &&
                                  activity.mcq.map((q, qIdx) => (
                                    <div key={qIdx} className="space-y-2">
                                      <Input
                                        className="dark:bg-gray-900"
                                        placeholder="Enter MCQ question"
                                        value={q.question}
                                        onChange={(e) => {
                                          const mods = [...course.modules];
                                          mods[mIdx].chapters[cIdx].activities[
                                            aIdx
                                          ].mcq[qIdx].question = e.target.value;
                                          setCourse({
                                            ...course,
                                            modules: mods,
                                          });
                                        }}
                                      />
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {q.options.map((opt, optIdx) => (
                                          <div
                                            key={optIdx}
                                            className="relative"
                                          >
                                            <Input
                                              className={`dark:bg-gray-900 pr-10 ${opt.name === q.answer
                                                ? "border-2 border-green-500 ring-2 ring-green-300 dark:ring-green-700"
                                                : ""
                                                }`}
                                              placeholder={`Option ${optIdx + 1
                                                }`}
                                              value={opt.name}
                                              onChange={(e) => {
                                                const mods = [
                                                  ...course.modules,
                                                ];
                                                mods[mIdx].chapters[
                                                  cIdx
                                                ].activities[aIdx].mcq[
                                                  qIdx
                                                ].options[optIdx].name =
                                                  e.target.value;
                                                setCourse({
                                                  ...course,
                                                  modules: mods,
                                                });
                                              }}
                                            />
                                            <button
                                              onClick={() => {
                                                const mods = [
                                                  ...course.modules,
                                                ];
                                                mods[mIdx].chapters[
                                                  cIdx
                                                ].activities[aIdx].mcq[
                                                  qIdx
                                                ].options.splice(optIdx, 1);
                                                setCourse({
                                                  ...course,
                                                  modules: mods,
                                                });
                                              }}
                                              className="absolute top-1 right-1 text-red-500"
                                            >
                                              <Trash size={12} />
                                            </button>
                                          </div>
                                        ))}
                                      </div>

                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          const mods = [...course.modules];
                                          mods[mIdx].chapters[cIdx].activities[
                                            aIdx
                                          ].mcq[qIdx].options.push({
                                            name: "",
                                          });
                                          setCourse({
                                            ...course,
                                            modules: mods,
                                          });
                                        }}
                                      >
                                        + Add Option
                                      </Button>

                                      <Input
                                        className="dark:bg-gray-900 border-2 border-green-500 mt-2"
                                        placeholder="Correct answer"
                                        value={q.answer}
                                        onChange={(e) => {
                                          const mods = [...course.modules];
                                          mods[mIdx].chapters[cIdx].activities[
                                            aIdx
                                          ].mcq[qIdx].answer = e.target.value;
                                          setCourse({
                                            ...course,
                                            modules: mods,
                                          });
                                        }}
                                      />
                                    </div>
                                  ))}

                                {activeTab === "mcq" && (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      const mods = [...course.modules];
                                      mods[mIdx].chapters[cIdx].activities[
                                        aIdx
                                      ].mcq.push({
                                        question: "",
                                        options: [{ name: "" }],
                                        answer: "",
                                      });
                                      setCourse({ ...course, modules: mods });
                                    }}
                                  >
                                    + Add MCQ
                                  </Button>
                                )}

                                {/* === Yes/No === */}
                                {activeTab === "yesno" &&
                                  activity.yesno.map((q, qIdx) => (
                                    <div key={qIdx} className="space-y-2">
                                      <Input
                                        className="dark:bg-gray-900"
                                        placeholder="Enter Yes/No question"
                                        value={q.question}
                                        onChange={(e) => {
                                          const mods = [...course.modules];
                                          mods[mIdx].chapters[cIdx].activities[
                                            aIdx
                                          ].yesno[qIdx].question =
                                            e.target.value;
                                          setCourse({
                                            ...course,
                                            modules: mods,
                                          });
                                        }}
                                      />
                                      <select
                                        className="w-full dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md p-2"
                                        value={q.answer}
                                        onChange={(e) => {
                                          const mods = [...course.modules];
                                          mods[mIdx].chapters[cIdx].activities[
                                            aIdx
                                          ].yesno[qIdx].answer = e.target.value;
                                          setCourse({
                                            ...course,
                                            modules: mods,
                                          });
                                        }}
                                      >
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                      </select>
                                    </div>
                                  ))}

                                {activeTab === "yesno" && (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      const mods = [...course.modules];
                                      mods[mIdx].chapters[cIdx].activities[
                                        aIdx
                                      ].yesno.push({
                                        question: "",
                                        answer: "",
                                      });
                                      setCourse({ ...course, modules: mods });
                                    }}
                                  >
                                    + Add Yes/No
                                  </Button>
                                )}

                                {/* === Blank === */}
                                {activeTab === "blank" &&
                                  activity.blank.map((q, qIdx) => (
                                    <div key={qIdx} className="space-y-2">
                                      <Input
                                        className="dark:bg-gray-900"
                                        placeholder="Enter blank question"
                                        value={q.question}
                                        onChange={(e) => {
                                          const mods = [...course.modules];
                                          mods[mIdx].chapters[cIdx].activities[
                                            aIdx
                                          ].blank[qIdx].question =
                                            e.target.value;
                                          setCourse({
                                            ...course,
                                            modules: mods,
                                          });
                                        }}
                                      />
                                      <Input
                                        className="dark:bg-gray-900 border-2 border-green-500"
                                        placeholder="Correct answer"
                                        value={q.answer}
                                        onChange={(e) => {
                                          const mods = [...course.modules];
                                          mods[mIdx].chapters[cIdx].activities[
                                            aIdx
                                          ].blank[qIdx].answer = e.target.value;
                                          setCourse({
                                            ...course,
                                            modules: mods,
                                          });
                                        }}
                                      />
                                    </div>
                                  ))}

                                {activeTab === "blank" && (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      const mods = [...course.modules];
                                      mods[mIdx].chapters[cIdx].activities[
                                        aIdx
                                      ].blank.push({
                                        question: "",
                                        answer: "",
                                      });
                                      setCourse({ ...course, modules: mods });
                                    }}
                                  >
                                    + Add Blank
                                  </Button>
                                )}
                              </div>
                            </details>
                          );
                        })}

                        {/**  <details className="border border-dashed rounded-md p-4 mt-4 bg-orange-100 dark:bg-orange-800">
                          <summary className="cursor-pointer text-orange-700 dark:text-orange-200 font-medium">
                            + Add New Activity
                          </summary>
                          <div className="mt-4">
                            <Button
                              size="sm"
                              onClick={() => {
                                const mods = [...course.modules];
                                mods[mIdx].chapters[cIdx].quiz.push({
                                  type: "mcq",
                                  question: "",
                                  options: [{ name: "" }],
                                  answer: "",
                                });
                                setCourse({ ...course, modules: mods });
                              }}
                            >
                              + Add Activity
                            </Button>
                          </div>
                        </details> */}
                      </div>
                    </div>
                  </details>
                ))}

                <Button
                  size="sm"
                  onClick={() => {
                    const mods = [...course.modules];
                    mods[mIdx].chapters.push({
                      title: "",
                      description: "",
                      video: "",
                      audio: "",
                      image: "",

                      activities: [
                        {
                          mcq: [
                            {
                              question: "",
                              options: [{ name: "" }],
                              answer: "",
                            },
                          ],
                          yesno: [
                            {
                              question: "",
                              answer: "",
                            },
                          ],
                          blank: [
                            {
                              question: "",
                              answer: "",
                            },
                          ],
                        },
                      ],
                    });
                    setCourse({ ...course, modules: mods });
                  }}
                >
                  + Add Chapter
                </Button>
              </div>
            </details>
          ))}

          <Button
            size="sm"
            onClick={() =>
              setCourse({
                ...course,
                modules: [...course.modules, { name: "", chapters: [] }],
              })
            }
          >
            + Add Module
          </Button>
        </section>
      )}

      {/* Step 4: Metadata */}
      {step === 5 && (
        <section className="rounded-xl  bg-white dark:bg-black p-4 text-xs space-y-4">
          <div className="flex flex-col col-span-full mb-15">
            <Label>
              What You’ll Learn <span className="text-error-500">*</span>
            </Label>

            <TextEditor value={enhanceListStyling(course.whatYouLearn)}
              onChange={(value) =>
                setCourse({ ...course, whatYouLearn: enhanceListStyling(value) })
              } />
          </div>

          <div className="flex flex-col col-span-full mb-15">
            <Label>
              Course Includes <span className="text-error-500">*</span>
            </Label>

            <TextEditor value={enhanceListStyling(course.courseInclude)}
              onChange={(value) =>
                setCourse({ ...course, courseInclude: value })
              }
            />

          </div>

          <div className="flex flex-col col-span-full mb-15">
            <Label>
              Target Audience <span className="text-error-500">*</span>
            </Label>



            <TextEditor
              placeholder="Who is this course for?"
              value={enhanceListStyling(course.audience)}
              onChange={(value) => setCourse({ ...course, audience: enhanceListStyling(value) })}
            />

          </div>

          <div className="flex flex-col col-span-full mb-15">
            <Label>
              Requirements <span className="text-error-500">*</span>
            </Label>

            <TextEditor
              value={enhanceListStyling(course.requirements)}
              onChange={(value) =>
                setCourse({ ...course, requirements: enhanceListStyling(value) })
              }
              placeholder="What are the prerequisites for this course?"
            />

          </div>

          <Label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={course.certificate}
              onChange={(e) =>
                setCourse({
                  ...course,
                  certificate: e.target.checked,
                })
              }
            />
            <span>Certificate of Completion</span>
          </Label>
        </section>
      )}

      {step === 6 && (
        <section className="rounded-xl p-4 bg-white dark:bg-black text-xs space-y-2">
          <Label>
            Pricing Type <span className="text-error-500">*</span>
          </Label>
          <Select
            placeholder="Pricing Type"
            options={[
              { value: "free", label: "Free" },
              { value: "paid", label: "Paid" },
            ]}
            value={course.pricingType}
            onChange={(v) => setCourse({ ...course, pricingType: v })}
            className="mb-3"
          />

          <Label>Price</Label>
          <Input
            type="number"
            placeholder="Price"
            value={course.pricing}
            onChange={(e) =>
              setCourse({ ...course, pricing: Number(e.target.value) || 0 })
            }
          />
        </section>
      )}

      {step === 7 && course && (
        <section className="rounded-xl p-4 bg-slate-50 dark:bg-slate-800 text-sm space-y-6">
          <h2 className="text-xl font-semibold border-b pb-2">
            Course Overview
          </h2>

          {/* Thumbnail and Promo Video */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-2 bg-white dark:bg-slate-700">
              <img
                src={
                  typeof course.thumbnail === "string"
                    ? course.thumbnail
                    : URL.createObjectURL(course.thumbnail)
                }
                alt="Thumbnail"
                className="rounded w-full h-[400px] object-cover"
              />
            </div>
            <div className="border rounded-lg p-2 bg-white dark:bg-slate-700">
              <video
                src={course.promoVideo}
                controls
                className="rounded w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Course Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 bg-white dark:bg-slate-700 space-y-2">
              <p>
                <strong>Title:</strong> {course.title}
              </p>
              <p>
                <strong>Description:</strong> {course.description}
              </p>
              <p>
                <strong>Language:</strong> {course.language}
              </p>
              <p>
                <strong>Pricing:</strong>{" "}
                {course.pricingType === "free" ? "Free" : `$${course.pricing}`}
              </p>
              <p>
                <strong>Status:</strong> {course.status ? "Active" : "Inactive"}
              </p>
              <p>
                <strong>Created By:</strong> {course.createdBy}
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-white dark:bg-slate-700 space-y-2">
              <p>
                <strong>Category:</strong> {course.category?.name}
              </p>
              <p>
                <strong>Instructor:</strong>{" "}
                {`${course.instructor?.firstName} ${course.instructor?.lastName}`}
              </p>
              <p>
                <strong>Email:</strong> {course.instructor?.email}
              </p>
              <p>
                <strong>Phone:</strong> {course.instructor?.phone}
              </p>
            </div>
          </div>

          {/* Rich Text Sections */}
          {[
            { title: "What You'll Learn", html: course.whatYouLearn },
            { title: "Course Includes", html: course.courseInclude },
            { title: "Requirements", html: course.requirements },
            { title: "Target Audience", html: course.audience },
          ].map(({ title, html }) => (
            <div key={title}>
              <h3 className="text-md font-semibold border-b mb-2">{title}</h3>
              {/* <div
                className="prose dark:prose-invert max-w-full text-sm border rounded p-3 bg-white dark:bg-slate-700"
                dangerouslySetInnerHTML={{ __html: html }}
              /> */}
              <RenderHtmlContent html={html} />

            </div>
          ))}

          {/* Modules & Chapters */}
          <div>
            <h3 className="text-md font-semibold border-b mb-2">
              Modules & Chapters
            </h3>
            <div className="space-y-4">
              {course.modules?.map((mod: any, i: number) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 bg-white dark:bg-slate-700"
                >
                  <p className="font-semibold text-indigo-600 dark:text-indigo-400">
                    Module {i + 1}: {mod.name}
                  </p>

                  {mod.chapters?.map((ch: any, j: number) => (
                    <div key={j} className="ml-4 mt-3 border-t pt-2">
                      <p className="font-medium">
                        Chapter {j + 1}: {ch.title}
                      </p>

                      {/* <div
                        className="prose dark:prose-invert text-sm"
                        dangerouslySetInnerHTML={{ __html: ch.description }}
                      /> */}

                      <RenderHtmlContent html={ch.description} />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
                        <div className="border rounded-lg p-2 bg-white dark:bg-slate-700">
                          <img
                            src={
                              typeof ch.image === "string"
                                ? ch.image
                                : URL.createObjectURL(ch.image)
                            }
                            alt="Thumbnail"
                            className="rounded w-full h-[250px] object-cover"
                          />
                        </div>
                        <div className="border rounded-lg p-2 bg-white dark:bg-slate-700">
                          <video
                            src={ch.video}
                            controls
                            className="rounded w-full h-[250px] object-cover"
                          />
                        </div>
                        <div className="border rounded-lg p-2 bg-white dark:bg-slate-700">
                          <audio controls className="mx-auto my-4 w-full">
                            <source
                              src={
                                typeof ch.audio === "string"
                                  ? ch.audio
                                  : URL.createObjectURL(ch.audio)
                              }
                            />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      </div>

                      {ch.quiz?.length > 0 && (
                        <div className="mt-2 ml-4">
                          <p className="font-semibold">Quiz:</p>
                          {ch.quiz.map((q: any, k: number) => (
                            <div key={k} className="text-sm mt-1">
                              <p>
                                Q{k + 1}: {q.question}
                              </p>
                              <ul className="list-disc list-inside">
                                {q.options.map((opt: any, i: number) => (
                                  <li key={i}>{opt.name}</li>
                                ))}
                              </ul>
                              <p className="text-green-600 dark:text-green-400">
                                Answer: {q.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <Button
            disabled={addLoading}
            onClick={handleSubmit}
            className="w-full mt-4"
          >
            Publish
          </Button>
        </section>
      )}

      <div className="flex justify-between mt-4 text-xs">
        <Button variant="outline" onClick={prev} disabled={step === 1}>
          <ChevronLeft size={12} /> Back
        </Button>
        {step < 6 && (
          <Button onClick={next}>
            Next <ChevronRight size={12} />
          </Button>
        )}
      </div>
    </div>
  );
}
