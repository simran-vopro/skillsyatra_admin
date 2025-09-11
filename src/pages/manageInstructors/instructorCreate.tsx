import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Trash } from "lucide-react";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

import { useAxios } from "../../hooks/useAxios";
import { API_PATHS } from "../../utils/config";
import Label from "../../components/form/Label";

import { useAuth } from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router";
import { Instructor } from "../../types/course";


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

export default function InstructorCreate() {

  const { adminToken } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"mcq" | "yesno" | "blank">("mcq");

  const [instructor, setInstructor] = useState<Instructor>({
    _id: "",
    email: "",
    password: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
  });

  // this is came from the edit button from the instructor list to edit instructor

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
      setInstructor(courseData);
    }
  }, [courseData, courseDefaultLoading]);

  // this is came from the edit button from the instructor list to edit instructor


  // const buildCourseFormData = (instructor: Instructor, instructorStatus: string) => {


  //   const formData = new FormData();

  //   // Top-level fields
  //   formData.append("createdBy", instructor.createdBy);
  //   formData.append("title", instructor.fu);
  //   formData.append("promoVideo", instructor.promoVideo);
  //   formData.append("description", instructor.description);
  //   formData.append("language", instructor.language);
  //   formData.append("pricingType", instructor.pricingType);
  //   formData.append("pricing", instructor.pricing.toString());
  //   formData.append("instructorStatus", instructorStatus);
  //   formData.append("certificate", instructor.certificate?.toString());


  //   return formData;
  // };

  const { loading: addLoading, refetch: addCourseRequest } = useAxios({
    url: API_PATHS.ADD_COURSE,
    method: "post",
    // body: instructor,
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
    url: `${API_PATHS.EDIT_COURSE}/${instructor._id}`,
    method: "put",
    manual: true,
    config: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      Authorization: adminToken ? `Bearer ${adminToken}` : "",
    }
  });


  // const handleSubmit = async () => {
  //   const updatedCourse = { ...instructor };

  //   // const formData = buildCourseFormData(updatedCourse, "published");

  //   let response;

  //   if (instructor._id) {
  //     // Editing existing instructor
  //     response = await editCourseRequest({ body: formData });
  //   } else {
  //     // Creating new instructor
  //     response = await addCourseRequest({ body: formData });
  //   }

  //   const { success } = response;

  //   if (success) {
  //     navigate("/courses");
  //     // Clear form
  //     setInstructor({
  //       createdBy: "admin",
  //       title: "",
  //       thumbnail: "",
  //       promoVideo: "",
  //       description: "",
  //       language: "English",
  //       pricingType: "paid",
  //       pricing: 0,
  //       category: { _id: "", name: "" },
  //       instructor: {
  //         _id: "",
  //         email: "",
  //         password: "",
  //         phone: "",
  //         firstName: "",
  //         lastName: "",
  //         address: "",
  //         city: "",
  //       },
  //       whatYouLearn: "",
  //       courseInclude: "",
  //       audience: "",
  //       requirements: "",
  //       certificate: true,
  //       modules: [],
  //     });
  //   }
  // };



  const { data: instructors } = useAxios<Instructor[]>({
    url: API_PATHS.INSTRUCTORS,
    method: "get",
  });


  const filteredInstructors = useMemo(() => {
    const search = instructor.firstName.toLowerCase();
    return (
      instructors?.filter(
        (instructor: Instructor) =>
          instructor.firstName.toLowerCase().includes(search) ||
          instructor.lastName.toLowerCase().includes(search)
      ) || []
    );
  }, [instructor, instructors]);

  const next = () => setStep((s) => s + 1);

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
        Create Instructor
      </h2>

      <section className="rounded-xl p-4  bg-white dark:bg-black text-xs space-y-2">

        <div className="pt-4 space-y-2">


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
                // placeholder={label}
                value={field as keyof Instructor}
                onChange={(e) =>
                  setInstructor((prev) => ({
                    ...prev,
                    [field]: e.target.value,
                  }))
                }
              />
            </div>
          ))}
        </div>
      </section>



      <div className="flex justify-between mt-4 text-xs">
        <Button variant="outline">
          <ChevronLeft size={12} /> Cancel
        </Button>

        <Button onClick={next}>
          Submit <ChevronRight size={12} />
        </Button>

      </div>
    </div>
  );
}
